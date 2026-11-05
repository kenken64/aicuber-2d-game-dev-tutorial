// Completion requirements are shared between lesson buttons and learning-path cards.
(() => {
  const requirements = {
    'character-creation': {
      en: 'You can mark this module complete when ready. To make a character, answer the guide and build and save its sprite.',
      zh: '准备好后可完成本模块。要制作角色，请回答指南问题并生成、保存精灵图。',
      ms: 'Tandakan modul selesai apabila bersedia. Untuk mencipta watak, jawab panduan dan bina serta simpan spritenya.',
    },
    'game-assets-creation': {
      en: 'You can mark this module complete when ready. Use the guide to create an asset direction and generate artwork.',
      zh: '准备好后可完成本模块。使用指南创建素材设计方向并生成美术素材。',
      ms: 'Tandakan modul selesai apabila bersedia. Gunakan panduan untuk membina arah aset dan menjana karya.',
    },
    'boss-creation': {
      en: 'You can mark this module complete when ready. Use the guide to design a boss and generate its sprite sheet.',
      zh: '准备好后可完成本模块。使用指南设计首领并生成精灵图。',
      ms: 'Tandakan modul selesai apabila bersedia. Gunakan panduan untuk mereka bos dan menjana helaian sprite.',
    },
    'storyline-engine': {
      en: 'Make five story choices to reach the final scene, then select Complete Module.',
      zh: '完成五次故事选择并抵达最终场景，然后点击完成模块。',
      ms: 'Buat lima pilihan cerita hingga ke adegan akhir, kemudian pilih Selesaikan Modul.',
    },
    'parallax-tiling-map': {
      en: 'Select Test Level and play-test your map, then select Complete Module.',
      zh: '选择“测试关卡”试玩地图，然后点击完成模块。',
      ms: 'Pilih Uji Aras dan uji peta anda, kemudian pilih Selesaikan Modul.',
    },
    'items-spawning': {
      en: 'Collect a glowing pickup, defeat the grove brute with two hits, and collect at least one item it drops.',
      zh: '收集一个发光道具，攻击两次击败林地蛮兽，再拾取至少一件掉落物。',
      ms: 'Kutip satu item bercahaya, tewaskan raksasa rimba dengan dua serangan, dan kutip sekurang-kurangnya satu lootnya.',
    },
    'enemies-ai': {
      en: 'Trigger both enemies to chase you and land a sword hit on each one.',
      zh: '让两种敌人都追逐你，并用剑分别击中它们一次。',
      ms: 'Buat kedua-dua musuh mengejar anda dan serang setiap satu dengan pedang.',
    },
    'game-loop-engine': {
      en: 'Collect all 20 coins and touch the relic to complete automatically, or mark the module complete when ready.',
      zh: '收集全部 20 枚金币并触碰遗物即可自动完成，也可以准备好后手动标记完成。',
      ms: 'Kutip semua 20 syiling dan sentuh relik untuk selesai secara automatik, atau tandakan selesai apabila bersedia.',
    },
    'game-controls': {
      en: 'Test a controller input and customize at least one action mapping in Settings.',
      zh: '测试一次手柄输入，并在设置中自定义至少一个动作映射。',
      ms: 'Uji input pengawal dan sesuaikan sekurang-kurangnya satu pemetaan tindakan dalam Tetapan.',
    },
    'game-settings': {
      en: 'Collect a coin, take damage, and use both the music and sound settings.',
      zh: '收集一枚金币、受到一次伤害，并使用音乐和音效两个设置。',
      ms: 'Kutip satu syiling, terima kerosakan, dan gunakan kedua-dua tetapan muzik dan bunyi.',
    },
    'game-physics': {
      en: 'Drop the boulder and wait for it to splash into the water.',
      zh: '让巨石落下，并等待它溅入水中。',
      ms: 'Jatuhkan batu dan tunggu sehingga ia terpercik ke dalam air.',
    },
    'game-ending-cutscene': {
      en: 'Advance through the cutscene and dialogue, then choose an ending.',
      zh: '继续播放过场动画和对话，然后选择一个结局。',
      ms: 'Teruskan adegan dan dialog, kemudian pilih satu pengakhiran.',
    },
    'credits': {
      en: 'Mark complete when ready, or let the credits finish or select Skip to End.',
      zh: '准备好后可点击完成，也可以等待片尾结束或选择跳至结尾。',
      ms: 'Tandakan selesai apabila bersedia, biarkan penghargaan tamat, atau pilih Langkau ke Akhir.',
    },
    'marketplace-system': {
      en: 'You can mark this module complete when ready. Practice buying, selling, and salvaging gear in the shop.',
      zh: '准备好后可完成本模块。可以在商店练习购买、出售和分解装备。',
      ms: 'Tandakan modul selesai apabila bersedia. Berlatih membeli, menjual dan meleraikan kelengkapan di kedai.',
    },
    'game-achievement': {
      en: 'Collect all 10 gold coins and the heart to earn both achievement badges.',
      zh: '收集全部 10 枚金币和一颗心，获得两个成就徽章。',
      ms: 'Kutip semua 10 syiling emas dan hati untuk mendapatkan kedua-dua lencana pencapaian.',
    },
    'game-leaderboard': {
      en: 'Collect all 10 coins and the heart to reveal your leaderboard ranking.',
      zh: '收集全部 10 枚金币和一颗心，显示你的排行榜名次。',
      ms: 'Kutip semua 10 syiling dan hati untuk memaparkan kedudukan papan pendahulu anda.',
    },
    'local-coop': {
      en: 'Collect all 12 coins together with the two players.',
      zh: '两名玩家合作收集全部 12 枚金币。',
      ms: 'Kutip semua 12 syiling bersama dua pemain.',
    },
    'multiplayer-game': {
      en: 'Host or join a room, ready both players, and finish a shared round.',
      zh: '主持或加入房间，让两名玩家准备就绪并完成一局共享游戏。',
      ms: 'Jadi hos atau sertai bilik, sediakan kedua-dua pemain dan tamatkan satu pusingan bersama.',
    },
    'math-stem-physics-quiz': {
      en: 'Answer all 40 questions and get at least 30 correct, then select Complete Quiz.',
      zh: '回答全部 40 道题，至少答对 30 题，然后点击完成测验。',
      ms: 'Jawab semua 40 soalan dan dapatkan sekurang-kurangnya 30 jawapan betul, kemudian pilih Lengkapkan Kuiz.',
    },
    'setup-godot-with-ai': {
      en: 'You can mark this module complete when ready. Explore the Godot Web Editor and its workspace.',
      zh: '准备好后可完成本模块。请探索 Godot 网页编辑器及其工作区。',
      ms: 'Tandakan modul selesai apabila bersedia. Terokai Godot Web Editor dan ruang kerjanya.',
    },
    'final-game': {
      en: 'You can mark this module complete when ready. Build and play through your final game level.',
      zh: '准备好后可完成本模块。请构建并试玩你的最终游戏关卡。',
      ms: 'Tandakan modul selesai apabila bersedia. Bina dan mainkan aras permainan akhir anda.',
    },
    'microbit-gamepad': {
      en: 'You can mark this bonus module complete when ready. Explore the MakeCode program and connection steps.',
      zh: '准备好后可完成本奖励模块。请了解 MakeCode 程序和连接步骤。',
      ms: 'Tandakan modul bonus selesai apabila bersedia. Terokai program MakeCode dan langkah sambungan.',
    },
  };
  const labels = {
    en: { help: 'Show completion requirements', lock: 'Complete modules 1–19 to unlock this module.' },
    zh: { help: '显示模块完成要求', lock: '完成第 1–19 个模块后解锁。' },
    ms: { help: 'Tunjukkan syarat penyelesaian', lock: 'Lengkapkan modul 1–19 untuk membuka modul ini.' },
  };
  const locale = () => labels[localStorage.getItem('godot-forge-locale')] ? localStorage.getItem('godot-forge-locale') : 'en';
  const requirement = slug => requirements[slug]?.[locale()] || '';
  const slug = location.pathname.split('/').filter(Boolean)[0] || '';
  let bubble = null, owner = null, helpButton = null, pinned = false;

  function positionBubble() {
    if (!owner || !bubble || bubble.hidden) return;
    const anchor = owner.getBoundingClientRect();
    const width = bubble.offsetWidth, height = bubble.offsetHeight;
    const left = Math.max(8, Math.min(window.innerWidth - width - 8, anchor.left + (anchor.width - width) / 2));
    const above = anchor.top - height - 10;
    const top = above >= 8 ? above : Math.min(window.innerHeight - height - 8, anchor.bottom + 10);
    bubble.style.left = `${left}px`; bubble.style.top = `${Math.max(8, top)}px`;
  }
  function showTip(wrapper, help, tooltip) {
    if (bubble && bubble !== tooltip) bubble.hidden = true;
    owner = wrapper; helpButton = help; bubble = tooltip;
    tooltip.hidden = false; positionBubble();
  }
  function hideTip(force = false) {
    if (pinned && !force) return;
    if (bubble) bubble.hidden = true;
    if (helpButton) helpButton.setAttribute('aria-expanded', 'false');
    owner = null; helpButton = null; bubble = null; pinned = false;
  }
  function attach(button) {
    if (button.closest('.completion-hint-wrap')) return;
    const wrapper = document.createElement('span'); wrapper.className = 'completion-hint-wrap';
    button.before(wrapper); wrapper.append(button);
    const tip = document.createElement('span');
    tip.id = 'completion-requirement-tooltip'; tip.className = 'completion-requirement-tooltip';
    tip.setAttribute('role', 'tooltip'); tip.hidden = true; document.body.append(tip);
    const help = document.createElement('button');
    help.type = 'button'; help.className = 'completion-hint-help'; help.textContent = '?';
    help.setAttribute('aria-describedby', tip.id); help.setAttribute('aria-expanded', 'false');
    wrapper.append(help);
    const existing = button.getAttribute('aria-describedby');
    button.setAttribute('aria-describedby', [existing, tip.id].filter(Boolean).join(' '));
    const updateLanguage = () => { tip.textContent = requirement(slug); help.setAttribute('aria-label', labels[locale()].help); };
    updateLanguage();
    new MutationObserver(updateLanguage).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    wrapper.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') showTip(wrapper, help, tip); });
    wrapper.addEventListener('pointerleave', () => { if (!wrapper.contains(document.activeElement)) hideTip(); });
    wrapper.addEventListener('focusin', () => showTip(wrapper, help, tip));
    wrapper.addEventListener('focusout', event => { if (!wrapper.contains(event.relatedTarget)) hideTip(); });
    help.addEventListener('click', event => {
      event.preventDefault(); event.stopPropagation();
      if (pinned && bubble === tip) { hideTip(true); return; }
      pinned = true; showTip(wrapper, help, tip); help.setAttribute('aria-expanded', 'true');
    });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && bubble === tip) hideTip(true); });
    document.addEventListener('pointerdown', event => { if (pinned && !wrapper.contains(event.target)) hideTip(true); });
    window.addEventListener('resize', positionBubble);
    window.addEventListener('scroll', positionBubble, { passive: true, capture: true });
  }
  function attachLessonButton() {
    if (!requirements[slug]) return;
    const selector = ['character-creation', 'game-loop-engine', 'final-game'].includes(slug) ? '#lesson-mark-complete'
      : ['marketplace-system', 'math-stem-physics-quiz', 'setup-godot-with-ai', 'microbit-gamepad'].includes(slug) ? '#complete'
      : slug === 'storyline-engine' ? '#complete-story' : '#complete-module';
    const find = () => { const button = document.querySelector(selector); if (!button) return false; attach(button); return true; };
    if (!find()) {
      const observer = new MutationObserver(() => { if (find()) observer.disconnect(); });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }
  function attachCardHints() {
    const grid = document.querySelector('#module-grid');
    if (!grid) return;
    const update = () => grid.querySelectorAll('.complete-button[data-module]').forEach(button => {
      const module = button.dataset.module;
      const text = button.disabled ? labels[locale()].lock : requirement(module);
      if (!text) return;
      button.title = text;
      button.setAttribute('aria-label', `${button.textContent.trim()}. ${text}`);
    });
    new MutationObserver(update).observe(grid, { childList: true, subtree: true });
    new MutationObserver(update).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    update();
  }
  const init = () => { attachLessonButton(); attachCardHints(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
