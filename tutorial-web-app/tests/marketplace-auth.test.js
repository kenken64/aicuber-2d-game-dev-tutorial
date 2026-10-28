import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash, createHmac } from 'node:crypto';
import { createServer } from 'node:http';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { WebSocket } from 'ws';
import { chromium } from 'playwright-core';
import { createMarketplaceAuth, marketplaceToolId } from '../marketplace-auth.mjs';

const secret = 'tutorial-test-secret-'.repeat(3);
function token(claims, key = secret) {
  const data = [{ alg: 'HS256', typ: 'JWT' }, claims].map(value => Buffer.from(JSON.stringify(value)).toString('base64url')).join('.');
  return `${data}.${createHmac('sha256', key).update(data).digest('base64url')}`;
}
function claims(user = 'alice') {
  const now = Math.floor(Date.now() / 1000);
  return { iss: '2ndBrain.ceo', tool_id: marketplaceToolId, user_id: user, install_id: `${user}-install`, iat: now - 5, exp: now + 300 };
}
test('standalone mode and incomplete marketplace configuration', () => {
  assert.equal(createMarketplaceAuth({}).enabled, false);
  assert.throws(() => createMarketplaceAuth({ MARKETPLACE_AUTH_REQUIRED: 'true' }), /SESSION_SECRET/);
  assert.throws(() => createMarketplaceAuth({ GAME_DEV_TUTORIAL_SESSION_SECRET: secret }), /VERIFY_SECRET/);
});

test('real server launch, account progress, revocation, and WebSocket access', { timeout: 30000 }, async () => {
  const seen = [];
  let active = true;
  const verifier = createServer(async (request, response) => {
    assert.equal(request.headers.authorization, `Bearer ${secret}`);
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    seen.push(JSON.parse(Buffer.concat(chunks).toString()));
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ active }));
  });
  verifier.listen(0, '127.0.0.1');
  await once(verifier, 'listening');
  const storage = await mkdtemp(join(tmpdir(), 'game-marketplace-auth-'));
  const reservation = createServer();
  reservation.listen(0, '127.0.0.1');
  await once(reservation, 'listening');
  const appPort = reservation.address().port;
  await new Promise(resolve => reservation.close(resolve));
  const child = spawn(process.execPath, ['server.js'], {
    cwd: new URL('..', import.meta.url),
    env: { ...process.env, PORT: String(appPort), APP_STORAGE_DIR: storage, MARKETPLACE_AUTH_REQUIRED: 'true',
      APP_ORIGIN: `http://127.0.0.1:${appPort}`, GAME_DEV_TUTORIAL_SESSION_SECRET: secret,
      MARKETPLACE_LAUNCH_VERIFY_SECRET: secret,
      MARKETPLACE_LAUNCH_VERIFY_URL: `http://127.0.0.1:${verifier.address().port}/verify` },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '', errors = '';
  child.stderr.on('data', chunk => { errors += chunk; });
  try {
    const base = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Startup timeout: ${errors}`)), 10000);
      child.once('error', error => { clearTimeout(timer); reject(error); });
      child.once('exit', code => { clearTimeout(timer); reject(new Error(`Server exited ${code}: ${errors}`)); });
      child.stdout.on('data', chunk => {
        output += chunk;
        const match = output.match(/http:\/\/localhost:(\d+)/);
        if (match) { clearTimeout(timer); resolve(`http://127.0.0.1:${match[1]}`); }
      });
    });
    const get = (path, cookie, options = {}) => fetch(base + path, { redirect: 'manual', ...options, headers: { ...(cookie ? { cookie } : {}), ...options.headers } });
    const launch = c => get(`/api/2ndbrain/launch?launch_token=${encodeURIComponent(token(c))}`);
    const health = await get('/api/health');
    assert.deepEqual(await health.json(), { ok: true });
    for (const path of ['/', '/api/modules', '/character-creation/', '/app.js', '/api/2ndbrain/session.js']) assert.equal((await get(path)).status, 401);
    for (const c of [ { ...claims(), tool_id: 'meeting-minutes' }, { ...claims(), exp: 1 }, { ...claims(), iat: Math.floor(Date.now() / 1000) + 60 }, { ...claims(), user_id: '' }, { ...claims(), purpose: 'session' } ]) assert.equal((await launch(c)).status, 401);
    assert.equal((await get(`/api/2ndbrain/launch?launch_token=${token(claims(), 'wrong-secret')}`)).status, 401);
    const alice = claims();
    const launched = await launch(alice);
    assert.equal(launched.status, 303);
    assert.equal(launched.headers.get('location'), '/');
    assert.equal(launched.headers.get('referrer-policy'), 'no-referrer');
    assert.match(launched.headers.get('set-cookie'), /HttpOnly; SameSite=Lax/);
    const aliceCookie = launched.headers.get('set-cookie').split(';')[0];
    assert.equal((await launch(alice)).status, 401, 'a launch token cannot be exchanged twice');
    assert.equal((await get('/api/modules', aliceCookie.replace(/.$/, 'x'))).status, 401);
    assert.equal((await get('/', aliceCookie, { headers: { origin: 'https://other.example' } })).status, 403);
    assert.equal((await get('/', aliceCookie, { headers: { 'sec-fetch-site': 'cross-site' } })).status, 200, 'top-level marketplace redirects may retain cross-site fetch metadata');
    assert.equal((await get('/api/modules/game-controls/progress', aliceCookie, { method: 'PATCH', headers: { 'sec-fetch-site': 'cross-site' } })).status, 403);
    const html = await (await get('/', aliceCookie)).text();
    assert.match(html, /<head[^>]*><script src="\/api\/2ndbrain\/session.js"><\/script>/i);
    const script = await (await get('/api/2ndbrain/session.js', aliceCookie)).text();
    assert.ok(script.includes(createHash('sha256').update('alice').digest('hex')));
    assert.equal((await get('/api/2ndbrain/session', aliceCookie)).status, 200);
    assert.equal(seen.at(-1).issuedAt, alice.iat, 'session checks preserve the launch issue time');
    const save = await get('/api/modules/game-controls/progress', aliceCookie, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ learnerId: 'someone-elses-learner-id', completed: true }) });
    assert.equal(save.status, 200);
    const modules = await (await get('/api/modules?learnerId=someone-elses-learner-id', aliceCookie)).json();
    assert.equal(modules.find(m => m.slug === 'game-controls').completed, true);
    const bobLaunch = await launch(claims('bob'));
    const bobCookie = bobLaunch.headers.get('set-cookie').split(';')[0];
    const bobModules = await (await get('/api/modules?learnerId=' + createHash('sha256').update('alice').digest('hex'), bobCookie)).json();
    assert.equal(bobModules.find(m => m.slug === 'game-controls').completed, false, 'client learner IDs cannot select another account');
    for (const path of ['/ws/multiplayer', '/ws/final-game']) {
      const denied = new WebSocket(base.replace('http:', 'ws:') + path);
      await assert.rejects(once(denied, 'open'), /401/);
      const allowed = new WebSocket(base.replace('http:', 'ws:') + path, { headers: { cookie: aliceCookie } });
      await once(allowed, 'open');
      const closed = once(allowed, 'close');
      allowed.close();
      await closed;
    }
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    try {
      const page = await browser.newPage();
      await page.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
      await page.goto(`${base}/api/2ndbrain/launch?launch_token=${token(claims('browser-user'))}`);
      assert.equal(page.url(), base + '/');
      assert.equal(await page.evaluate(() => localStorage.getItem('godot-forge-learner-id')), createHash('sha256').update('browser-user').digest('hex'));
      assert.equal(await page.evaluate(async () => (await fetch('/api/modules/game-controls/progress', { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ completed: true }) })).status), 200, 'browser requests work with the public origin');
      await page.goto(`${base}/game-controls/`);
      assert.equal(await page.evaluate(() => localStorage.getItem('godot-forge-learner-id')), createHash('sha256').update('browser-user').digest('hex'));
    } finally { await browser.close(); }
    active = false;
    assert.equal((await get('/api/modules', aliceCookie)).status, 401, 'logout, disabled account, or uninstall revokes session');
    assert.equal((await launch(claims('revoked'))).status, 401);
    active = true;
    await new Promise(resolve => verifier.close(resolve));
    assert.equal((await get('/api/modules', aliceCookie)).status, 401, 'verification outage fails closed');
  } finally {
    if (child.exitCode === null) { const exited = once(child, 'exit'); child.kill('SIGTERM'); await exited; }
    if (verifier.listening) await new Promise(resolve => verifier.close(resolve));
    await rm(storage, { recursive: true, force: true });
  }
});
