// Shared page scale preference. Zoom also keeps canvas-based lessons readable.
(() => {
  const storageKey = 'godot-forge-text-size';
  const levels = [80, 90, 100, 110, 125, 150, 175, 200];
  const labels = {
    en: { group: 'Page text size', smaller: 'Decrease text size', larger: 'Increase text size', reset: 'Reset text size' },
    zh: { group: '页面文字大小', smaller: '缩小文字', larger: '放大文字', reset: '重置文字大小' },
    ms: { group: 'Saiz teks halaman', smaller: 'Kecilkan teks', larger: 'Besarkan teks', reset: 'Tetapkan semula saiz teks' },
  };
  let value = 100;
  try { const saved = Number(localStorage.getItem(storageKey)); if (levels.includes(saved)) value = saved; } catch { /* Use the default. */ }
  const apply = () => { document.documentElement.style.zoom = `${value}%`; document.documentElement.dataset.textSize = String(value); };
  const locale = () => {
    try { const saved = localStorage.getItem('godot-forge-locale'); if (labels[saved]) return saved; } catch { /* Use document language. */ }
    return labels[document.documentElement.lang.slice(0, 2)] ? document.documentElement.lang.slice(0, 2) : 'en';
  };
  let group, smaller, reset, larger;
  function update() {
    apply();
    if (!group) return;
    const text = labels[locale()];
    group.setAttribute('aria-label', text.group);
    for (const [button, label] of [[smaller, text.smaller], [reset, text.reset], [larger, text.larger]]) {
      button.setAttribute('aria-label', label);
      button.title = label;
    }
    smaller.disabled = value === levels[0];
    larger.disabled = value === levels.at(-1);
    reset.textContent = `${value}%`;
  }
  function setSize(next) {
    value = next;
    try { localStorage.setItem(storageKey, String(value)); } catch { /* Apply for this page. */ }
    update();
  }
  function mount() {
    const theme = document.querySelector('#theme-toggle');
    const header = document.querySelector('header');
    if (!header) return;
    group = document.createElement('div');
    group.id = 'text-size-controls';
    group.setAttribute('role', 'group');
    smaller = document.createElement('button');
    reset = document.createElement('button');
    larger = document.createElement('button');
    for (const button of [smaller, reset, larger]) button.type = 'button';
    smaller.textContent = 'A−';
    larger.textContent = 'A+';
    reset.className = 'text-size-value';
    group.append(smaller, reset, larger);
    if (theme) theme.after(group); else header.append(group);
    smaller.addEventListener('click', () => setSize(levels[Math.max(0, levels.indexOf(value) - 1)]));
    larger.addEventListener('click', () => setSize(levels[Math.min(levels.length - 1, levels.indexOf(value) + 1)]));
    reset.addEventListener('click', () => setSize(100));
    update();
  }
  apply();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true }); else mount();
  document.addEventListener('click', event => {
    if (event.target.closest('#languages button[data-locale], #language-toggle button[data-locale], .language-toggle button[data-locale]')) setTimeout(update, 0);
  });
  window.addEventListener('storage', event => {
    if (event.key !== storageKey) return;
    const saved = Number(event.newValue);
    value = levels.includes(saved) ? saved : 100;
    update();
  });
})();
