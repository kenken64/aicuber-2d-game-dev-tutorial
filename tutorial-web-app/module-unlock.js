// Guard direct visits as well as the learning-path navigation. The learner's
// existing progress remains untouched if a prerequisite is later reopened.
(() => {
  const root = document.documentElement;
  root.setAttribute('data-module-gated', '');
  const style = document.createElement('style');
  style.textContent = `
    html[data-module-gated] body > :not(#module-gate) { display: none !important; }
    #module-gate { min-height: 100vh; display: grid; place-items: center; padding: 24px; background: #101b18; color: #eef4e9; font: 16px/1.6 system-ui, sans-serif; }
    #module-gate .gate-card { width: min(100%, 560px); border: 1px solid #385246; background: #182a22; padding: clamp(24px, 5vw, 40px); }
    #module-gate h1 { margin: 0 0 12px; font-size: clamp(26px, 4vw, 38px); line-height: 1.15; }
    #module-gate p { color: #becdbf; }
    #module-gate a, #module-gate button { display: inline-block; margin: 12px 10px 0 0; padding: 10px 16px; border: 1px solid #c4f265; background: #c4f265; color: #142119; font: 700 14px system-ui, sans-serif; text-decoration: none; cursor: pointer; }
    #module-gate button { background: transparent; color: #c4f265; }
    #module-gate :focus-visible { outline: 3px solid #9c8cff; outline-offset: 3px; }
  `;
  document.head.append(style);
  const labels = {
    en: { checking: 'Checking your progress…', title: 'Finish the earlier modules first', body: 'Complete modules 1–20 to unlock modules 21–23.', progress: n => `${n} of 20 modules completed.`, error: 'Could not check your progress. Please try again.', back: '← LEARNING PATH', retry: 'CHECK AGAIN' },
    zh: { checking: '正在检查学习进度…', title: '请先完成前面的模块', body: '完成第 1–20 个模块后，即可解锁第 21–23 个模块。', progress: n => `已完成 ${n} / 20 个模块。`, error: '无法检查学习进度，请重试。', back: '← 学习路径', retry: '重新检查' },
    ms: { checking: 'Menyemak kemajuan anda…', title: 'Selesaikan modul terdahulu dahulu', body: 'Lengkapkan modul 1–20 untuk membuka modul 21–23.', progress: n => `${n} daripada 20 modul telah selesai.`, error: 'Kemajuan tidak dapat disemak. Sila cuba lagi.', back: '← LALUAN PEMBELAJARAN', retry: 'SEMAK SEMULA' },
  };
  const locale = localStorage.getItem('godot-forge-locale');
  const text = labels[locale] || labels.en;
  let learnerId = localStorage.getItem('godot-forge-learner-id');
  if (!learnerId) { learnerId = crypto.randomUUID().replace(/-/g, ''); localStorage.setItem('godot-forge-learner-id', learnerId); }
  const gate = document.createElement('main');
  gate.id = 'module-gate';
  gate.setAttribute('aria-live', 'polite');
  const card = document.createElement('div'); card.className = 'gate-card';
  const heading = document.createElement('h1'); heading.textContent = text.checking;
  const description = document.createElement('p');
  const progress = document.createElement('p');
  const back = document.createElement('a'); back.href = '/#modules'; back.textContent = text.back;
  const retry = document.createElement('button'); retry.type = 'button'; retry.textContent = text.retry; retry.addEventListener('click', checkProgress);
  card.append(heading, description, progress, back, retry); gate.append(card);
  const ready = new Promise(resolve => {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', resolve, { once: true });
    else resolve();
  });
  async function checkProgress() {
    retry.disabled = true;
    try {
      const response = await fetch(`/api/modules?learnerId=${encodeURIComponent(learnerId)}`, { cache: 'no-store' });
      if (!response.ok) throw new Error('Progress unavailable');
      const modules = await response.json();
      const required = modules.filter(module => Number(module.level) >= 1 && Number(module.level) <= 20);
      const count = required.filter(module => module.completed).length;
      await ready;
      if (required.length === 20 && count === 20) {
        root.removeAttribute('data-module-gated'); gate.remove(); style.remove();
      } else {
        heading.textContent = text.title; description.textContent = text.body; progress.textContent = text.progress(count);
      }
    } catch {
      await ready;
      heading.textContent = text.title; description.textContent = text.error; progress.textContent = '';
    } finally { retry.disabled = false; }
  }
  ready.then(() => { if (root.hasAttribute('data-module-gated')) document.body.prepend(gate); });
  checkProgress();
})();
