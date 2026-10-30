import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('OpenRouter sends server-selected model and returns compatible chat responses', { timeout: 30000 }, async () => {
  const received = [];
  const upstream = createServer(async (request, response) => {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString());
    received.push({ path: request.url, authorization: request.headers.authorization, body });
    const text = body.messages[0].content;
    const status = text === 'unauthorized' ? 401 : text === 'credits' ? 402 : text === 'limit' ? 429 : 200;
    response.writeHead(status, { 'content-type': 'application/json' });
    response.end(JSON.stringify(status !== 200 ? { error: { message: 'private upstream detail' } }
      : text === 'empty' ? { choices: [{ message: { content: null } }] }
      : { model: body.model, choices: [{ message: { role: 'assistant', content: 'Ready from OpenRouter.' } }] }));
  });
  upstream.listen(0, '127.0.0.1');
  await once(upstream, 'listening');
  const storage = await mkdtemp(join(tmpdir(), 'godot-forge-openrouter-test-'));
  const child = spawn(process.execPath, ['server.js'], {
    cwd: new URL('..', import.meta.url),
    env: { ...process.env, PORT:'0', APP_STORAGE_DIR:storage, OPENAI_API_KEY:'',
      OPENROUTER_API_KEY:'openrouter-test-secret', OPENROUTER_MODEL:'provider/configured-model',
      OPENROUTER_API_BASE:`http://127.0.0.1:${upstream.address().port}/api/v1` },
    stdio:['ignore','pipe','pipe'],
  });
  let stderr = '';
  child.stderr.on('data', chunk => { stderr += chunk; });
  try {
    const baseUrl = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Tutorial server did not start: ${stderr}`)), 15000);
      child.once('error', reject);
      child.once('exit', code => reject(new Error(`Tutorial server exited ${code}: ${stderr}`)));
      child.stdout.on('data', chunk => {
        const match = String(chunk).match(/http:\/\/localhost:(\d+)/);
        if (match) { clearTimeout(timer); resolve(`http://127.0.0.1:${match[1]}`); }
      });
    });
    const chat = messages => fetch(`${baseUrl}/api/chat`, { method:'POST', headers:{'content-type':'application/json'},
      body: JSON.stringify({ model:'client/untrusted-model', stream:false, messages }) });
    const success = await chat([{role:'user',content:'hello'}]);
    assert.equal(success.status, 200);
    assert.equal((await success.json()).message.content, 'Ready from OpenRouter.');
    assert.equal(received[0].path, '/api/v1/chat/completions');
    assert.equal(received[0].authorization, 'Bearer openrouter-test-secret');
    assert.equal(received[0].body.model, 'provider/configured-model');
    assert.deepEqual(received[0].body.messages, [{role:'user',content:'hello'}]);
    assert.equal(received[0].body.stream, false);
    for (const [message, status, pattern] of [
      ['unauthorized', 502, /OPENROUTER_API_KEY/], ['credits', 502, /credits/],
      ['limit', 429, /rate limit/], ['empty', 502, /empty or invalid/],
    ]) {
      const response = await chat([{role:'user',content:message}]);
      assert.equal(response.status, status);
      const payload = await response.json();
      assert.match(payload.error, pattern);
      assert.doesNotMatch(JSON.stringify(payload), /private upstream detail|openrouter-test-secret/);
    }
    const invalid = await chat([{role:'tool',content:'hello'}]);
    assert.equal(invalid.status, 400);
    assert.equal(received.length, 5);
  } finally {
    child.kill('SIGTERM');
    await once(child, 'exit').catch(() => {});
    upstream.close();
  }
});


test('missing OpenRouter key reports configuration error without using an Ollama proxy', { timeout: 30000 }, async () => {
  const storage = await mkdtemp(join(tmpdir(), 'godot-forge-no-openrouter-test-'));
  const child = spawn(process.execPath, ['server.js'], {
    cwd: new URL('..', import.meta.url),
    env: { ...process.env, PORT:'0', APP_STORAGE_DIR:storage, OPENROUTER_API_KEY:'',
      OLLAMA_PROXY_URL:'http://127.0.0.1:1' },
    stdio:['ignore','pipe','pipe'],
  });
  let stderr = '';
  child.stderr.on('data', chunk => { stderr += chunk; });
  try {
    const baseUrl = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Tutorial server did not start: ${stderr}`)), 15000);
      child.once('error', reject);
      child.once('exit', code => reject(new Error(`Tutorial server exited ${code}: ${stderr}`)));
      child.stdout.on('data', chunk => {
        const match = String(chunk).match(/http:\/\/localhost:(\d+)/);
        if (match) { clearTimeout(timer); resolve(`http://127.0.0.1:${match[1]}`); }
      });
    });
    const response = await fetch(`${baseUrl}/api/chat`, { method:'POST', headers:{'content-type':'application/json'},
      body:JSON.stringify({ messages:[{role:'user',content:'hello'}] }) });
    assert.equal(response.status, 503);
    assert.match((await response.json()).error, /OPENROUTER_API_KEY/);
  } finally {
    child.kill('SIGTERM');
    await once(child, 'exit').catch(() => {});
  }
});
