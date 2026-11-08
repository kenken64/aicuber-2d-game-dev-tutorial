import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('music API validates requests, returns audio and limits generation', { timeout:20000 }, async () => {
  const audio = Buffer.alloc(100); audio.write('RIFF'); audio.write('WAVE',8);
  let calls = 0;
  const provider = http.createServer((req,res) => { calls++; assert.equal(req.headers.authorization,'Bearer test-key'); res.writeHead(200,{'content-type':'text/event-stream'}); res.end(`data: ${JSON.stringify({choices:[{delta:{audio:{data:audio.toString('base64')}}}]})}\n\ndata: [DONE]\n\n`); });
  provider.listen(0,'127.0.0.1'); await once(provider,'listening');
  const storage = await mkdtemp(join(tmpdir(),'sound-api-test-'));
  const child = spawn(process.execPath,['server.js'],{cwd:new URL('..',import.meta.url),env:{...process.env,PORT:'0',APP_STORAGE_DIR:storage,OPENAI_API_KEY:'',OPENROUTER_API_KEY:'test-key',OPENROUTER_API_BASE:`http://127.0.0.1:${provider.address().port}`},stdio:['ignore','pipe','pipe']});
  try {
    const base = await new Promise((resolve,reject) => { let output=''; const timer=setTimeout(()=>reject(new Error('Server startup timeout')),10000); child.on('error',reject); child.on('exit',code=>reject(new Error(`Server exited ${code}`))); child.stdout.on('data',chunk=>{ output+=chunk; const match=output.match(/http:\/\/localhost:(\d+)/); if(match){clearTimeout(timer);resolve(`http://127.0.0.1:${match[1]}`);} }); });
    assert.equal((await (await fetch(`${base}/api/sound-engine/music/config`)).json()).configured,true);
    const post = body => fetch(`${base}/api/sound-engine/music`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
    assert.equal((await post(null)).status,400);
    assert.equal((await post({learnerId:'music-test-learner-0001',prompt:'forest'})).status,400);
    assert.equal((await post({learnerId:'music-test-learner-0001',prompt:'x'.repeat(1001),acknowledgeCost:true})).status,400);
    for(let i=0;i<3;i++) { const response = await post({learnerId:'music-test-learner-0001',prompt:'forest',acknowledgeCost:true}); assert.equal(response.status,200); assert.equal(response.headers.get('content-type'),'audio/wav'); assert.deepEqual(Buffer.from(await response.arrayBuffer()),audio); }
    assert.equal((await post({learnerId:'music-test-learner-0001',prompt:'forest',acknowledgeCost:true})).status,429); assert.equal(calls,3);
  } finally { const exited=once(child,'exit'); child.kill('SIGTERM'); await exited; await new Promise(resolve=>provider.close(resolve)); }
});
