// A visible manual progress control for lessons whose main flow saves progress
// automatically. This uses the same learner progress as the learning path.
(() => {
  const slug = location.pathname.split('/')[1];
  const key = 'godot-forge-learner-id';
  let learnerId = localStorage.getItem(key);
  if (!learnerId) { learnerId = crypto.randomUUID().replace(/-/g, ''); localStorage.setItem(key, learnerId); }
  const copy = {
    en: { ready: 'Mark this module complete when you are ready.', done: 'Module completed.', mark: 'MARK COMPLETE', reopen: 'REOPEN MODULE', saved: 'Progress saved.', error: 'Could not save progress. Please try again.' },
    zh: { ready: '准备好后，可将本模块标记为完成。', done: '模块已完成。', mark: '标记完成', reopen: '重新打开模块', saved: '进度已保存。', error: '无法保存进度，请重试。' },
    ms: { ready: 'Tandakan modul ini selesai apabila anda bersedia.', done: 'Modul telah selesai.', mark: 'TANDA SELESAI', reopen: 'BUKA SEMULA MODUL', saved: 'Kemajuan disimpan.', error: 'Kemajuan tidak dapat disimpan. Sila cuba lagi.' },
  };
  const t = () => copy[localStorage.getItem('godot-forge-locale')] || copy.en;
  let completed = false, loaded = false, busy = false, status = '';
  const section = document.createElement('section'); section.id = 'lesson-completion-panel';
  const text = document.createElement('div');
  const hint = document.createElement('p');
  const message = document.createElement('p'); message.setAttribute('role', 'status');
  const button = document.createElement('button'); button.type = 'button'; button.id = 'lesson-mark-complete'; button.disabled = true;
  text.append(hint, message); section.append(text, button);
  const style = document.createElement('style');
  style.textContent = `#lesson-completion-panel{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:18px 0;padding:16px 18px;border:1px solid #385246;background:#182a22;color:#eef4e9}#lesson-completion-panel p{margin:0;color:#becdbf;font:14px/1.5 system-ui,sans-serif}#lesson-completion-panel p[role=status]:not(:empty){margin-top:4px}#lesson-completion-panel button{flex:none;min-height:42px;padding:10px 15px;border:1px solid #c4f265;background:#c4f265;color:#142119;font:700 12px system-ui,sans-serif;cursor:pointer}#lesson-completion-panel button:disabled{opacity:.6;cursor:wait}#lesson-completion-panel button:focus-visible{outline:3px solid #9c8cff;outline-offset:3px}@media(max-width:560px){#lesson-completion-panel{align-items:stretch;flex-direction:column}}`;
  document.head.append(style);
  function render() { const c = t(); hint.textContent = completed ? c.done : c.ready; button.textContent = completed ? c.reopen : c.mark; button.disabled = !loaded || busy; message.textContent = status ? c[status] : ''; }
  async function refresh() {
    try { const response = await fetch(`/api/modules?learnerId=${encodeURIComponent(learnerId)}`); if (!response.ok) throw new Error(); const module = (await response.json()).find(item => item.slug === slug); if (!module) throw new Error(); completed = Boolean(module.completed); loaded = true; }
    catch { status = 'error'; }
    render();
  }
  button.addEventListener('click', async () => {
    if (!loaded || busy) return;
    busy = true; status = ''; render();
    try {
      const response = await fetch(`/api/modules/${encodeURIComponent(slug)}/progress`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ learnerId, completed: !completed }) });
      if (!response.ok) throw new Error();
      completed = Boolean((await response.json()).completed); status = 'saved';
    } catch { status = 'error'; }
    finally { busy = false; render(); }
  });
  const originalFetch = window.fetch.bind(window);
  window.fetch = (...args) => {
    const [input, init] = args;
    const method = String(init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();
    const url = new URL(input instanceof Request ? input.url : String(input), location.href);
    const request = originalFetch(...args);
    if (url.origin === location.origin && ((method === 'PATCH' && url.pathname === `/api/modules/${slug}/progress`) || (slug === 'character-creation' && method === 'POST' && url.pathname === '/api/characters'))) {
      request.then(response => { if (response.ok && !busy) refresh(); }).catch(() => {});
    }
    return request;
  };
  window.addEventListener('godot-forge-module-reset', event => { if (event.detail?.slug === slug) { completed = false; status = ''; render(); } });
  document.addEventListener('click', event => { if (event.target.closest('[data-locale]')) queueMicrotask(render); });
  const mount = () => { const main = document.querySelector('main'); const header = main?.querySelector(':scope > header'); if (header) header.after(section); else main?.prepend(section); render(); refresh(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true }); else mount();
})();
