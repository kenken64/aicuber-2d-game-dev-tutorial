import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';
import { chromium } from 'playwright-core';
import { quizQuestionBank } from '../quiz-question-bank.mjs';
import { makeCertificatePdf, validateCertificateName } from '../certificate-pdf.mjs';

const storage = await mkdtemp(join(tmpdir(), 'godot-forge-certificate-test-'));
const passcode = 'certificate-test-passcode';
const learnerId = 'certificate-student-test-0001';
async function startServer(password, directory) {
  const child = spawn(process.execPath, ['server.js'], { cwd: new URL('..', import.meta.url), env: { ...process.env, PORT: '0', APP_STORAGE_DIR: directory, OPENAI_API_KEY: '', MODULE_RESET_PASSCODE: password, MARKETPLACE_AUTH_REQUIRED: 'false', GAME_DEV_TUTORIAL_SESSION_SECRET: '' }, stdio: ['ignore', 'pipe', 'pipe'] });
  let output = '';
  const base = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Server timed out: ${output}`)), 10000);
    child.on('error', reject);
    child.on('exit', code => reject(new Error(`Server exited ${code}: ${output}`)));
    child.stderr.on('data', chunk => { output += chunk; });
    child.stdout.on('data', chunk => { output += chunk; const match = output.match(/http:\/\/localhost:(\d+)/); if (match) { clearTimeout(timer); resolve(`http://127.0.0.1:${match[1]}`); } });
  });
  return { child, base };
}
async function stopServer(server) { if (server.child.exitCode === null) { const exited = once(server.child, 'exit'); server.child.kill('SIGTERM'); await exited; } }
const post = (base, path, payload) => fetch(`${base}${path}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
let browser, server;
try {
  for (const name of ['陈晓明', 'தமிழ் செல்வன்', 'अनुष्का शर्मा', 'Siti Nur Aisyah']) assert.equal(validateCertificateName(name).name, name);
  assert.equal(validateCertificateName('محمد علي').error, 'unsupported');
  const datePdf = join(storage, 'date-test.pdf');
  await writeFile(datePdf, await makeCertificatePdf('Test Student', 'en', new Date('2026-11-06T18:00:00Z'), 'Asia/Singapore'));
  const dateText = spawnSync('pdftotext', [datePdf, '-'], { encoding: 'utf8' });
  if (!dateText.error) { assert.equal(dateText.status, 0); assert.match(dateText.stdout, /7 November 2026/); }
  const unconfigured = await startServer('', await mkdtemp(join(storage, 'unconfigured-')));
  try { assert.equal((await post(unconfigured.base, '/api/certificates/authorize', { learnerId, passcode })).status, 503); }
  finally { await stopServer(unconfigured); }
  server = await startServer(passcode, await mkdtemp(join(storage, 'configured-')));
  const { base } = server;
  const auth = value => post(base, '/api/certificates/authorize', { learnerId, passcode: value });
  const issue = body => post(base, '/api/certificates/issue', { learnerId, ...body });
  assert.equal((await auth('wrong')).status, 403);
  assert.equal((await auth(passcode)).status, 409);
  assert.equal((await issue({ name: 'Student' })).status, 403);
  const modules = await (await fetch(`${base}/api/modules?learnerId=${learnerId}`)).json();
  assert.equal(modules.length, 22);
  const setProgress = (slug, completed) => fetch(`${base}/api/modules/${slug}/progress`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ learnerId, completed }) });
  for (const module of modules.filter(module => module.level <= 18)) assert.equal((await setProgress(module.slug, true)).status, 200);
  for (const question of quizQuestionBank) assert.equal((await post(base, '/api/quizzes/math-stem-physics-quiz/answer', { learnerId, questionId: question.id, option: question.correctOption })).status, 200);
  assert.equal((await setProgress('math-stem-physics-quiz', true)).status, 200);
  for (const module of modules.filter(module => module.level === 20 || module.level === 21)) assert.equal((await setProgress(module.slug, true)).status, 200);
  assert.equal((await auth(passcode)).status, 409, 'bonus module is required for 100%');
  assert.equal((await setProgress('microbit-gamepad', true)).status, 200);
  const authorization = await auth(passcode);
  assert.equal(authorization.status, 200);
  assert.equal(authorization.headers.get('cache-control'), 'no-store');
  const { token } = await authorization.json();
  assert.ok(token.length >= 40);
  assert.equal((await post(base, '/api/certificates/issue', { learnerId: 'different-student-0001', token, name: 'Student' })).status, 403);
  assert.equal((await issue({ token, name: '' })).status, 400);
  const unsupported = await issue({ token, name: 'Student 🌟' });
  assert.equal(unsupported.status, 400);
  assert.equal((await unsupported.json()).error, 'unsupported');
  const certificate = await issue({ token, name: '陈晓明', locale: 'zh' });
  assert.equal(certificate.status, 200);
  assert.equal(certificate.headers.get('content-type'), 'application/pdf');
  assert.equal(certificate.headers.get('cache-control'), 'no-store');
  assert.equal((await issue({ token, name: 'Other student' })).status, 403, 'approval cannot be reused');
  const certificatePath = join(storage, 'certificate-zh.pdf');
  await writeFile(certificatePath, Buffer.from(await certificate.arrayBuffer()));
  const extracted = spawnSync('pdftotext', [certificatePath, '-'], { encoding: 'utf8' });
  if (!extracted.error) { assert.equal(extracted.status, 0); assert.match(extracted.stdout, /陈晓明/); assert.match(extracted.stdout, /课程完成证书/); }
  const info = spawnSync('pdfinfo', [certificatePath], { encoding: 'utf8' });
  if (!info.error) { assert.equal(info.status, 0); assert.match(info.stdout, /Pages:\s+1/); assert.match(info.stdout, /Encrypted:\s+no/); }
  const images = spawnSync('pdfimages', ['-list', certificatePath], { encoding: 'utf8' });
  if (!images.error) { assert.equal(images.status, 0); assert.match(images.stdout, /image\s+2172\s+724/); }
  const next = await (await auth(passcode)).json();
  assert.equal((await setProgress('microbit-gamepad', false)).status, 200);
  assert.equal((await issue({ token: next.token, name: 'Student' })).status, 409, 'completion is checked again at issue time');
  assert.equal((await setProgress('microbit-gamepad', true)).status, 200);

  browser = await chromium.launch({ channel: process.env.CHROME_CHANNEL || 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.addInitScript(id => localStorage.setItem('godot-forge-learner-id', id), learnerId);
  await page.goto(base);
  await page.waitForFunction(() => document.querySelectorAll('.module-card').length === 22);
  assert.equal(await page.locator('#certificate-open').isEnabled(), true);
  await page.click('#certificate-open');
  assert.equal(await page.locator('#certificate-passcode').getAttribute('type'), 'password');
  assert.equal(await page.locator('#certificate-name-form').isHidden(), true);
  await page.fill('#certificate-passcode', 'wrong');
  await page.click('#certificate-authorize');
  await page.locator('#certificate-error').getByText('Incorrect passcode. Please try again.').waitFor();
  assert.equal(await page.locator('#certificate-name-form').isHidden(), true);
  await page.fill('#certificate-passcode', passcode);
  await page.click('#certificate-authorize');
  await page.locator('#certificate-name-form').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#certificate-passcode').inputValue(), '');
  await page.fill('#certificate-name', 'Siti Nur Aisyah');
  const downloaded = page.waitForEvent('download');
  await page.click('#certificate-issue');
  const file = await downloaded;
  assert.equal(file.suggestedFilename(), 'godot-forge-certificate.pdf');
  const filePath = join(storage, 'student-certificate.pdf');
  await file.saveAs(filePath);
  assert.equal((await readFile(filePath)).subarray(0, 5).toString(), '%PDF-');
  const studentText = spawnSync('pdftotext', [filePath, '-'], { encoding: 'utf8' });
  if (!studentText.error) assert.match(studentText.stdout, /Siti Nur Aisyah/);
  assert.equal(await page.locator('#certificate-dialog').isVisible(), false);
  assert.equal(await page.locator('#certificate-name').inputValue(), '');
  await setProgress('microbit-gamepad', false);
  await page.reload();
  await page.waitForFunction(() => document.querySelectorAll('.module-card').length === 22);
  assert.equal(await page.locator('#certificate-open').isDisabled(), true);
  assert.match(await page.locator('#certificate-status').textContent(), /21 \/ 22/);
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  console.log('PASS 100% completion, bonus requirement, instructor approval, student name, single-use authorization and certificate download');
} finally {
  await browser?.close();
  if (server) await stopServer(server);
}
