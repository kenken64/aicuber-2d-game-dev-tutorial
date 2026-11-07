import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { chromium } from 'playwright-core';

const storage = await mkdtemp(join(tmpdir(), 'godot-forge-walkthrough-test-'));
const server = spawn(process.execPath, ['server.js'], {
  cwd: new URL('..', import.meta.url),
  env: { ...process.env, PORT: '0', APP_STORAGE_DIR: storage, OPENAI_API_KEY: '' },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let output = '';
server.stdout.on('data', chunk => { output += chunk; });
let baseUrl;
try {
  baseUrl = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`Walkthrough server timed out: ${output}`)), 10000);
    server.once('error', error => { clearTimeout(timeout); reject(error); });
    server.once('exit', code => { clearTimeout(timeout); reject(new Error(`Walkthrough server exited ${code}: ${output}`)); });
    server.stdout.on('data', chunk => {
      const match = `${output}${chunk}`.match(/http:\/\/localhost:(\d+)/);
      if (match) { clearTimeout(timeout); resolve(`http://127.0.0.1:${match[1]}`); }
    });
  });
  const browser = await chromium.launch({ channel: process.env.CHROME_CHANNEL || 'chrome', headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ['clipboard-read', 'clipboard-write'] });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.stack));
    // The separate prerequisite test covers unlocking; this test exercises the walkthrough itself.
    await page.route('**/api/modules?learnerId=*', async route => {
      const response = await route.fetch();
      const modules = await response.json();
      await route.fulfill({ response, json: modules.map(module => module.level <= 19 ? { ...module, completed: true } : module) });
    });
    await page.goto(`${baseUrl}/final-game/#player`);
    await page.waitForFunction(() => !document.documentElement.hasAttribute('data-module-gated'));
    await page.locator('#player .writing-stepper').waitFor();
    const preview = page.locator('#game-preview-image');
    const previewToggle = page.locator('#game-preview-toggle');
    assert.equal((await page.request.get(`${baseUrl}/final-game/media/gameplay-preview.gif`)).status(), 200);
    assert.equal((await page.request.get(`${baseUrl}/final-game/media/gameplay-preview-still.png`)).status(), 200);
    await page.waitForFunction(() => document.querySelector('#game-preview-image').naturalWidth > 0);
    assert.match(await preview.getAttribute('src'), /gameplay-preview\.gif$/);
    await previewToggle.click();
    assert.match(await preview.getAttribute('src'), /gameplay-preview-still\.png$/);
    assert.match(await previewToggle.textContent(), /Play animation/);
    await previewToggle.click();
    assert.match(await preview.getAttribute('src'), /gameplay-preview\.gif$/);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => document.querySelector('#game-preview-image').getAttribute('src').endsWith('gameplay-preview-still.png'));
    assert.match(await preview.getAttribute('src'), /gameplay-preview-still\.png$/);
    assert.match(await previewToggle.textContent(), /Play animation/);
    await page.reload();
    await page.waitForFunction(() => !document.documentElement.hasAttribute('data-module-gated'));
    assert.match(await preview.getAttribute('src'), /gameplay-preview-still\.png$/);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    assert.match(await page.locator('#local-editor-title').textContent(), /computer/i);
    assert.match(await page.locator('#cloud-editor-title').textContent(), /cloud/i);
    assert.match(await page.locator('[data-copy="localStepTwo"]').textContent(), /Import.*project\.godot/);
    assert.match(await page.locator('[data-copy="editorSyncNote"]').textContent(), /do not sync automatically/);
    assert.equal(await page.locator('.editor-option a[href="/api/final-game/starter-kit"]').count(), 1);
    assert.equal(await page.locator('.editor-option a[href="/setup-godot-with-ai/#cloud-title"]').count(), 1);
    assert.equal(await page.locator('.writing-stepper').count(), 9);
    assert.equal(await page.locator('.copy-code').count(), 0);
    assert.ok(await page.locator('.file-reference').count() > 0);
    const initialHint = page.locator('#player .file-reference').first();
    assert.match(await initialHint.locator('summary').textContent(), /GDScript hint/);
    assert.equal(await initialHint.locator('.gdscript').isVisible(), false);
    await initialHint.locator('summary').click();
    assert.equal(await initialHint.locator('.gdscript').isVisible(), true);
    assert.match(await initialHint.locator('.gdscript code').textContent(), /func _physics_process/);
    await initialHint.locator('summary').click();

    const audit = await page.evaluate(() => {
      const normalize = value => value.split('\n').map(line => line.trim()).filter(Boolean).join('\n');
      const missing = [];
      const invalid = [];
      const incomplete = [];
      for (const section of window.finalGameGuide) {
        const tasks = window.finalGameWriting.makeTasks(section, window.finalGameWalkthrough, window.finalGameFunctionDetails);
        for (const file of section.files || []) {
          const actual = tasks.filter(task => task.kind === 'code' && task.fileName === file.name).map(task => task.code).join('\n');
          if (normalize(actual) !== normalize(window.finalGameWriting.codeToAdd(file))) incomplete.push(file.name);
          const functions = [...file.code.matchAll(/^func\s+(\w+)\s*\(|^static func\s+(\w+)\s*\(/gm)];
          for (let index = 0; index < functions.length; index++) {
            const name = functions[index][1] || functions[index][2];
            const body = file.code.slice(functions[index].index, functions[index + 1]?.index || file.code.length);
            const steps = window.finalGameFunctionDetails[file.name]?.[name];
            if (!steps?.length) { missing.push(`${file.name}:${name}`); continue; }
            for (const [snippet, explanation] of steps) {
              if (!body.includes(snippet) || !explanation) invalid.push(`${file.name}:${name}: ${snippet}`);
            }
          }
        }
      }
      const online = window.finalGameGuide.flatMap(section => section.files || []).find(file => file.name === 'scripts/Online.gd');
      return { missing, invalid, incomplete, relayResolved: !window.finalGameWriting.codeToAdd(online).includes('__RELAY_URL__') };
    });
    assert.deepEqual(audit, { missing: [], invalid: [], incomplete: [], relayResolved: true });
    const examples = await page.evaluate(() => {
      const files = window.finalGameGuide.flatMap(section => section.files || []);
      return {
        main: files.find(file => file.name === 'scripts/Main.gd').code,
        pickup: files.find(file => file.name === 'scripts/Pickup.gd').code,
        relay: window.finalGameWriting.relayUrl(),
      };
    });
    assert.match(examples.main, /var local_coop: bool =/);
    assert.match(examples.main, /p1\.add_collision_exception_with\(p2\)/);
    assert.ok(examples.main.includes('CREDITS\\nDesign: your name'));
    assert.match(examples.pickup, /heart_texture/);
    for (const name of ['GamepadBindings', 'ControlsMenu', 'Player', 'Enemy', 'Main', 'Pickup']) {
      const expected = await readFile(new URL(`../../final-game/starter-project/reference-code/${name}.gd.txt`, import.meta.url), 'utf8');
      const shown = await page.evaluate(fileName => window.finalGameGuide.flatMap(section => section.files || [])
        .find(file => file.name === `scripts/${fileName}.gd`).code, name);
      assert.equal(shown.trim(), expected.trim(), `${name} starter reference matches the lesson`);
    }
    assert.match(examples.relay, /^ws:\/\/127\.0\.0\.1:/);

    await page.locator('#plan .writing-done').click();
    assert.match(await page.locator('#plan .writing-count').textContent(), /2 OF 5/);
    await page.reload();
    assert.match(await page.locator('#plan .writing-count').textContent(), /2 OF 5/);
    await page.locator('#plan .writing-done').click();
    await page.locator('#plan .writing-done').click();
    assert.match(await page.locator('#plan .step-code').textContent(), /var attack_bonus := 0/);
    assert.ok((await page.locator('#plan .step-code').textContent()).length < 70);

    const combatSetupCount = await page.evaluate(() => window.finalGameGuide.find(section => section.id === 'combat').steps.length);
    for (let index = 0; index < combatSetupCount; index++) await page.locator('#combat .writing-done').click();
    assert.equal(await page.locator('#combat .step-code').count(), 0);
    assert.match(await page.locator('#combat .step-outline').textContent(), /____/);
    await page.locator('#combat .writing-help').click();
    assert.ok((await page.locator('#combat .writing-hint').textContent()).length > 20);
    await page.locator('#combat .writing-reveal').click();
    assert.ok((await page.locator('#combat .step-code').textContent()).length < 300);

    const playerCount = await page.evaluate(() => window.finalGameWriting.makeTasks(
      window.finalGameGuide.find(section => section.id === 'player'),
      window.finalGameWalkthrough, window.finalGameFunctionDetails).length);
    for (let index = 0; index < playerCount; index++) await page.locator('#player .writing-done').click();
    assert.equal(await page.locator('#player .file-reference').count(), 2);
    assert.equal(await page.locator('.copy-code').count(), 0);
    await page.locator('#player .file-reference').first().locator('summary').click();
    const playerCode = page.locator('#player .file-reference').first().locator('.gdscript code');
    const rawCode = await playerCode.textContent();
    await page.locator('#player .file-reference').first().locator('[data-symbol="_physics_process"]').first().click();
    assert.match(await page.locator('#player .file-reference').first().locator('.symbol-detail').textContent(), /Runs every physics frame/);
    assert.match(await page.locator('#player .file-reference').first().locator('.symbol-detail').textContent(), /host-received movement/);
    assert.ok(await page.locator('#player .file-reference').first().locator('.function-steps li').count() > 4);

    await page.click('[data-locale="zh"]');
    assert.match(await previewToggle.textContent(), /暂停动画|播放动画/);
    assert.match(await page.locator('#local-editor-title').textContent(), /本机/);
    assert.match(await page.locator('#cloud-editor-title').textContent(), /云端/);
    await page.locator('#player .file-reference').first().locator('summary').click();
    assert.equal(await page.locator('#player .logic-panel h4').first().textContent(), '逻辑流程');
    assert.equal(await page.locator('#player .gdscript code').first().textContent(), rawCode);
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.locator('.editor-options').evaluate(element => getComputedStyle(element).gridTemplateColumns.split(' ').length), 1);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.deepEqual(errors, []);
    console.log('PASS small writing steps, full code coverage, optional complete-script hints, saved progress, walkthrough, localization, and mobile layout');
  } finally { await browser.close(); }
} finally { if (server.exitCode === null) { const exited = once(server, 'exit'); server.kill('SIGTERM'); await exited; } }
