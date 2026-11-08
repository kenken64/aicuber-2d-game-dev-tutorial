import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { chromium } from 'playwright-core';

async function startServer(passcode) {
  const storage = await mkdtemp(join(tmpdir(), 'godot-forge-reset-test-'));
  const child = spawn(process.execPath, ['server.js'], {
    cwd: new URL('..', import.meta.url),
    env: { ...process.env, PORT: '0', APP_STORAGE_DIR: storage, OPENAI_API_KEY: '', MODULE_RESET_PASSCODE: passcode, MARKETPLACE_AUTH_REQUIRED: 'false', GAME_DEV_TUTORIAL_SESSION_SECRET: '' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  const base = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Server startup timed out: ${output}`)), 10000);
    child.on('error', reject);
    child.on('exit', code => reject(new Error(`Server exited ${code}: ${output}`)));
    child.stdout.on('data', chunk => { output += chunk; const match = output.match(/http:\/\/localhost:(\d+)/); if (match) { clearTimeout(timer); resolve(`http://127.0.0.1:${match[1]}`); } });
  });
  return { base, stop: async () => { const exited = once(child, 'exit'); child.kill('SIGTERM'); await exited; } };
}

const learnerId = 'reset-passcode-test-learner-0001';
const otherLearner = 'reset-passcode-test-learner-0002';
const passcode = 'test-reset-passcode';
const unconfigured = await startServer('');
try {
  const response = await fetch(`${unconfigured.base}/api/modules/game-settings/reset`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ learnerId, passcode }) });
  assert.equal(response.status, 503, 'resets fail closed if no passcode is configured');
} finally { await unconfigured.stop(); }

const server = await startServer(passcode);
let browser;
try {
  const checkpoint = async (id, value) => fetch(`${server.base}/api/modules/game-settings/checkpoint`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ learnerId: id, state: { value } }) });
  const getCheckpoint = async id => (await (await fetch(`${server.base}/api/modules/game-settings/checkpoint?learnerId=${id}`)).json()).state;
  const reset = data => fetch(`${server.base}/api/modules/game-settings/reset`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
  await checkpoint(learnerId, 'keep until authorized');
  await checkpoint(otherLearner, 'another learner');
  await fetch(`${server.base}/api/modules/game-settings/progress`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ learnerId, completed: true }) });
  assert.equal((await reset({ learnerId })).status, 403);
  assert.equal((await reset({ learnerId, passcode: 'incorrect' })).status, 403);
  assert.equal((await getCheckpoint(learnerId)).value, 'keep until authorized');
  assert.equal((await (await fetch(`${server.base}/api/modules?learnerId=${learnerId}`)).json()).find(module => module.slug === 'game-settings').completed, true);
  assert.equal((await fetch(`${server.base}/.env`)).status, 404);

  browser = await chromium.launch({ channel: process.env.CHROME_CHANNEL || 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.addInitScript(id => localStorage.setItem('godot-forge-learner-id', id), learnerId);
  await page.goto(server.base);
  await page.waitForFunction(() => document.querySelectorAll('.module-card').length === 23);
  await page.evaluate(() => localStorage.setItem('godot-forge-music', 'keep-until-reset'));
  await page.click('#module-game-settings .reset-module-button');
  assert.equal(await page.locator('#module-reset-dialog').isVisible(), true);
  assert.equal(await page.locator('#module-reset-passcode').getAttribute('type'), 'password');
  await page.fill('#module-reset-passcode', 'incorrect');
  const denied = page.waitForResponse(response => response.url().endsWith('/api/modules/game-settings/reset') && response.status() === 403);
  await page.click('#module-reset-submit'); await denied;
  await page.waitForFunction(() => document.querySelector('#module-reset-error').textContent.includes('Incorrect'));
  assert.equal(await page.locator('#module-reset-dialog').isVisible(), true);
  assert.equal(await page.evaluate(() => localStorage.getItem('godot-forge-music')), 'keep-until-reset');
  assert.equal((await getCheckpoint(learnerId)).value, 'keep until authorized');
  await page.fill('#module-reset-passcode', passcode);
  const accepted = page.waitForResponse(response => response.url().endsWith('/api/modules/game-settings/reset') && response.ok());
  await page.click('#module-reset-submit'); await accepted;
  await page.waitForFunction(() => !document.querySelector('#module-reset-dialog').open);
  assert.equal(await getCheckpoint(learnerId), null);
  assert.equal((await getCheckpoint(otherLearner)).value, 'another learner');
  assert.equal(await page.evaluate(() => localStorage.getItem('godot-forge-music')), null);
  assert.equal((await (await fetch(`${server.base}/api/modules?learnerId=${learnerId}`)).json()).find(module => module.slug === 'game-settings').completed, false);
  console.log('PASS: reset passcode required by server and dialog; failed attempts preserve progress; correct passcode resets only the selected learner and module.');
} finally {
  if (browser) await browser.close();
  await server.stop();
}
