import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';
import { chromium } from 'playwright-core';
import { quizQuestionBank } from '../quiz-question-bank.mjs';
import { quizQuestionTranslations } from '../quiz-question-translations.mjs';
import { detailedQuizExplanation } from '../quiz-answer-details.mjs';

const work = await mkdtemp(join(tmpdir(), 'godot-forge-answers-test-'));
const passcode = 'test-module-reset-password';
async function startServer(configuredPasscode) {
  const child = spawn(process.execPath, ['server.js'], {
    cwd: new URL('..', import.meta.url),
    env: { ...process.env, PORT: '0', APP_STORAGE_DIR: await mkdtemp(join(work, 'storage-')), OPENAI_API_KEY: '', MODULE_RESET_PASSCODE: configuredPasscode, MARKETPLACE_AUTH_REQUIRED: 'false', GAME_DEV_TUTORIAL_SESSION_SECRET: '' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  const url = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Server startup timed out: ${output}`)), 10000);
    child.on('error', reject);
    child.on('exit', code => reject(new Error(`Server exited ${code}: ${output}`)));
    child.stderr.on('data', chunk => { output += chunk; });
    child.stdout.on('data', chunk => { output += chunk; const match = output.match(/http:\/\/localhost:(\d+)/); if (match) { clearTimeout(timer); resolve(`http://127.0.0.1:${match[1]}`); } });
  });
  return { child, url };
}
async function stopServer(server) { if (server.child.exitCode === null) { const done = once(server.child, 'exit'); server.child.kill('SIGTERM'); await done; } }
const post = (url, body) => fetch(`${url}/api/quizzes/math-stem-physics-quiz/answer-sheet`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
let browser;
let server;
try {
  for (const question of quizQuestionBank) for (const locale of ['en', 'zh', 'ms']) assert.ok(detailedQuizExplanation(question.id, locale), `missing ${locale} explanation for ${question.id}`);
  const unconfigured = await startServer('');
  try { assert.equal((await post(unconfigured.url, { passcode })).status, 503); }
  finally { await stopServer(unconfigured); }
  server = await startServer(passcode);
  assert.equal((await post(server.url, {})).status, 403);
  assert.equal((await post(server.url, { passcode: 'incorrect' })).status, 403);
  assert.equal((await fetch(`${server.url}/api/quizzes/math-stem-physics-quiz/answer-sheet`)).status, 404);
  for (const file of ['quiz-question-bank.mjs', 'quiz-question-translations.mjs', 'quiz-answer-details.mjs', 'quiz-answer-pdf.mjs']) {
    assert.equal((await fetch(`${server.url}/${file}`)).status, 404);
    assert.equal((await fetch(`${server.url}/tutorial-web-app/${file}`)).status, 404);
  }
  const questionBank = await (await fetch(`${server.url}/api/quizzes/math-stem-physics-quiz`)).json();
  assert.equal(questionBank.length, 40);
  assert.ok(questionBank.every(question => !Object.hasOwn(question, 'correctOption')));
  for (const locale of ['en', 'zh', 'ms']) {
    const response = await post(server.url, { passcode, locale });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('content-type'), 'application/pdf');
    assert.equal(response.headers.get('cache-control'), 'no-store');
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(bytes.subarray(0, 5).toString(), '%PDF-');
    const file = join(work, `${locale}.pdf`);
    await writeFile(file, bytes);
    const locked = spawnSync('pdftotext', ['-layout', file, '-'], { encoding: 'utf8' });
    if (!locked.error) assert.notEqual(locked.status, 0, 'PDF requires a passcode to open');
    const wrong = spawnSync('pdftotext', ['-upw', 'wrong-password', '-layout', file, '-'], { encoding: 'utf8' });
    if (!wrong.error) assert.notEqual(wrong.status, 0, 'PDF rejects the wrong passcode');
    const metadata = spawnSync('pdfinfo', ['-upw', passcode, file], { encoding: 'utf8' });
    if (!metadata.error) { assert.equal(metadata.status, 0); assert.match(metadata.stdout, /Encrypted:\s+yes \(print:yes/); }
    const extracted = spawnSync('pdftotext', ['-upw', passcode, '-layout', file, '-'], { encoding: 'utf8' });
    if (!extracted.error) {
      assert.equal(extracted.status, 0);
      const content = extracted.stdout;
      const answerLabel = { en: 'Correct answer:', zh: '正确答案:', ms: 'Jawapan betul:' }[locale];
      assert.equal(content.split(answerLabel).length - 1, 40, `all answers should be present in ${locale}`);
      const firstQuestion = quizQuestionBank[0];
      const firstChoices = quizQuestionTranslations[locale]?.[firstQuestion.id]?.options || firstQuestion.options;
      for (const [index, option] of firstChoices.entries()) assert.ok(content.includes(`${String.fromCharCode(65 + index)}. ${option}`), `missing ${locale} option ${index + 1}`);
      assert.match(content, /https:\/\/godotengine\.org\/article\/first-public-release\//);
      const pages = content.split('\f').filter(page => page.trim());
      assert.ok(pages.length < 14, `no blank pages in ${locale}`);
      assert.ok(pages.every(page => page.replace(/(?:Page|Halaman|页)\s*\d+\s*\/\s*\d+/g, '').trim().length > 50), `every ${locale} page has content`);
    }
  }
  browser = await chromium.launch({ channel: process.env.CHROME_CHANNEL || 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${server.url}/math-stem-physics-quiz/`);
  await page.waitForSelector('.quiz-card');
  assert.match(await page.locator('#answered-count').textContent(), /0 \/ 40/);
  await page.click('#download-answer-sheet');
  assert.equal(await page.locator('#answer-sheet-passcode').getAttribute('type'), 'password');
  await page.fill('#answer-sheet-passcode', 'wrong');
  await page.click('#answer-sheet-submit');
  await page.locator('#answer-sheet-error').getByText('Incorrect passcode. Please try again.').waitFor();
  assert.equal(await page.locator('#answer-sheet-dialog').isVisible(), true);
  await page.fill('#answer-sheet-passcode', passcode);
  const downloadPromise = page.waitForEvent('download');
  await page.click('#answer-sheet-submit');
  const download = await downloadPromise;
  assert.equal(download.suggestedFilename(), 'godot-forge-quiz-answers-en.pdf');
  const downloaded = join(work, 'downloaded.pdf');
  await download.saveAs(downloaded);
  assert.equal((await readFile(downloaded)).subarray(0, 5).toString(), '%PDF-');
  assert.equal(await page.locator('#answer-sheet-dialog').isVisible(), false);
  assert.equal(await page.locator('#answer-sheet-passcode').inputValue(), '');
  assert.match(await page.locator('#answered-count').textContent(), /0 \/ 40/);
  await page.click('#quiz-language-toggle [data-locale="zh"]');
  assert.match(await page.locator('#download-answer-sheet').textContent(), /下载/);
  await page.click('#download-answer-sheet');
  assert.match(await page.locator('#answer-sheet-label').textContent(), /重置密码/);
  await page.fill('#answer-sheet-passcode', passcode);
  const chineseDownload = page.waitForEvent('download');
  await page.click('#answer-sheet-submit');
  const chineseFile = await chineseDownload;
  assert.equal(chineseFile.suggestedFilename(), 'godot-forge-quiz-answers-zh.pdf');
  await chineseFile.saveAs(join(work, 'downloaded-zh.pdf'));
  console.log('PASS passcode-protected, localized 40-question PDF downloads; source protection and unchanged quiz progress');
} finally {
  await browser?.close();
  if (server) await stopServer(server);
}
