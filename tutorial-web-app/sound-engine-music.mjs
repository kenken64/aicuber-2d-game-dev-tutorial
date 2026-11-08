const MAX_AUDIO_BASE64 = 32 * 1024 * 1024;

// Keep credentials and provider responses on the server; only return validated audio.
export async function generateSoundEngineMusic({ apiKey, baseUrl, model, prompt, fetchImpl = fetch }) {
  let response;
  try {
    response = await fetchImpl(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json', 'x-title': 'Godot Forge Sound Engine' },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: `Create instrumental background music for a video game, with no vocals. ${prompt}` }],
        modalities: ['text', 'audio'],
        audio: { voice: 'alloy', format: 'mp3' },
        stream: true,
      }),
      signal: AbortSignal.timeout(120000),
    });
  } catch {
    throw new Error('The music service could not be reached. Please try again.');
  }
  if (!response.ok) {
    const message = response.status === 402 ? 'OpenRouter has insufficient credits for music generation.'
      : response.status === 401 || response.status === 403 ? 'The OpenRouter key cannot access this music model.'
      : response.status === 429 ? 'The music service is busy or rate limited. Please try again later.'
      : 'The music service could not generate a track. Please try again.';
    throw new Error(message);
  }
  if (!response.body) throw new Error('The music service returned no audio.');
  let pending = '';
  let length = 0;
  const parts = [];
  const decoder = new TextDecoder();
  function handleLine(line) {
    line = line.trim();
    if (!line.startsWith('data:')) return;
    const payload = line.slice(5).trim();
    if (!payload || payload === '[DONE]') return;
    let event;
    try { event = JSON.parse(payload); } catch { throw new Error('The music service returned an invalid stream.'); }
    if (event.error) throw new Error('The music service could not generate a track. Please try again.');
    for (const choice of event.choices || []) {
      const data = choice.delta?.audio?.data ?? choice.message?.audio?.data;
      if (typeof data === 'string') {
        length += data.length;
        if (length > MAX_AUDIO_BASE64) throw new Error('The generated audio exceeded the size limit.');
        parts.push(data);
      }
    }
  }
  try {
    for await (const chunk of response.body) {
      pending += decoder.decode(chunk, { stream: true });
      let newline;
      while ((newline = pending.indexOf('\n')) !== -1) {
        handleLine(pending.slice(0, newline));
        pending = pending.slice(newline + 1);
      }
      if (pending.length > MAX_AUDIO_BASE64) throw new Error('The generated audio exceeded the size limit.');
    }
    pending += decoder.decode();
    if (pending.trim()) handleLine(pending);
  } catch (error) {
    if (error.message.startsWith('The music service') || error.message.startsWith('The generated audio')) throw error;
    throw new Error('The music stream was interrupted. Please try again.');
  }
  const encoded = parts.join('');
  if (!encoded || !/^[A-Za-z0-9+/]*={0,2}$/.test(encoded)) throw new Error('The music service returned no valid audio.');
  const bytes = Buffer.from(encoded, 'base64');
  if (bytes.length < 44) throw new Error('The music service returned an unsupported audio format.');
  if (bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WAVE') return { bytes, type: 'audio/wav', extension: 'wav' };
  if (bytes.toString('ascii', 0, 3) === 'ID3' || (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0)) return { bytes, type: 'audio/mpeg', extension: 'mp3' };
  throw new Error('The music service returned an unsupported audio format.');
}
