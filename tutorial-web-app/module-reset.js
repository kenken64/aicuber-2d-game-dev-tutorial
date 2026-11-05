// Reset one module's learner state. Generated files remain in the asset library.
(() => {
  const copy = {
    en: { reset: 'RESET MODULE', resetCurrent: 'RESET THIS MODULE', title: 'Reset this module?', warning: 'Enter the reset passcode to clear this module’s progress and current work. Saved artwork stays in the library.', passcode: 'Reset passcode', cancel: 'CANCEL', confirm: 'RESET MODULE', incorrect: 'Incorrect passcode. Please try again.', unavailable: 'Reset is not configured on the server. Contact the administrator.', failed: 'Could not reset the module. Please try again.' },
    zh: { reset: '重置模块', resetCurrent: '重置当前模块', title: '重置此模块？', warning: '请输入重置密码，清除本模块的进度和当前工作。已保存的图片仍会保留。', passcode: '重置密码', cancel: '取消', confirm: '重置模块', incorrect: '密码不正确，请重试。', unavailable: '服务器尚未配置重置密码，请联系管理员。', failed: '无法重置模块，请重试。' },
    ms: { reset: 'SET SEMULA MODUL', resetCurrent: 'SET SEMULA MODUL INI', title: 'Set semula modul ini?', warning: 'Masukkan kod laluan untuk memadam kemajuan dan kerja semasa modul ini. Karya yang disimpan kekal dalam pustaka.', passcode: 'Kod laluan set semula', cancel: 'BATAL', confirm: 'SET SEMULA MODUL', incorrect: 'Kod laluan salah. Sila cuba lagi.', unavailable: 'Kod set semula belum dikonfigurasi pada pelayan. Hubungi pentadbir.', failed: 'Modul tidak dapat diset semula. Sila cuba lagi.' },
  };
  const currentSlug = document.body.dataset.module || location.pathname.split('/')[1] || '';
  const originalFetch = window.fetch.bind(window);
  const pendingWrites = new Map();
  let resettingSlug = null;

  // Finish earlier checkpoint and completion saves before resetting. Ignore
  // later writes from the old page until it reloads.
  window.fetch = (...args) => {
    const [input, init] = args;
    const method = String(init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();
    const url = new URL(input instanceof Request ? input.url : String(input), location.href);
    const match = url.origin === location.origin && (method === 'PUT' || method === 'PATCH')
      ? url.pathname.match(/^\/api\/modules\/([^/]+)\/(checkpoint|progress)$/)
      : null;
    if (!match || (match[2] === 'checkpoint' ? method !== 'PUT' : method !== 'PATCH')) return originalFetch(...args);
    const slug = decodeURIComponent(match[1]);
    if (slug === resettingSlug) return Promise.resolve(new Response('{"saved":false,"resetting":true}', { status: 200, headers: { 'content-type': 'application/json' } }));
    const request = originalFetch(...args);
    if (!pendingWrites.has(slug)) pendingWrites.set(slug, new Set());
    const pending = pendingWrites.get(slug);
    pending.add(request);
    request.then(() => pending.delete(request), () => pending.delete(request));
    return request;
  };

  function clearModuleStorage(slug, id) {
    const keys = {
      'game-controls': ['godot-forge-gamepad-mapping'],
      'game-settings': ['godot-forge-music', 'godot-forge-sound'],
      'game-ending-cutscene': ['godot-forge-ending-cutscene-choice'],
      'marketplace-system': [`godot-forge-marketplace:${id}`],
    }[slug] || [];
    keys.forEach(key => localStorage.removeItem(key));
  }
  const language = () => {
    const locale = localStorage.getItem('godot-forge-locale');
    return copy[locale] ? locale : 'en';
  };
  const learnerId = () => {
    const key = 'godot-forge-learner-id';
    let value = localStorage.getItem(key);
    if (!value) { value = crypto.randomUUID().replace(/-/g, ''); localStorage.setItem(key, value); }
    return value;
  };

  const dialog = document.createElement('dialog');
  dialog.id = 'module-reset-dialog';
  dialog.setAttribute('aria-labelledby', 'module-reset-title');
  dialog.setAttribute('aria-describedby', 'module-reset-description');
  dialog.innerHTML = `<form id="module-reset-form"><h2 id="module-reset-title"></h2><p id="module-reset-description"></p><label for="module-reset-passcode" id="module-reset-label"></label><input id="module-reset-passcode" type="password" autocomplete="off" maxlength="128" required /><p id="module-reset-error" role="alert"></p><div class="module-reset-actions"><button id="module-reset-cancel" type="button"></button><button id="module-reset-submit" type="submit"></button></div></form>`;
  document.body.append(dialog);
  const form = dialog.querySelector('#module-reset-form');
  const passcode = dialog.querySelector('#module-reset-passcode');
  const error = dialog.querySelector('#module-reset-error');
  const submit = dialog.querySelector('#module-reset-submit');
  const cancel = dialog.querySelector('#module-reset-cancel');
  let selectedButton = null;
  let selectedSlug = '';
  let busy = false;

  function showResetDialog(button, slug) {
    const text = copy[language()];
    selectedButton = button; selectedSlug = slug;
    dialog.querySelector('#module-reset-title').textContent = text.title;
    dialog.querySelector('#module-reset-description').textContent = text.warning;
    dialog.querySelector('#module-reset-label').textContent = text.passcode;
    cancel.textContent = text.cancel; submit.textContent = text.confirm;
    passcode.value = ''; error.textContent = '';
    dialog.showModal(); passcode.focus();
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('.reset-module-button');
    if (!button || button.disabled || dialog.open) return;
    const slug = button.dataset.module;
    if (!slug) return;
    event.preventDefault();
    showResetDialog(button, slug);
  });
  cancel.addEventListener('click', () => { if (!busy) dialog.close(); });
  dialog.addEventListener('cancel', event => { if (busy) event.preventDefault(); });
  dialog.addEventListener('close', () => { passcode.value = ''; error.textContent = ''; });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy || !selectedSlug || !passcode.value) return;
    const slug = selectedSlug;
    const button = selectedButton;
    const enteredPasscode = passcode.value;
    busy = true; submit.disabled = true; cancel.disabled = true; passcode.disabled = true; button.disabled = true;
    resettingSlug = slug;
    let reloading = false;
    try {
      await Promise.allSettled([...(pendingWrites.get(slug) || [])]);
      const id = learnerId();
      const response = await fetch(`/api/modules/${encodeURIComponent(slug)}/reset`, {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ learnerId: id, passcode: enteredPasscode }),
      });
      if (!response.ok) {
        error.textContent = response.status === 403 ? copy[language()].incorrect : response.status === 503 ? copy[language()].unavailable : copy[language()].failed;
        return;
      }
      clearModuleStorage(slug, id);
      dialog.close();
      if (slug === currentSlug && !document.querySelector('#module-grid')) {
        reloading = true;
        location.reload();
        return;
      }
      window.dispatchEvent(new CustomEvent('godot-forge-module-reset', { detail: { slug } }));
    } catch {
      error.textContent = copy[language()].failed;
    } finally {
      if (!reloading) resettingSlug = null;
      busy = false; submit.disabled = false; cancel.disabled = false; passcode.disabled = false;
      if (button.isConnected) button.disabled = false;
      if (dialog.open) { passcode.focus(); passcode.select(); }
    }
  });

  const slug = document.body.dataset.module || location.pathname.split('/')[1];
  const header = document.querySelector('.module-header, .module-overview > header');
  if (slug && header) {
    const button = document.createElement('button');
    button.id = 'reset-module';
    button.className = 'reset-module-button';
    button.type = 'button';
    button.dataset.module = slug;
    button.textContent = copy[language()].resetCurrent;
    const home = header.querySelector('.home-mark');
    if (home) home.before(button);
    else header.append(button);
    new MutationObserver(() => {
      button.textContent = copy[language()].resetCurrent;
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }
})();
