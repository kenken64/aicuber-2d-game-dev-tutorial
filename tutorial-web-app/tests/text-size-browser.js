import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { chromium } from 'playwright-core';

const storage = await mkdtemp(join(tmpdir(), 'godot-forge-text-size-'));
const server = spawn(process.execPath, ['server.js'], {
  cwd: new URL('..', import.meta.url),
  env: { ...process.env, PORT: '0', APP_STORAGE_DIR: storage, OPENAI_API_KEY: '' },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let output = '';
let browser;
try {
  const base = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Server startup timed out: ${output}`)), 10000);
    server.once('error', reject);
    server.once('exit', code => reject(new Error(`Server exited ${code}: ${output}`)));
    const read = chunk => { output += chunk; const match = output.match(/http:\/\/localhost:(\d+)/); if (match) { clearTimeout(timer); resolve(`http://127.0.0.1:${match[1]}`); } };
    server.stdout.on('data', read); server.stderr.on('data', read);
  });
  browser = await chromium.launch({ channel: process.env.CHROME_CHANNEL || 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.route('**/api/modules?learnerId=*', async route => {
    const response = await route.fetch();
    const modules = await response.json();
    await route.fulfill({ response, json: modules.map(module => ({ ...module, completed: true })) });
  });
  const modules = await (await page.request.get(`${base}/api/modules`)).json();
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  const controls = page.locator('#text-size-controls');
  await controls.waitFor();
  const originalHeight = await page.locator('h1').first().evaluate(element => element.getBoundingClientRect().height);
  await controls.getByRole('button', { name: 'Increase text size' }).click();
  await controls.getByRole('button', { name: 'Increase text size' }).click();
  assert.equal(await controls.locator('.text-size-value').textContent(), '125%');
  assert.ok(await page.locator('h1').first().evaluate(element => element.getBoundingClientRect().height) > originalHeight * 1.05);
  assert.equal(await page.evaluate(() => localStorage.getItem('godot-forge-text-size')), '125');
  for (const module of modules) {
    await page.goto(`${base}/${module.slug}/`, { waitUntil: 'domcontentloaded' });
    await controls.waitFor({ timeout: 8000 });
    assert.equal(await controls.locator('.text-size-value').textContent(), '125%', `${module.slug} inherits saved size`);
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).zoom), '1.25');
  }
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['/', '/character-creation/', '/game-physics/', '/final-game/']) {
    await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded' });
    await controls.waitFor();
    assert.ok(await controls.isVisible(), `${route} mobile controls are visible`);
    const scrollWidth = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: innerWidth }));
    assert.ok(scrollWidth.width <= scrollWidth.viewport + 2, `${route} does not overflow at 125%: ${JSON.stringify(scrollWidth)}`);
  }
  await controls.getByRole('button', { name: 'Decrease text size' }).click();
  assert.equal(await controls.locator('.text-size-value').textContent(), '110%');
  await controls.getByRole('button', { name: 'Reset text size' }).click();
  assert.equal(await controls.locator('.text-size-value').textContent(), '100%');
  await page.locator('#languages button[data-locale="zh"]').click();
  await page.waitForFunction(() => document.querySelector('#text-size-controls')?.getAttribute('aria-label') === '页面文字大小');
  await page.locator('#languages button[data-locale="ms"]').click();
  await page.waitForFunction(() => document.querySelector('#text-size-controls')?.getAttribute('aria-label') === 'Saiz teks halaman');
  console.log(`PASS shared text-size controls, zoom and persistence across ${modules.length} modules, plus mobile layout`);
} finally {
  await browser?.close();
  if (server.exitCode === null) { const exited = once(server, 'exit'); server.kill('SIGTERM'); await exited; }
}
