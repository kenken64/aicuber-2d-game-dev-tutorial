import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export const marketplaceToolId = '2d-game-dev-tutorial';
const cookieName = 'game_dev_session';
const sessionSeconds = 8 * 60 * 60;

// No marketplace configuration means standalone mode. Partial configuration
// must never silently expose a service intended for marketplace access.
export function createMarketplaceAuth(env = process.env) {
  const enabled = env.MARKETPLACE_AUTH_REQUIRED === 'true' || Boolean(env.GAME_DEV_TUTORIAL_SESSION_SECRET?.trim());
  const secret = env.GAME_DEV_TUTORIAL_SESSION_SECRET?.trim();
  const verifySecret = env.MARKETPLACE_LAUNCH_VERIFY_SECRET?.trim();
  let origin, verifyUrl;
  if (enabled) {
    if (!secret || Buffer.byteLength(secret) < 32) throw new Error('GAME_DEV_TUTORIAL_SESSION_SECRET must be at least 32 bytes');
    if (!verifySecret || Buffer.byteLength(verifySecret) < 32) throw new Error('MARKETPLACE_LAUNCH_VERIFY_SECRET must be at least 32 bytes');
    origin = new URL(env.APP_ORIGIN).origin;
    verifyUrl = new URL(env.MARKETPLACE_LAUNCH_VERIFY_URL);
    for (const url of [new URL(origin), verifyUrl]) {
      if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))) {
        throw new Error('Marketplace URLs must use HTTPS (except localhost)');
      }
    }
  }
  const secure = origin?.startsWith('https:') ? '; Secure' : '';
  const cookie = (token, age) => `${cookieName}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${age}${secure}`;
  const sign = data => createHmac('sha256', secret).update(data).digest('base64url');
  const encode = claims => {
    const data = [{ alg: 'HS256', typ: 'JWT' }, claims].map(value => Buffer.from(JSON.stringify(value)).toString('base64url')).join('.');
    return `${data}.${sign(data)}`;
  };
  function decode(token, session = false) {
    try {
      if (typeof token !== 'string' || token.length > 8192) return null;
      const parts = token.split('.');
      if (parts.length !== 3 || parts.some(part => !/^[A-Za-z0-9_-]+$/.test(part))) return null;
      const actual = Buffer.from(parts[2], 'base64url');
      const expected = Buffer.from(sign(parts.slice(0, 2).join('.')), 'base64url');
      if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
      const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
      const claims = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
      const now = Math.floor(Date.now() / 1000);
      if (header.alg !== 'HS256' || header.typ !== 'JWT' || claims.iss !== '2ndBrain.ceo' || claims.tool_id !== marketplaceToolId ||
          typeof claims.user_id !== 'string' || !claims.user_id || claims.user_id.length > 200 ||
          typeof claims.install_id !== 'string' || !claims.install_id || claims.install_id.length > 200 ||
          !Number.isInteger(claims.iat) || claims.iat > now + 30 || !Number.isInteger(claims.exp) || claims.exp <= now || claims.exp <= claims.iat ||
          (session ? claims.purpose !== 'session' || claims.exp - claims.iat > sessionSeconds : claims.purpose !== undefined || claims.exp - claims.iat > 3600)) return null;
      return claims;
    } catch { return null; }
  }
  async function active(claims) {
    try {
      const response = await fetch(verifyUrl, {
        method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${verifySecret}` },
        body: JSON.stringify({ userId: claims.user_id, installId: claims.install_id, toolId: claims.tool_id, issuedAt: claims.iat }),
        cache: 'no-store', signal: AbortSignal.timeout(5000), redirect: 'error',
      });
      return response.ok && (await response.json()).active === true;
    } catch { return false; }
  }
  async function authenticate(request) {
    const token = request.headers.cookie?.split(';').map(part => part.trim()).find(part => part.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
    const claims = decode(token, true);
    return claims && await active(claims) ? claims : null;
  }
  function reject(response, status = 401) {
    response.writeHead(status, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store', 'set-cookie': cookie('', 0) });
    response.end('Open AI CUBER and launch 2D Game Development Tutorial from My Workflows.');
  }
  const usedLaunches = new Map();
  async function handle(request, response, url) {
    if (!enabled) return false;
    response.setHeader('cache-control', 'no-store');
    response.setHeader('referrer-policy', 'no-referrer');
    if (url.pathname === '/api/health' && ['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(200, { 'content-type': 'application/json' });
      response.end(request.method === 'HEAD' ? undefined : JSON.stringify({ ok: true }));
      return true;
    }
    if (url.pathname === '/api/2ndbrain/launch') {
      if (request.method !== 'GET') { reject(response, 405); return true; }
      const token = url.searchParams.get('launch_token');
      const claims = decode(token);
      const now = Math.floor(Date.now() / 1000);
      for (const [key, exp] of usedLaunches) if (exp <= now) usedLaunches.delete(key);
      if (!claims || !await active(claims) || usedLaunches.has(token)) { reject(response); return true; }
      usedLaunches.set(token, claims.exp);
      // Preserve the original iat so logout revocation cannot be bypassed by
      // exchanging a previously issued launch token for a newer session.
      const session = encode({ ...claims, purpose: 'session', exp: Math.min(now + sessionSeconds, claims.iat + sessionSeconds) });
      response.writeHead(303, { location: '/', 'set-cookie': cookie(session, sessionSeconds) });
      response.end();
      return true;
    }
    if ((request.headers['sec-fetch-site'] === 'cross-site' && !['GET', 'HEAD'].includes(request.method)) ||
        (request.headers.origin && request.headers.origin !== origin)) { reject(response, 403); return true; }
    const claims = await authenticate(request);
    if (!claims) { reject(response); return true; }
    request.marketplaceLearnerId = createHash('sha256').update(claims.user_id).digest('hex');
    url.searchParams.set('learnerId', request.marketplaceLearnerId);
    if (url.pathname === '/api/2ndbrain/session.js' && request.method === 'GET') {
      response.writeHead(200, { 'content-type': 'text/javascript; charset=utf-8' });
      response.end(`localStorage.setItem('godot-forge-learner-id', ${JSON.stringify(request.marketplaceLearnerId)});\nsetInterval(async () => { try { const r = await fetch('/api/2ndbrain/session', {cache:'no-store'}); if (!r.ok) location.replace('/'); } catch { location.replace('/'); } }, 60000);`);
      return true;
    }
    if (url.pathname === '/api/2ndbrain/session' && request.method === 'GET') {
      response.writeHead(200, { 'content-type': 'application/json' });
      response.end(JSON.stringify({ active: true }));
      return true;
    }
    return false;
  }
  async function authorizeUpgrade(request, socket) {
    if (!enabled) return true;
    if ((request.headers.origin && request.headers.origin !== origin) || !await authenticate(request)) {
      socket.end('HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n');
      return false;
    }
    const timer = setInterval(async () => { if (!await authenticate(request)) socket.destroy(); }, 30000);
    timer.unref();
    socket.once('close', () => clearInterval(timer));
    return true;
  }
  return { enabled, handle, authorizeUpgrade };
}
