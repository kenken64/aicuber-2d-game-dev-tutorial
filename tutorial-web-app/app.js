let modules = [];
let progressRefreshVersion = 0;
const completedModules = new Set();
const learnerId = (() => { const key = 'godot-forge-learner-id'; let value = localStorage.getItem(key); if (!value) { value = crypto.randomUUID().replace(/-/g, ''); localStorage.setItem(key, value); } return value; })();
const supportedLocales = ["en", "zh", "ms"];
const savedLocale = window.localStorage.getItem("godot-forge-locale");
let currentLocale = supportedLocales.includes(savedLocale) ? savedLocale : "en";
const moduleOrder = [
  "character-creation",
  "game-assets-creation",
  "boss-creation",
  "storyline-engine",
  "parallax-tiling-map",
  "items-spawning",
  "enemies-ai",
  "game-loop-engine",
  "game-controls",
  "game-settings",
  "game-physics",
  "sound-engine",
  "game-ending-cutscene",
  "credits",
  "marketplace-system",
  "game-achievement",
  "game-leaderboard",
  "local-coop",
  "multiplayer-game",
  "math-stem-physics-quiz",
  "setup-godot-with-ai",
  "final-game",
  "microbit-gamepad",
];

const moduleIcons = {
  "character-creation": "♙",
  "game-assets-creation": "▦",
  "boss-creation": "♛",
  "storyline-engine": "⌁",
  "parallax-tiling-map": "▤",
  "items-spawning": "◇",
  "enemies-ai": "◆",
  "game-loop-engine": "↻",
  "game-controls": "⊞",
  "game-settings": "⚙",
  "game-physics": "∿",
  "sound-engine": "♫",
  "game-ending-cutscene": "◒",
  credits: "✧",
  "marketplace-system": "¤",
  "game-achievement": "★",
  "game-leaderboard": "▥",
  "local-coop": "♧",
  "multiplayer-game": "⇄",
  "final-game": "✦",
  "microbit-gamepad": "🎮",
  "math-stem-physics-quiz": "π",
  "setup-godot-with-ai": "⚒",
};

const fallbackModuleTranslations = {
  "character-creation": {
    zh: { title: "角色创建", description: "打造拥有移动、个性与目标的玩家角色。" },
    ms: { title: "Penciptaan watak", description: "Bina watak pemain dengan pergerakan, personaliti dan tujuan." },
  },
  "game-assets-creation": {
    zh: { title: "游戏资产创建", description: "创建游戏世界的视觉语言和可重用素材。" },
    ms: { title: "Penciptaan aset permainan", description: "Cipta bahasa visual dan aset boleh guna semula untuk dunia permainan." },
  },
  "parallax-tiling-map": {
    zh: { title: "视差平铺地图", description: "构建分层环境，让每一步探索都更有空间感。" },
    ms: { title: "Peta jubin paralaks", description: "Bina persekitaran berlapis yang menjadikan setiap langkah terasa luas." },
  },
  "game-loop-engine": {
    zh: { title: "游戏循环架构", description: "完成可玩的任务循环：收集 20 枚金币、抵达终点、庆祝通关，并点击继续重新开始。" },
    ms: { title: "Seni Bina Gelung Permainan", description: "Bina gelung misi yang boleh dimainkan: kutip 20 syiling, capai matlamat, raikan tamat aras dan mula semula dengan Teruskan." },
  },
  "items-spawning": {
    zh: { title: "道具生成", description: "在地图中随机生成可拾取道具，让玩家触碰收集，并在敌人被击败时掉落战利品。" },
    ms: { title: "Penjanaan item", description: "Munculkan item secara rawak di dunia, kutip dengan menyentuhnya, dan jatuhkan loot apabila musuh ditewaskan." },
  },
  "enemies-ai": {
    zh: { title: "敌人与 AI", description: "创建两种森林敌人，加入巡逻、近距离侦测、追逐、近战攻击和玩家反馈。" },
    ms: { title: "Musuh & AI", description: "Cipta dua musuh hutan dengan rondaan, pengesanan jarak dekat, kejaran, serangan jarak dekat dan maklum balas pemain." },
  },
  "boss-creation": {
    zh: { title: "Boss 创建", description: "设计具有清晰模式和精彩回报的难忘挑战。" },
    ms: { title: "Penciptaan bos", description: "Reka cabaran yang mudah difahami dengan corak dan ganjaran yang berkesan." },
  },
  "storyline-engine": {
    zh: { title: "故事线引擎", description: "用分支叙事节奏给玩家探索的理由。" },
    ms: { title: "Enjin jalan cerita", description: "Berikan sebab untuk meneroka melalui rentak naratif bercabang." },
  },
  "final-game": {
    zh: { title: "最终游戏", description: "运用第 1–18 章的素材与系统，在 Godot 中制作并测试一个完整关卡。" },
    ms: { title: "Permainan akhir", description: "Gunakan aset dan sistem modul 1–18 untuk membina dan menguji satu tahap Godot yang lengkap." },
  },
  "game-ending-cutscene": {
    zh: { title: "游戏结局过场动画", description: "设计令人满意的结局，让玩家的最后行动成为难忘的收尾时刻。" },
    ms: { title: "Babak akhir permainan", description: "Rancang penutup yang memuaskan supaya aksi terakhir pemain menjadi detik penamat yang diingati." },
  },
  credits: {
    zh: { title: "制作人员名单", description: "制作精致的致谢名单，向游戏背后的创作者、工具和创作历程致敬。" },
    ms: { title: "Penghargaan", description: "Cipta urutan penghargaan yang kemas untuk meraikan orang, alatan dan perjalanan di sebalik permainan anda." },
  },
  "marketplace-system": {
    zh: { title: "游戏商店系统", description: "构建玩家友好的商店，用于浏览、购买并安全保存游戏内升级内容。" },
    ms: { title: "Sistem pasaran", description: "Bina kedai mesra pemain untuk menyemak imbas, membeli dan menyimpan naik taraf dalam permainan dengan selamat." },
  },
  "game-achievement": {
    zh: { title: "游戏成就", description: "通过清晰的解锁条件、进度追踪和持久徽章奖励重要里程碑。" },
    ms: { title: "Pencapaian Permainan", description: "Ganjar pencapaian penting dengan syarat buka kunci yang jelas, penjejakan kemajuan dan lencana kekal." },
  },
  "game-leaderboard": {
    zh: { title: "游戏排行榜", description: "通过验证分数提交、处理平分规则并保护玩家隐私，建立公平排名。" },
    ms: { title: "Papan Pendahulu Permainan", description: "Bina kedudukan markah yang adil dengan pengesahan, peraturan seri dan privasi pemain." },
  },
  "local-coop": {
    zh: { title: "本地合作游戏", description: "构建共享屏幕合作玩法，支持玩家加入与离开、独立键盘或手柄输入以及共同目标。" },
    ms: { title: "Kerjasama Setempat", description: "Bina permainan koperatif pada skrin yang sama dengan pemain boleh sertai atau keluar, input papan kekunci atau pad permainan berasingan serta objektif bersama." },
  },
  "multiplayer-game": {
    zh: { title: "多人联网游戏", description: "设计联网玩法，涵盖权威游戏状态、玩家同步、延迟处理和可靠的会话管理。" },
    ms: { title: "Permainan Berbilang Pemain", description: "Reka permainan rangkaian dengan keadaan permainan berautoriti, penyegerakan pemain, pengendalian kependaman dan sesi yang teguh." },
  },
  "math-stem-physics-quiz": {
    zh: { title: "数学、STEM 与物理测验", description: "测试你对游戏开发中的数学、运动、时间和碰撞知识的掌握。" },
    ms: { title: "Kuiz matematik, STEM & fizik", description: "Uji pengetahuan matematik, pergerakan, masa dan perlanggaran dalam pembangunan permainan anda." },
  },
  "setup-godot-with-ai": {
    zh: { title: "学习 Godot 网页编辑器", description: "在浏览器中打开 Godot 项目 ZIP，探索 2D 编辑器、运行场景并保存作品副本。" },
    ms: { title: "Pelajari Godot Web Editor", description: "Buka ZIP projek Godot dalam pelayar, terokai editor 2D, jalankan adegan dan simpan salinan kerja anda." },
  },
};

const interfaceCopy = {
  en: {
    pageTitle: "Godot Forge — 2D Game Development",
    tutorialNavigation: "Tutorial navigation",
    brandHome: "Godot Forge home",
    tutorialProgress: "Tutorial progress",
    openNavigation: "Open navigation",
    language: "Language",
    toggleTheme: "Toggle color theme",
    localeEnglish: "EN",
    localeChinese: "中文",
    localeMalay: "BM",
    brandSubtitle: "2D GAME LAB",
    workspace: "Your workspace",
    journeyProgress: "Journey progress",
    of: "of",
    modulesComplete: "modules complete",
    modules: "Modules",
    buildMode: "Build mode",
    active: "ACTIVE",
    learningPath: "LEARNING PATH",
    version: "v0.1 / FOUNDATION",
    heroEyebrow: "A guided build from zero to playable",
    heroTitleFirst: "Make a world",
    heroTitleSecond: "worth playing.",
    heroDescription: "Follow the path from your first game asset to a complete 2D adventure. Every module is a focused building block for the final game.",
    startBuilding: "Start building",
    learningPathEyebrow: "The learning path",
    learningPathTitle: "Twenty-three steps to a living game.",
    findModule: "Find a module",
    playerLabel: "PLAYER_01",
    readyToBuild: "READY TO BUILD",
    nextModule: "next: Character Creation",
    buildPhilosophy: "Build philosophy",
    smallSystems: "Small systems.",
    bigWorlds: "Big worlds.",
    philosophyDescription: "Learn by making. Each chapter leaves you with something playable and gives the next system a reason to exist.",
    footerMessage: "BUILT ONE SYSTEM AT A TIME",
    chapter: "CH.",
    minutes: "min",
    ready: "READY",
    done: "DONE",
    markDone: "MARK DONE",
    reopen: "REOPEN",
    locked: "LOCKED",
    unlockRequirement: "Complete modules 1–20 to unlock.",
    quizRequirement: "PASS QUIZ TO COMPLETE",
    quizPassed: "QUIZ PASSED",
    reset: "RESET MODULE",
    emptyState: "No modules match that search.",
    loadError: "Unable to load tutorial modules. Start the app with npm start.",
    progress: (complete, total) => `${complete} of ${total} modules complete`,
    tags: { AUDIO: "AUDIO", PLAYER: "PLAYER", FOUNDATION: "FOUNDATION", WORLD: "WORLD", CORE: "CORE", SYSTEM: "SYSTEM", CHALLENGE: "CHALLENGE", STORY: "STORY", "SHIP IT": "SHIP IT", "CO-OP": "CO-OP", NETWORKING: "NETWORKING" },
  },
  zh: {
    pageTitle: "Godot Forge — 2D 游戏开发",
    tutorialNavigation: "教程导航",
    brandHome: "Godot Forge 首页",
    tutorialProgress: "教程进度",
    openNavigation: "打开导航",
    language: "语言",
    toggleTheme: "切换颜色主题",
    localeEnglish: "英文",
    localeChinese: "中文",
    localeMalay: "马来文",
    brandSubtitle: "2D 游戏实验室",
    workspace: "你的工作区",
    journeyProgress: "学习进度",
    of: "/",
    modulesComplete: "个模块已完成",
    modules: "模块",
    buildMode: "构建模式",
    active: "运行中",
    learningPath: "学习路径",
    version: "v0.1 / 基础篇",
    heroEyebrow: "从零开始，循序构建可玩的游戏",
    heroTitleFirst: "创造一个",
    heroTitleSecond: "值得游玩的世界。",
    heroDescription: "从第一个游戏资产开始，逐步构建一场完整的 2D 冒险。每个模块都是最终游戏的重要组成部分。",
    startBuilding: "开始构建",
    learningPathEyebrow: "学习路径",
    learningPathTitle: "让游戏世界活起来的二十三步。",
    findModule: "查找模块",
    playerLabel: "玩家_01",
    readyToBuild: "准备构建",
    nextModule: "下一步：角色创建",
    buildPhilosophy: "构建理念",
    smallSystems: "小系统。",
    bigWorlds: "大世界。",
    philosophyDescription: "通过制作来学习。每一章都会留下可玩的成果，也为下一个系统创造存在的理由。",
    footerMessage: "一次构建一个系统",
    chapter: "第",
    minutes: "分钟",
    ready: "待开始",
    done: "完成",
    markDone: "标记完成",
    reopen: "重新打开",
    locked: "未解锁",
    unlockRequirement: "完成第 1–20 个模块后解锁。",
    quizRequirement: "通过测验后完成",
    quizPassed: "测验已通过",
    reset: "重置模块",
    emptyState: "没有匹配的模块。",
    loadError: "无法加载教程模块。请使用 npm start 启动应用。",
    progress: (complete, total) => `${complete} / ${total} 个模块已完成`,
    tags: { AUDIO: "声音", PLAYER: "玩家", FOUNDATION: "基础", WORLD: "世界", CORE: "核心", SYSTEM: "系统", CHALLENGE: "挑战", STORY: "故事", "SHIP IT": "发布", "CO-OP": "合作", NETWORKING: "联网" },
  },
  ms: {
    pageTitle: "Godot Forge — Pembangunan Permainan 2D",
    tutorialNavigation: "Navigasi tutorial",
    brandHome: "Laman utama Godot Forge",
    tutorialProgress: "Kemajuan tutorial",
    openNavigation: "Buka navigasi",
    language: "Bahasa",
    toggleTheme: "Tukar tema warna",
    localeEnglish: "Inggeris",
    localeChinese: "Cina",
    localeMalay: "BM",
    brandSubtitle: "MAKMAL PERMAINAN 2D",
    workspace: "Ruang kerja anda",
    journeyProgress: "Kemajuan perjalanan",
    of: "daripada",
    modulesComplete: "modul selesai",
    modules: "Modul",
    buildMode: "Mod binaan",
    active: "AKTIF",
    learningPath: "LALUAN PEMBELAJARAN",
    version: "v0.1 / ASAS",
    heroEyebrow: "Panduan membina permainan daripada kosong hingga boleh dimainkan",
    heroTitleFirst: "Bina dunia",
    heroTitleSecond: "yang berbaloi dimainkan.",
    heroDescription: "Ikuti laluan daripada aset permainan pertama hingga pengembaraan 2D yang lengkap. Setiap modul ialah blok binaan penting untuk permainan akhir.",
    startBuilding: "Mula membina",
    learningPathEyebrow: "Laluan pembelajaran",
    learningPathTitle: "Dua puluh tiga langkah untuk menghidupkan permainan.",
    findModule: "Cari modul",
    playerLabel: "PEMAIN_01",
    readyToBuild: "SEDIA UNTUK MEMBINA",
    nextModule: "seterusnya: Penciptaan watak",
    buildPhilosophy: "Falsafah binaan",
    smallSystems: "Sistem kecil.",
    bigWorlds: "Dunia besar.",
    philosophyDescription: "Belajar dengan membuat. Setiap bab meninggalkan sesuatu yang boleh dimainkan dan memberi sebab untuk sistem seterusnya wujud.",
    footerMessage: "BINA SATU SISTEM PADA SATU MASA",
    chapter: "BAB",
    minutes: "min",
    ready: "SEDIA",
    done: "SELESAI",
    markDone: "TANDA SELESAI",
    reopen: "BUKA SEMULA",
    locked: "TERKUNCI",
    unlockRequirement: "Lengkapkan modul 1–20 untuk membuka.",
    quizRequirement: "LULUS KUIZ UNTUK SELESAI",
    quizPassed: "KUIZ LULUS",
    reset: "SET SEMULA MODUL",
    emptyState: "Tiada modul yang sepadan dengan carian itu.",
    loadError: "Modul tutorial tidak dapat dimuatkan. Mulakan aplikasi dengan npm start.",
    progress: (complete, total) => `${complete} daripada ${total} modul selesai`,
    tags: { AUDIO: "AUDIO", PLAYER: "PEMAIN", FOUNDATION: "ASAS", WORLD: "DUNIA", CORE: "TERAS", SYSTEM: "SISTEM", CHALLENGE: "CABARAN", STORY: "CERITA", "SHIP IT": "TERBITKAN", "CO-OP": "KOPERATIF", NETWORKING: "RANGKAIAN" },
  },
};

Object.assign(interfaceCopy.en.tags, { INPUT: "INPUT", SETTINGS: "SETTINGS", PHYSICS: "PHYSICS" });
Object.assign(interfaceCopy.en.tags, { CINEMATIC: "CINEMATIC", CREDITS: "CREDITS", ECONOMY: "ECONOMY", MULTIPLAYER: "MULTIPLAYER", STEM: "STEM" });
Object.assign(interfaceCopy.en.tags, { REWARDS: "REWARDS", RANKING: "RANKING" });
Object.assign(interfaceCopy.en.tags, { GODOT: "GODOT" });
Object.assign(interfaceCopy.en.tags, { AI: "AI" });
Object.assign(interfaceCopy.zh.tags, { INPUT: "输入", SETTINGS: "设置", PHYSICS: "物理", CINEMATIC: "过场", CREDITS: "致谢", ECONOMY: "经济", MULTIPLAYER: "多人", STEM: "STEM" });
Object.assign(interfaceCopy.zh.tags, { REWARDS: "奖励", RANKING: "排名" });
Object.assign(interfaceCopy.zh.tags, { GODOT: "GODOT" });
Object.assign(interfaceCopy.zh.tags, { AI: "AI" });
Object.assign(interfaceCopy.ms.tags, { INPUT: "INPUT", SETTINGS: "TETAPAN", PHYSICS: "FIZIK", CINEMATIC: "SINEMATIK", CREDITS: "PENGHARGAAN", ECONOMY: "EKONOMI", MULTIPLAYER: "BERBILANG PEMAIN", STEM: "STEM" });
Object.assign(interfaceCopy.ms.tags, { REWARDS: "GANJARAN", RANKING: "KEDUDUKAN" });
Object.assign(interfaceCopy.ms.tags, { GODOT: "GODOT" });
Object.assign(interfaceCopy.ms.tags, { AI: "AI" });

const certificateCopy = {
  en: { eyebrow: 'YOUR ACHIEVEMENT', title: 'Certificate of completion', button: 'DOWNLOAD CERTIFICATE', progress: count => `Complete all 23 modules to unlock your certificate, including the bonus module. ${count} / 23 complete.`, ready: 'All 23 modules complete. Ask your instructor to approve your certificate.', authTitle: 'Instructor approval', authDescription: 'Ask your instructor to enter the module reset passcode.', passcode: 'Instructor passcode', continue: 'CONTINUE', cancel: 'CANCEL', nameTitle: 'Your certificate', nameDescription: 'Enter your name as it should appear on your certificate.', name: 'Student name', download: 'DOWNLOAD PDF', wrong: 'Incorrect passcode. Please try again.', unavailable: 'The reset passcode is not configured on the server. Contact the administrator.', incomplete: 'Complete all 23 modules before downloading a certificate.', expired: 'Instructor approval expired. Please enter the passcode again.', invalidName: 'Enter a name of up to 80 characters on one line.', unsupportedName: 'Some characters cannot be printed together. Please try a supported spelling or contact your instructor.', failed: 'Could not create the certificate. Please try again.' },
  zh: { eyebrow: '你的成就', title: '课程完成证书', button: '下载证书', progress: count => `完成全部 23 个模块（包括奖励模块）即可解锁证书。已完成 ${count} / 23。`, ready: '已完成全部 23 个模块，请老师批准你的证书。', authTitle: '老师批准', authDescription: '请老师输入模块重置密码。', passcode: '老师密码', continue: '继续', cancel: '取消', nameTitle: '你的证书', nameDescription: '输入证书上要显示的姓名。', name: '学生姓名', download: '下载 PDF', wrong: '密码不正确，请重试。', unavailable: '服务器尚未配置重置密码，请联系管理员。', incomplete: '请先完成全部 23 个模块。', expired: '老师的批准已过期，请重新输入密码。', invalidName: '请输入不超过 80 个字符的单行姓名。', unsupportedName: '部分字符无法一起打印，请尝试其他拼写或联系老师。', failed: '无法生成证书，请重试。' },
  ms: { eyebrow: 'PENCAPAIAN ANDA', title: 'Sijil penyempurnaan', button: 'MUAT TURUN SIJIL', progress: count => `Lengkapkan semua 23 modul, termasuk modul bonus, untuk membuka sijil. ${count} / 23 selesai.`, ready: 'Semua 23 modul selesai. Minta pengajar meluluskan sijil anda.', authTitle: 'Kelulusan pengajar', authDescription: 'Minta pengajar memasukkan kod laluan set semula modul.', passcode: 'Kod laluan pengajar', continue: 'TERUSKAN', cancel: 'BATAL', nameTitle: 'Sijil anda', nameDescription: 'Masukkan nama seperti yang hendak dipaparkan pada sijil.', name: 'Nama pelajar', download: 'MUAT TURUN PDF', wrong: 'Kod laluan salah. Sila cuba lagi.', unavailable: 'Kod set semula belum dikonfigurasi pada pelayan. Hubungi pentadbir.', incomplete: 'Lengkapkan semua 23 modul dahulu.', expired: 'Kelulusan pengajar telah tamat. Masukkan kod laluan semula.', invalidName: 'Masukkan nama satu baris dengan maksimum 80 aksara.', unsupportedName: 'Sesetengah aksara tidak dapat dicetak bersama. Cuba ejaan yang disokong atau hubungi pengajar.', failed: 'Sijil tidak dapat dihasilkan. Sila cuba lagi.' },
};
for (const locale of supportedLocales) Object.assign(interfaceCopy[locale], { certificateEyebrow: certificateCopy[locale].eyebrow, certificateTitle: certificateCopy[locale].title, certificateButton: certificateCopy[locale].button });

const moduleGrid = document.querySelector("#module-grid");
const moduleNav = document.querySelector("#module-nav");
const moduleSearch = document.querySelector("#module-search");
const emptyState = document.querySelector("#empty-state");
const progressValue = document.querySelector("#progress-value");
const progressBar = document.querySelector("#progress-bar");
const completedCount = document.querySelector("#completed-count");
const moduleCount = document.querySelector("#module-count");
const progressText = document.querySelector("#progress-text");
const languageToggle = document.querySelector("#language-toggle");
const certificateDialog = document.querySelector('#certificate-dialog');
const certificateAuthForm = document.querySelector('#certificate-authorize-form');
const certificateNameForm = document.querySelector('#certificate-name-form');
const certificatePasscode = document.querySelector('#certificate-passcode');
const certificateName = document.querySelector('#certificate-name');
const certificateError = document.querySelector('#certificate-error');
const certificateOpen = document.querySelector('#certificate-open');
const certificateAuthorize = document.querySelector('#certificate-authorize');
const certificateIssue = document.querySelector('#certificate-issue');
let certificateToken = '', certificateBusy = false;

function modulePath(module) {
  return `/${module.slug}/`;
}

function moduleLevel(module) {
  const orderIndex = moduleOrder.indexOf(module.slug);
  return orderIndex === -1 ? module.level : orderIndex + 1;
}

function prerequisitesComplete() {
  const prerequisites = modules.filter((module) => moduleLevel(module) <= 20);
  return prerequisites.length === 20 && prerequisites.every((module) => completedModules.has(module.slug));
}

function moduleLocked(module) {
  return moduleLevel(module) >= 21 && !prerequisitesComplete();
}

function displayedTitle(module) {
  const title = moduleCopy(module).title;
  return module.slug === "microbit-gamepad" ? `BONUS · ${title}` : title;
}

function moduleCopy(module) {
  return module.translations?.[currentLocale] || fallbackModuleTranslations[module.slug]?.[currentLocale] || module.translations?.en || module;
}

function localizeTag(tag) {
  return interfaceCopy[currentLocale].tags[tag] || tag;
}

function applyInterfaceCopy() {
  const copy = interfaceCopy[currentLocale];
  document.title = copy.pageTitle;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = copy[element.dataset.i18n];
    if (value) element.textContent = value;
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    const value = copy[element.dataset.i18nAria];
    if (value) element.setAttribute("aria-label", value);
  });
  moduleSearch.placeholder = copy.findModule;
  moduleSearch.setAttribute("aria-label", copy.findModule);
  document.documentElement.lang = currentLocale === "zh" ? "zh-CN" : currentLocale === "ms" ? "ms" : "en";
  languageToggle.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.locale === currentLocale);
  });
}

function setLocale(locale) {
  if (!supportedLocales.includes(locale)) return;
  currentLocale = locale;
  window.localStorage.setItem("godot-forge-locale", locale);
  applyInterfaceCopy();
  renderNavigation();
  renderCards(moduleSearch.value);
  renderProgress();
}

function renderNavigation() {
  moduleNav.innerHTML = modules
    .map(
      (module) => {
        const copy = moduleCopy(module);
        const destination = ["character-creation", "game-assets-creation", "boss-creation", "storyline-engine", "parallax-tiling-map", "items-spawning", "game-loop-engine", "game-controls", "game-settings", "game-physics", "sound-engine", "game-ending-cutscene", "credits", "marketplace-system", "game-achievement", "game-leaderboard", "local-coop", "multiplayer-game", "math-stem-physics-quiz", "setup-godot-with-ai", "enemies-ai", "final-game", "microbit-gamepad"].includes(module.slug) ? modulePath(module) : `#module-${module.slug}`;
        const locked = moduleLocked(module);
        const content = `<span class="nav-number">${String(moduleLevel(module)).padStart(2, "0")}</span><span>${displayedTitle(module)}</span>${locked ? '<span class="nav-check" aria-hidden="true">🔒</span>' : completedModules.has(module.slug) ? '<span class="nav-check">✓</span>' : ""}`;
        return locked
          ? `<span class="nav-item locked" aria-disabled="true" title="${interfaceCopy[currentLocale].unlockRequirement}">${content}</span>`
          : `<a class="nav-item ${completedModules.has(module.slug) ? "completed" : ""}" href="${destination}">${content}</a>`;
      },
    )
    .join("");
}

function renderCards(query = "") {
  const normalizedQuery = query.trim().toLowerCase();
  const filteredModules = modules.filter((module) => {
    const copy = moduleCopy(module);
    return `${copy.title} ${copy.description} ${module.title} ${module.description} ${localizeTag(module.tag)}`.toLowerCase().includes(normalizedQuery);
  });

  moduleGrid.innerHTML = filteredModules
    .map((module) => {
      const copy = moduleCopy(module);
      const complete = completedModules.has(module.slug);
      const locked = moduleLocked(module);
      return `
        <article id="module-${module.slug}" class="module-card ${complete ? "completed" : ""} ${locked ? "locked" : ""}">
          <div class="module-card-top">
            <span class="module-index">${interfaceCopy[currentLocale].chapter} ${String(moduleLevel(module)).padStart(2, "0")}</span>
            <span class="module-state">${localizeTag(module.tag)}</span>
          </div>
          <span class="module-icon" aria-hidden="true"><span class="module-icon-fallback">${moduleIcons[module.slug] || "✦"}</span>${module.slug === "sound-engine" ? "" : `<img src="${module.slug === "microbit-gamepad" ? "/microbit-gamepad/images/joystick-bit-v2.png" : `/tutorial-web-app/images/module-icons/${module.slug}.webp`}" alt="" width="112" height="112" loading="lazy" decoding="async" />`}</span>
          <h3>${displayedTitle(module)}</h3>
          <p>${copy.description}</p>
          <div class="module-meta"><span>↳ ${module.durationMinutes} ${interfaceCopy[currentLocale].minutes}</span><span>● ${locked ? interfaceCopy[currentLocale].locked : complete ? interfaceCopy[currentLocale].done : interfaceCopy[currentLocale].ready}</span></div>
          ${locked ? `<p class="module-lock-reason">🔒 ${interfaceCopy[currentLocale].unlockRequirement}</p>` : ""}
          ${module.slug === 'math-stem-physics-quiz'
            ? `<span class="quiz-requirement">${complete ? interfaceCopy[currentLocale].quizPassed : interfaceCopy[currentLocale].quizRequirement}</span>`
            : `<button class="complete-button" type="button" data-module="${module.slug}" ${locked ? "disabled" : ""} aria-label="${complete ? interfaceCopy[currentLocale].reopen : interfaceCopy[currentLocale].markDone}">${complete ? interfaceCopy[currentLocale].reopen : interfaceCopy[currentLocale].markDone}</button>`}
          <button class="reset-module-button" type="button" data-module="${module.slug}" ${locked ? "disabled" : ""} aria-label="${interfaceCopy[currentLocale].reset}">${interfaceCopy[currentLocale].reset}</button>
          ${locked ? `<span class="card-action locked-action" aria-hidden="true">🔒</span>` : `<a class="card-action" href="${modulePath(module)}" aria-label="${displayedTitle(module)}">↗</a>`}
        </article>
      `;
    })
    .join("");

  emptyState.hidden = filteredModules.length > 0;
  moduleGrid.querySelectorAll('.module-icon img').forEach(image => {
    const loaded = () => image.parentElement.classList.add('has-artwork');
    image.addEventListener('load', loaded, { once: true });
    image.addEventListener('error', () => image.remove(), { once: true });
    if (image.complete && image.naturalWidth) loaded();
  });
  emptyState.textContent = interfaceCopy[currentLocale].emptyState;
  moduleGrid.querySelectorAll(".complete-button").forEach((button) => {
    button.addEventListener("click", () => toggleComplete(button.dataset.module).catch(console.error));
  });
}

function renderProgress() {
  const count = completedModules.size;
  const percentage = modules.length ? Math.round((count / modules.length) * 100) : 0;
  completedCount.textContent = count;
  progressValue.textContent = `${percentage}%`;
  progressBar.style.width = `${percentage}%`;
  progressText.textContent = interfaceCopy[currentLocale].progress(count, modules.length);
  const required = modules.filter(module => moduleLevel(module) >= 1 && moduleLevel(module) <= 23);
  const requiredCount = required.filter(module => completedModules.has(module.slug)).length;
  const eligible = required.length === 23 && requiredCount === 23;
  certificateOpen.disabled = !eligible;
  document.querySelector('#certificate-status').textContent = eligible ? certificateCopy[currentLocale].ready : certificateCopy[currentLocale].progress(requiredCount);
}

async function toggleComplete(slug) {
  if (slug === 'math-stem-physics-quiz' || moduleLocked(modules.find((item) => item.slug === slug))) return;
  const completed = !completedModules.has(slug);
  const response = await fetch(`/api/modules/${encodeURIComponent(slug)}/progress`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ learnerId, completed }),
  });

  if (!response.ok) throw new Error("Unable to save progress.");
  progressRefreshVersion++;
  if (completed) completedModules.add(slug);
  else completedModules.delete(slug);
  renderNavigation();
  renderCards(moduleSearch.value);
  renderProgress();
}

window.addEventListener('godot-forge-module-reset', event => {
  progressRefreshVersion++;
  const slug = event.detail.slug;
  completedModules.delete(slug);
  const module = modules.find(item => item.slug === slug);
  if (module) module.completed = false;
  renderNavigation();
  renderCards(moduleSearch.value);
  renderProgress();
});

moduleSearch.addEventListener("input", (event) => renderCards(event.target.value));

languageToggle.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-locale]");
  if (button) setLocale(button.dataset.locale);
});

document.querySelector("#menu-toggle").addEventListener("click", () => {
  document.querySelector(".sidebar").classList.toggle("open");
});

moduleNav.addEventListener("click", () => {
  document.querySelector(".sidebar").classList.remove("open");
});

function certificateStage(stage) {
  const text = certificateCopy[currentLocale];
  const isName = stage === 'name';
  certificateAuthForm.hidden = isName;
  certificateNameForm.hidden = !isName;
  document.querySelector('#certificate-dialog-title').textContent = isName ? text.nameTitle : text.authTitle;
  document.querySelector('#certificate-dialog-description').textContent = isName ? text.nameDescription : text.authDescription;
  document.querySelector('#certificate-passcode-label').textContent = text.passcode;
  document.querySelector('#certificate-name-label').textContent = text.name;
  certificateAuthorize.textContent = text.continue;
  certificateIssue.textContent = text.download;
  certificateDialog.querySelectorAll('.certificate-cancel').forEach(button => { button.textContent = text.cancel; });
  (isName ? certificateName : certificatePasscode).focus();
}
function setCertificateBusy(value) {
  certificateBusy = value;
  certificateDialog.querySelectorAll('button, input').forEach(element => { element.disabled = value; });
}
certificateOpen.addEventListener('click', () => {
  if (certificateOpen.disabled) return;
  certificateToken = ''; certificatePasscode.value = ''; certificateName.value = ''; certificateError.textContent = '';
  certificateDialog.showModal(); certificateStage('auth');
});
certificateDialog.querySelectorAll('.certificate-cancel').forEach(button => button.addEventListener('click', () => { if (!certificateBusy) certificateDialog.close(); }));
certificateDialog.addEventListener('cancel', event => { if (certificateBusy) event.preventDefault(); });
certificateDialog.addEventListener('close', () => { certificateToken = ''; certificatePasscode.value = ''; certificateName.value = ''; certificateError.textContent = ''; });
certificateAuthForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (certificateBusy || !certificatePasscode.value) return;
  const text = certificateCopy[currentLocale];
  setCertificateBusy(true); certificateError.textContent = '';
  try {
    const response = await fetch('/api/certificates/authorize', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ learnerId, passcode: certificatePasscode.value }) });
    if (!response.ok) throw new Error(response.status === 403 ? text.wrong : response.status === 503 ? text.unavailable : response.status === 409 ? text.incomplete : text.failed);
    const data = await response.json();
    if (typeof data.token !== 'string') throw new Error(text.failed);
    certificateToken = data.token;
    certificatePasscode.value = '';
    setCertificateBusy(false);
    certificateStage('name');
  } catch (error) { certificateError.textContent = error.message || text.failed; }
  finally { setCertificateBusy(false); if (certificateDialog.open && !certificateAuthForm.hidden) { certificatePasscode.focus(); certificatePasscode.select(); } }
});
certificateNameForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (certificateBusy || !certificateToken || !certificateName.value.trim()) return;
  const text = certificateCopy[currentLocale];
  setCertificateBusy(true); certificateError.textContent = '';
  try {
    const response = await fetch('/api/certificates/issue', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ learnerId, token: certificateToken, name: certificateName.value, locale: currentLocale, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }) });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      if (response.status === 403 || response.status === 409) {
        certificateToken = ''; setCertificateBusy(false); certificateStage('auth');
        if (response.status === 409) initializeApp();
        throw new Error(response.status === 403 ? text.expired : text.incomplete);
      }
      throw new Error(body.error === 'unsupported' ? text.unsupportedName : body.error === 'name' ? text.invalidName : text.failed);
    }
    const blob = await response.blob();
    if (blob.type !== 'application/pdf') throw new Error(text.failed);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = 'godot-forge-certificate.pdf'; document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    certificateDialog.close();
  } catch (error) { certificateError.textContent = error.message || text.failed; }
  finally { setCertificateBusy(false); if (certificateDialog.open) (certificateAuthForm.hidden ? certificateName : certificatePasscode).focus(); }
});

async function initializeApp() {
  const version = ++progressRefreshVersion;
  try {
    const response = await fetch(`/api/modules?learnerId=${encodeURIComponent(learnerId)}`);
    if (!response.ok) throw new Error("Unable to load tutorial modules.");
    const updatedModules = await response.json();
    if (version !== progressRefreshVersion) return;
    modules = updatedModules.sort((first, second) => moduleLevel(first) - moduleLevel(second));
    completedModules.clear();
    modules.filter((module) => module.completed).forEach((module) => completedModules.add(module.slug));
    moduleCount.textContent = modules.length;
    renderNavigation();
    renderCards(moduleSearch.value);
    renderProgress();
  } catch (error) {
    if (version !== progressRefreshVersion) return;
    moduleGrid.innerHTML = `<p class="empty-state">${interfaceCopy[currentLocale].loadError}</p>`;
    emptyState.hidden = true;
  }
}

document.addEventListener('visibilitychange', () => { if (!document.hidden) initializeApp(); });

applyInterfaceCopy();
initializeApp();
