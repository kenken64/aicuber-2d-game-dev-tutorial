import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { chromium } from 'playwright-core';

const storage = await mkdtemp(join(tmpdir(), 'sound-engine-test-'));
const server = spawn(process.execPath, ['server.js'], { cwd: new URL('..', import.meta.url), env: { ...process.env, PORT:'0', APP_STORAGE_DIR:storage, OPENROUTER_API_KEY:'', OPENAI_API_KEY:'', MODULE_RESET_PASSCODE:'test-reset' }, stdio:['ignore','pipe','pipe'] });
let browser;
try {
  const base = await new Promise((resolve,reject) => { let output = ''; const timer = setTimeout(() => reject(new Error('Server startup timed out')), 10000); server.on('error',reject); server.on('exit',code => reject(new Error(`Server exited ${code}`))); server.stdout.on('data',chunk => { output += chunk; const match = output.match(/http:\/\/localhost:(\d+)/); if (match) { clearTimeout(timer); resolve(`http://127.0.0.1:${match[1]}`); } }); });
  browser = await chromium.launch({ channel:'chrome', headless:true });
  const page = await browser.newPage({ viewport:{width:1200,height:900}, acceptDownloads:true });
  await page.addInitScript(() => { HTMLMediaElement.prototype.play = function() { this.dispatchEvent(new Event('play')); return Promise.resolve(); }; HTMLMediaElement.prototype.pause = function() {}; });
  await page.goto(`${base}/sound-engine/`);
  await page.waitForFunction(() => document.querySelector('#music-status').textContent.includes('not configured'));
  assert.equal(await page.locator('#generate-music').isDisabled(), true);
  assert.equal(await page.locator('#complete-module').isDisabled(), true);
  await page.click('#example-music');
  assert.equal(await page.locator('#download-music').isVisible(), true);
  for (const name of ['jump','coin','sword']) {
    const download = page.waitForEvent('download');
    await page.click(`[data-download="${name}"]`);
    const file = await download;
    assert.equal(file.suggestedFilename(), `game-${name}.wav`);
    const path = join(storage, `${name}.wav`); await file.saveAs(path);
    const bytes = await readFile(path); assert.equal(bytes.toString('ascii',0,4),'RIFF'); assert.equal(bytes.toString('ascii',8,12),'WAVE'); assert.ok(bytes.length > 1000);
    await page.click(`[data-effect="${name}"]`);
    if (name === 'jump' || name === 'sword') {
      const frames = await page.locator('#hero-sprite').evaluate((sprite, action) => {
        const animations = sprite.getAnimations();
        for (const animation of animations) animation.pause();
        const times = action === 'jump' ? [40, 200, 350, 540] : [30, 150, 270, 390];
        return times.map(time => {
          for (const animation of animations) animation.currentTime = time;
          const style = getComputedStyle(sprite);
          return { position: style.backgroundPosition, transform: style.transform };
        });
      }, name);
      const row = name === 'jump' ? '66.6667%' : '50%';
      assert.deepEqual(frames.map(frame => frame.position), [`0% ${row}`, `14.2857% ${row}`, `28.5714% ${row}`, `42.8571% ${row}`]);
      if (name === 'jump') assert.notEqual(frames[2].transform, frames[0].transform, 'jump rises and lands');
      else assert.ok(frames.every(frame => frame.transform === 'none'), 'sword attack uses sprite poses without rotating the whole player');
    }
  }
  assert.equal(await page.locator('#complete-module').isEnabled(), true);
  await page.click('#complete-module');
  await page.waitForFunction(() => document.querySelector('#complete-module').textContent.includes('COMPLETE'));
  await page.reload();
  await page.waitForFunction(() => document.querySelector('#complete-module').textContent.includes('COMPLETE ✓'));
  await page.click('[data-locale="zh"]'); assert.match(await page.locator('#godot-guide-title').textContent(), /Godot/);
  await page.setViewportSize({width:390,height:844});
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.route('**/api/sound-engine/music/config', route => route.fulfill({json:{configured:true}}));
  let submitted;
  const music = Buffer.alloc(100); music.write('RI3'); music.write('RIFF',0); music.write('WAVE',8);
  await page.route('**/api/sound-engine/music', route => { submitted = route.request().postDataJSON(); return route.fulfill({status:200,contentType:'audio/wav',body:music}); });
  await page.reload(); await page.waitForFunction(() => !document.querySelector('#generate-music').disabled);
  await page.fill('#music-prompt','A magical forest'); await page.click('#generate-music');
  await page.waitForFunction(() => !document.querySelector('#download-music').hidden);
  assert.equal(submitted.prompt,'A magical forest'); assert.equal(submitted.acknowledgeCost,true); assert.ok(submitted.learnerId);
  const track = page.waitForEvent('download'); await page.click('#download-music'); assert.equal((await track).suggestedFilename(),'game-background-music.wav');
  console.log('PASS Sound Engine local previews, WAV downloads, completion, localization, mobile and mocked music generation');
} finally { await browser?.close(); const exit = once(server,'exit'); server.kill('SIGTERM'); await exit; }
