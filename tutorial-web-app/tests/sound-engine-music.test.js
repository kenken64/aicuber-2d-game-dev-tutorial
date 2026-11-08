import test from 'node:test';
import assert from 'node:assert/strict';
import { generateSoundEngineMusic } from '../sound-engine-music.mjs';

const options = { apiKey: 'secret-test-key', baseUrl: 'https://provider.example/v1', model: 'test-model', prompt: 'A peaceful forest' };
function audioStream(bytes) {
  const encoded = bytes.toString('base64');
  const pieces = [encoded.slice(0, 12), encoded.slice(12)];
  const text = pieces.map(data => `data: ${JSON.stringify({ choices: [{ delta: { audio: { data } } }] })}\n\n`).join('') + 'data: [DONE]\n\n';
  return new Response(new ReadableStream({ start(controller) { for (let i = 0; i < text.length; i += 7) controller.enqueue(new TextEncoder().encode(text.slice(i, i + 7))); controller.close(); } }));
}

test('streams and validates generated MP3 and WAV audio', async () => {
  for (const type of ['mp3', 'wav']) {
    const audio = Buffer.alloc(100);
    if (type === 'mp3') audio.write('ID3');
    else { audio.write('RIFF'); audio.write('WAVE', 8); }
    let request;
    const result = await generateSoundEngineMusic({ ...options, fetchImpl: async (url, init) => { request = { url, init }; return audioStream(audio); } });
    assert.deepEqual(result.bytes, audio);
    assert.equal(result.extension, type);
    assert.equal(result.type, type === 'mp3' ? 'audio/mpeg' : 'audio/wav');
    assert.equal(request.url, 'https://provider.example/v1/chat/completions');
    const body = JSON.parse(request.init.body);
    assert.equal(body.model, options.model);
    assert.equal(body.stream, true);
    assert.match(body.messages[0].content, /A peaceful forest/);
    assert.equal(body.audio.format, 'mp3');
  }
});

test('reports provider errors without exposing credentials or raw responses', async () => {
  for (const [response, expected] of [
    [new Response('private details', { status: 402 }), /insufficient credits/],
    [new Response('private details', { status: 429 }), /rate limited/],
    [new Response('data: {"error":{"message":"private details"}}\n\n'), /could not generate/],
    [audioStream(Buffer.alloc(100)), /unsupported audio format/],
  ]) {
    await assert.rejects(generateSoundEngineMusic({ ...options, fetchImpl: async () => response }), error => expected.test(error.message) && !error.message.includes('private details') && !error.message.includes(options.apiKey));
  }
});

test('reports interrupted streams cleanly', async () => {
  const stream = new ReadableStream({ start(controller) { controller.error(new Error('connection reset')); } });
  await assert.rejects(generateSoundEngineMusic({ ...options, fetchImpl: async () => new Response(stream) }), /stream was interrupted/);
});
