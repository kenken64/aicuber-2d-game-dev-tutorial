import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { chromium } from 'playwright-core';

const storage = await mkdtemp(join(tmpdir(), 'godot-forge-artwork-test-'));
const manifest = JSON.parse(await readFile(new URL('../../SPACES_PUBLIC_URLS.json', import.meta.url), 'utf8'));
const publishedPaths = new Set(manifest.assets.flatMap(({ localPath }) => [`/${localPath}`, `/${localPath.replace(/^tutorial-web-app\//, '')}`]));
const server = spawn(process.execPath, ['server.js'], {
  cwd: new URL('..', import.meta.url),
  env: { ...process.env, PORT: '0', APP_STORAGE_DIR: storage },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let output = '';
let browser;
try {
  const baseUrl = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Server startup timed out: ${output}`)), 10000);
    server.on('error', reject);
    server.on('exit', code => reject(new Error(`Server exited ${code}: ${output}`)));
    server.stderr.on('data', chunk => { output += chunk; });
    server.stdout.on('data', chunk => {
      output += chunk;
      const match = output.match(/http:\/\/localhost:(\d+)/);
      if (match) { clearTimeout(timer); resolve(`http://127.0.0.1:${match[1]}`); }
    });
  });
  const modules = await (await fetch(`${baseUrl}/api/modules`)).json();
  assert.equal(modules.length, 22);
  const published = await fetch(`${baseUrl}/api/published-assets/8c13118f-087c-4fc2-83e6-3462f38c5b1b.png`);
  assert.equal(published.status, 200);
  assert.match(published.headers.get('content-type'), /^image\/png/);
  assert.equal((await fetch(`${baseUrl}/api/published-assets/not-in-manifest.png`)).status, 404);
  const savedImage = manifest.assets.find(asset => asset.localPath.endsWith('/8c13118f-087c-4fc2-83e6-3462f38c5b1b.png'));
  const learnerId = 'deployment-artwork-test';
  const checkpoint = await fetch(`${baseUrl}/api/modules/storyline-engine/checkpoint`, {
    method: 'PUT', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ learnerId, state: { legacyUrl: savedImage.publicUrl, savedUrl: '/api/assets/8c13118f-087c-4fc2-83e6-3462f38c5b1b.png' } }),
  });
  assert.equal(checkpoint.status, 200);
  const savedState = await (await fetch(`${baseUrl}/api/modules/storyline-engine/checkpoint?learnerId=${learnerId}`)).json();
  assert.equal(savedState.state.legacyUrl, '/api/published-assets/8c13118f-087c-4fc2-83e6-3462f38c5b1b.png');
  assert.equal(savedState.state.savedUrl, savedState.state.legacyUrl);

  browser = await chromium.launch({ channel: process.env.CHROME_CHANNEL || 'chrome', headless: true });
  const failures = [];
  const targets = ['/', ...modules.map(module => `/${module.slug}/`)];
  let next = 0;
  await Promise.all(Array.from({ length: 4 }, async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    let target = '';
    await page.route('https://godot-forge.sgp1.digitaloceanspaces.com/**', route => {
      failures.push(`${target}: direct Spaces request ${route.request().url()}`);
      return route.abort();
    });
    await page.route('**/api/modules?learnerId=*', route => route.fulfill({ json: modules.map(module => ({ ...module, completed: true })) }));
    page.on('response', response => {
      const url = new URL(response.url());
      if (url.origin === baseUrl && /\.(png|webp|jpe?g|gif|svg)(?:$|\?)/i.test(url.pathname) && response.status() >= 400) {
        failures.push(`${target}: ${response.status()} ${url.pathname}`);
      }
      if (url.origin === baseUrl && publishedPaths.has(url.pathname) && response.ok() && response.headers()['x-asset-source'] !== 'digitalocean-spaces') {
        failures.push(`${target}: ${url.pathname} used a local file instead of published artwork`);
      }
    });
    page.on('console', message => {
      if (/texture.*(?:missing|not found)|failed to load.*(?:image|spritesheet)/i.test(message.text())) failures.push(`${target}: ${message.text()}`);
    });
    while (next < targets.length) {
      target = targets[next++];
      await page.goto(`${baseUrl}${target}`, { waitUntil: 'networkidle', timeout: 30000 });
      const broken = await page.evaluate(async () => {
        const images = [...document.images].filter(image => image.getAttribute('src') && new URL(image.src, location.href).origin === location.origin);
        for (const image of images) image.loading = 'eager';
        await Promise.all(images.map(image => image.decode().catch(() => {})));
        return images.filter(image => !image.naturalWidth).map(image => image.getAttribute('src'));
      });
      for (const src of broken) failures.push(`${target}: broken image ${src}`);
    }
    await page.close();
  }));
  assert.deepEqual(failures, []);
  console.log(`PASS published artwork with direct Spaces requests blocked across the home page and ${modules.length} modules`);
} finally {
  await browser?.close();
  if (server.exitCode === null) { const exited = once(server, 'exit'); server.kill('SIGTERM'); await exited; }
}
