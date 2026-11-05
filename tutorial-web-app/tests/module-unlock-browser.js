import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { chromium } from 'playwright-core';
import { quizQuestionBank } from '../quiz-question-bank.mjs';

const storage = await mkdtemp(join(tmpdir(), 'godot-forge-unlock-test-'));
const server = spawn(process.execPath, ['server.js'], {
  cwd: new URL('..', import.meta.url),
  env: { ...process.env, PORT: '0', APP_STORAGE_DIR: storage, OPENAI_API_KEY: '', MARKETPLACE_AUTH_REQUIRED: 'false', GAME_DEV_TUTORIAL_SESSION_SECRET: '' },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let output = '';
let browser;
try {
  const base = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Server startup timed out: ${output}`)), 10000);
    server.on('error', reject);
    server.on('exit', code => reject(new Error(`Server exited ${code}: ${output}`)));
    server.stdout.on('data', chunk => { output += chunk; const match = output.match(/http:\/\/localhost:(\d+)/); if (match) { clearTimeout(timer); resolve(`http://127.0.0.1:${match[1]}`); } });
  });
  const learnerId = 'unlock-test-learner-0001';
  const setProgress = (slug, completed) => fetch(`${base}/api/modules/${slug}/progress`, {
    method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ learnerId, completed }),
  });
  const modules = await (await fetch(`${base}/api/modules?learnerId=${learnerId}`)).json();
  const prerequisites = modules.filter(module => module.level <= 19);
  const gated = modules.filter(module => module.level >= 20);
  assert.equal(prerequisites.length, 19);
  assert.equal(gated.length, 3);
  for (const module of gated) assert.equal((await setProgress(module.slug, true)).status, 403);

  browser = await chromium.launch({ channel: process.env.CHROME_CHANNEL || 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.addInitScript(id => localStorage.setItem('godot-forge-learner-id', id), learnerId);
  await page.goto(base);
  await page.waitForFunction(() => document.querySelectorAll('.module-card').length === 22);
  assert.equal(await page.locator('#module-nav .nav-item.locked[aria-disabled="true"]').count(), 3);
  for (const module of gated) {
    const card = page.locator(`#module-${module.slug}`);
    assert.match(await card.locator('.module-lock-reason').textContent(), /1–19/);
    assert.equal(await card.locator('.complete-button').isDisabled(), true);
    assert.equal(await card.locator('a.card-action').count(), 0);
    await page.goto(`${base}/${module.slug}/`);
    await page.waitForSelector('#module-gate');
    assert.match(await page.locator('#module-gate').textContent(), /0 of 19/);
    await page.goto(base);
    await page.waitForFunction(() => document.querySelectorAll('.module-card').length === 22);
  }
  assert.match(await page.locator('#module-microbit-gamepad h3').textContent(), /^BONUS/);
  assert.match(await page.locator('#module-items-spawning .complete-button').getAttribute('title'), /two hits/);
  assert.match(await page.locator('#module-microbit-gamepad .complete-button').getAttribute('title'), /1–19/);

  const completionControls = {
    'character-creation': '#lesson-mark-complete', 'game-assets-creation': '#complete-module',
    'boss-creation': '#complete-module', 'storyline-engine': '#complete-story',
    'parallax-tiling-map': '#complete-module', 'items-spawning': '#complete-module',
    'enemies-ai': '#complete-module', 'game-loop-engine': '#lesson-mark-complete',
    'game-controls': '#complete-module', 'game-settings': '#complete-module',
    'game-physics': '#complete-module', 'game-ending-cutscene': '#complete-module',
    'credits': '#complete-module', 'marketplace-system': '#complete',
    'game-achievement': '#complete-module', 'game-leaderboard': '#complete-module',
    'local-coop': '#complete-module', 'multiplayer-game': '#complete-module',
    'math-stem-physics-quiz': '#complete',
  };
  for (const module of prerequisites) {
    await page.goto(`${base}/${module.slug}/`, { waitUntil: 'domcontentloaded' });
    const button = page.locator(completionControls[module.slug]);
    await button.waitFor({ state: 'visible' });
    const help = page.locator('.completion-hint-help');
    await help.waitFor({ state: 'visible' });
    await help.focus();
    const tooltip = page.locator('#completion-requirement-tooltip');
    await tooltip.waitFor({ state: 'visible' });
    assert.ok((await tooltip.textContent()).trim().length > 20, `${module.slug} explains how to complete`);
    assert.match(await button.getAttribute('aria-describedby'), /completion-requirement-tooltip/);
    const bounds = await tooltip.boundingBox();
    assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= 1440, `${module.slug} tooltip fits on screen`);
    await page.keyboard.press('Escape');
    assert.equal(await tooltip.isHidden(), true, `${module.slug} tooltip dismisses with Escape`);
    if (module.slug === 'items-spawning') {
      await page.click('[data-locale="zh"]');
      assert.match(await tooltip.textContent(), /蛮兽/);
      await page.click('[data-locale="en"]');
      assert.match(await tooltip.textContent(), /grove brute/);
    }
    const appearance = await button.evaluate(element => {
      const wasDisabled = element.disabled;
      element.style.setProperty('transition', 'none', 'important');
      element.disabled = false;
      const style = getComputedStyle(element);
      const value = [style.width, style.minHeight, style.fontSize, style.fontFamily, style.backgroundColor, style.color];
      element.disabled = wasDisabled;
      element.style.removeProperty('transition');
      return value;
    });
    assert.deepEqual(appearance, ['190px', '46px', '11px', 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', 'rgb(196, 242, 101)', 'rgb(20, 33, 25)'], `${module.slug} completion style`);
    if (module.level === 19) assert.equal(await button.isDisabled(), true, 'quiz completion requires a passing score');
  }
  for (const slug of ['character-creation', 'game-assets-creation', 'boss-creation', 'game-loop-engine']) {
    await page.goto(`${base}/${slug}/`);
    const button = page.locator(completionControls[slug]);
    await page.waitForFunction(selector => !document.querySelector(selector).disabled, completionControls[slug]);
    await button.click();
    await page.waitForFunction(selector => /REOPEN/.test(document.querySelector(selector).textContent), completionControls[slug]);
    await page.reload();
    await page.waitForFunction(selector => /REOPEN/.test(document.querySelector(selector).textContent), completionControls[slug]);
    await button.click();
    await page.waitForFunction(selector => /MARK/.test(document.querySelector(selector).textContent), completionControls[slug]);
  }
  await page.goto(base);
  await page.waitForFunction(() => document.querySelectorAll('.module-card').length === 22);
  for (const module of prerequisites.filter(module => module.level < 19)) assert.equal((await setProgress(module.slug, true)).status, 200);
  await page.reload();
  await page.waitForFunction(() => document.querySelectorAll('.module-card').length === 22);
  assert.equal(await page.locator('#module-nav .nav-item.locked').count(), 3, 'quiz is still required');
  for (const question of quizQuestionBank) {
    const response = await fetch(`${base}/api/quizzes/math-stem-physics-quiz/answer`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ learnerId, questionId: question.id, option: question.correctOption }),
    });
    assert.equal(response.status, 200);
  }
  assert.equal((await setProgress('math-stem-physics-quiz', true)).status, 200);
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  await page.waitForFunction(() => document.querySelectorAll('#module-nav .nav-item.locked').length === 0);
  assert.equal(await page.locator('#module-nav .nav-item.locked').count(), 0);
  for (const module of gated) {
    await page.goto(base);
    await page.waitForFunction(() => document.querySelectorAll('.module-card').length === 22);
    assert.equal(await page.locator(`#module-${module.slug} a.card-action`).count(), 1);
    await page.goto(`${base}/${module.slug}/`);
    await page.waitForFunction(() => !document.documentElement.hasAttribute('data-module-gated'));
    const selector = module.slug === 'final-game' ? '#lesson-mark-complete' : '#complete';
    const button = page.locator(selector);
    await button.waitFor({ state: 'visible' });
    const help = page.locator('.completion-hint-help');
    await help.waitFor({ state: 'visible' });
    await help.click();
    assert.equal(await page.locator('#completion-requirement-tooltip').isVisible(), true);
    assert.equal(await help.getAttribute('aria-expanded'), 'true');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#completion-requirement-tooltip').isHidden(), true);
    await page.waitForFunction(selector => !document.querySelector(selector).disabled, selector);
    const appearance = await button.evaluate(element => { const style = getComputedStyle(element); return [style.width, style.minHeight, style.fontSize, style.fontFamily, style.backgroundColor, style.color]; });
    assert.deepEqual(appearance, ['190px', '46px', '11px', 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', 'rgb(196, 242, 101)', 'rgb(20, 33, 25)'], `${module.slug} completion style`);
    const saved = page.waitForResponse(response => response.url().endsWith(`/api/modules/${module.slug}/progress`) && response.ok());
    await button.click();
    await saved;
    assert.equal((await (await fetch(`${base}/api/modules?learnerId=${learnerId}`)).json()).find(item => item.slug === module.slug).completed, true);
    if (module.slug === 'microbit-gamepad') assert.match(await page.locator('h1').first().textContent(), /^BONUS/);
  }
  assert.equal((await setProgress('character-creation', false)).status, 200);
  await page.goto(base);
  await page.waitForFunction(() => document.querySelectorAll('.module-card').length === 22);
  assert.equal(await page.locator('#module-nav .nav-item.locked').count(), 3);
  const restored = await (await fetch(`${base}/api/modules?learnerId=${learnerId}`)).json();
  assert.ok(restored.filter(module => module.level >= 20).every(module => module.completed), 'existing later progress is preserved');
  assert.equal((await setProgress('microbit-gamepad', true)).status, 403);
  console.log('PASS: locked navigation and direct visits, all 19 prerequisites including quiz, BONUS label, unlock, relock and preserved progress.');
} finally {
  if (browser) await browser.close();
  if (server.exitCode === null) { const exited = once(server, 'exit'); server.kill('SIGTERM'); await exited; }
}
