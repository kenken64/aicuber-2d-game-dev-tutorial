const copy = {
  en: {
    back: '← Learning path', chapter: 'CHAPTER 22 / FINAL GAME', title: 'Build your final game.',
    intro: 'Start with the artwork from the lessons, then assemble your own Godot 2D game in the cloud editor.',
    kitTitle: 'Your starter kit', kitDescription: 'The ZIP contains a Godot project, 83 published module images, seven animation coordinate files, and an asset catalog. It is about 83 MiB.',
    download: 'Download starter ZIP', editorTitle: 'Open it in Godot',
    stepOne: 'Open the Learn Godot Web Editor lesson and start your cloud workspace.', stepTwo: 'The starter project and lesson assets are installed automatically.',
    stepThree: 'Build your game, then download a project ZIP when you want a backup.', openEditor: 'Open cloud editor lesson →',
    saveNote: 'Your project stays on the server while the workspace exists. Stop and delete workspace removes it permanently, so download your project ZIP first.'
  },
  zh: {
    back: '← 学习路径', chapter: '第 22 章 / 最终游戏', title: '构建你的最终游戏。',
    intro: '使用课程中的美术素材作为起点，在云端编辑器中组装你自己的 Godot 2D 游戏。',
    kitTitle: '入门素材包', kitDescription: 'ZIP 包含 Godot 项目、83 个已发布的模块图像、7 个动画坐标文件和素材目录，大小约 83 MiB。',
    download: '下载入门 ZIP', editorTitle: '在 Godot 中打开',
    stepOne: '打开“学习 Godot 网页编辑器”课程，并启动云端工作区。', stepTwo: '服务器会自动安装入门项目和课程素材。',
    stepThree: '制作游戏，需要备份时下载项目 ZIP。', openEditor: '打开云端编辑器课程 →',
    saveNote: '工作区存在时，项目保存在服务器上。“停止并删除工作区”会永久删除项目，请先下载项目 ZIP。'
  },
  ms: {
    back: '← Laluan pembelajaran', chapter: 'BAB 22 / PERMAINAN AKHIR', title: 'Bina permainan akhir anda.',
    intro: 'Mulakan dengan karya seni daripada modul pembelajaran, kemudian bina permainan Godot 2D anda dalam editor awan.',
    kitTitle: 'Kit permulaan anda', kitDescription: 'ZIP ini mengandungi projek Godot, 83 imej modul yang diterbitkan, tujuh fail koordinat animasi dan katalog aset. Saiznya kira-kira 83 MiB.',
    download: 'Muat turun ZIP permulaan', editorTitle: 'Buka dalam Godot',
    stepOne: 'Buka pelajaran Godot Web Editor dan mulakan ruang kerja awan anda.', stepTwo: 'Projek permulaan dan aset pelajaran dipasang secara automatik.',
    stepThree: 'Bina permainan anda, kemudian muat turun ZIP projek apabila mahukan sandaran.', openEditor: 'Buka pelajaran editor awan →',
    saveNote: 'Projek kekal pada pelayan selagi ruang kerja wujud. Henti dan padam ruang kerja akan memadamkannya secara kekal; muat turun ZIP projek dahulu.'
  }
};

Object.assign(copy.en, {
  eyebrow: 'CAPSTONE / GODOT PROJECT',
  intro: 'Build one complete 2D level in the Godot cloud editor, using the characters, art, and systems you made across modules 1–19.',
  briefTitle: 'The one-level challenge', briefBody: 'Create a single journey: explore a forest with coins, a shop, enemies and a boss, then reach the portal for the ending and credits. Coins and enemy defeats are optional. Use the same level for solo, local co-op, and online play.',
  briefFreedom: 'Make the story and visual theme your own. Keep the full journey playable from start to finish before adding extra polish.',
  kitDescription: 'The ZIP contains a Godot project, published lesson media, animation coordinate files, and an asset catalog. The project opens on a welcome scene that you will replace with your level.',
  savedAssetsTitle: 'Your saved game assets', savedAssetsDescription: 'Characters, bosses, and asset sheets you generated are separate from the shared ZIP. Download your saved PNG and JSON files here, then add them to your Godot project.',
  assetsLoading: 'Loading saved assets…', assetsEmpty: 'No saved Final Game assets yet. You can still build with the shared kit and add your own PNG files.', assetsError: 'Saved assets could not be loaded. Refresh this page to try again.',
  stepThree: 'Follow the sections below in build order. Run the same level after each section.',
  stepFour: 'For your own PNG and JSON files, use the Files control at the top of the cloud workspace to upload them into assets/my-game, then return to Godot’s FileSystem panel.',
  buildNavLabel: 'Final game build sections', buildTitle: 'Build the game, one section at a time', buildIntro: 'Each section names the earlier modules it brings together and ends with a playable check.', guideLanguageNote: '',
  stepsLabel: 'In Godot', codeLabel: 'Create this GDScript file', treeLabel: 'Scene tree', checkLabel: 'Playtest', copyCode: 'Copy code', copied: 'Copied', walkthroughTitle: 'Logic walkthrough', walkthroughHint: 'Follow the flow, then click a name in the code or select a variable to explain it.', inspectLabel: 'EXPLORE A FUNCTION OR VARIABLE', inspectPlaceholder: 'Choose a name', inspectPrompt: 'Select a name in the code to see what it does in this file.', functionLabel: 'Function', variableLabel: 'Variable', parameterLabel: 'Parameter', apiLabel: 'Godot API', identifierLabel: 'Identifier', contextLabel: 'In this line',
  finishTitle: 'Ready to submit?', finishOne: 'One level plays from its opening story to an ending and credits.', finishTwo: 'Your hero, world, pickups, enemies, boss, interface, and ending use the game assets you made or selected.',
  finishThree: 'Test the same level in solo and local co-op with keyboard and gamepad, then test online guest controls.', finishFour: 'Your shop, achievements, score, leaderboard, settings, and restart flow work.', finishFive: 'Download the finished project ZIP and open the copy to confirm it contains your changes.',
  referencesTitle: 'Godot reference', functionStepsLabel: 'How the code runs'
});
Object.assign(copy.zh, {
  eyebrow: '毕业项目 / GODOT 游戏',
  intro: '在 Godot 云端编辑器中，结合第 1–19 章制作的角色、美术和系统，完成一个完整的 2D 关卡。',
  briefTitle: '单关卡挑战', briefBody: '探索有金币、商店、敌人和首领的森林，到达传送门即可进入结局和制作名单。收集金币及击败敌人均为可选。单人、本地合作和在线模式使用同一关卡。',
  briefFreedom: '故事和视觉主题由你决定。先让完整流程可以通关，再添加细节。',
  kitDescription: 'ZIP 包含 Godot 项目、课程素材、动画坐标文件和素材目录。项目打开后会显示欢迎场景，你将用自己的关卡替换它。',
  savedAssetsTitle: '已保存的游戏素材', savedAssetsDescription: '你生成的角色、首领和素材图不在共享 ZIP 中。请在此下载 PNG 和 JSON 文件，再添加到 Godot 项目。',
  assetsLoading: '正在加载素材…', assetsEmpty: '尚无已保存的最终游戏素材。你仍可使用共享素材包及自己的 PNG 文件。', assetsError: '无法加载已保存素材。请刷新页面重试。',
  stepThree: '按下方顺序完成各部分，每完成一部分就运行同一个关卡。',
  stepFour: '要导入自己的 PNG 和 JSON 文件，请使用云端工作区顶部的“Files”控件上传到 assets/my-game，再回到 Godot 的 FileSystem 面板。',
  buildNavLabel: '最终游戏制作部分', buildTitle: '分段完成游戏', buildIntro: '每部分列出对应的早期课程，并以一次可运行的检查结束。', guideLanguageNote: '以下详细 Godot 操作和 GDScript 示例目前以英文提供。',
  stepsLabel: '在 Godot 中操作', codeLabel: '创建此 GDScript 文件', treeLabel: '场景树', checkLabel: '运行检查', copyCode: '复制代码', copied: '已复制', walkthroughTitle: '逻辑流程', walkthroughHint: '先阅读流程，再点击代码中的名称或选中变量查看说明。', inspectLabel: '查看函数或变量', inspectPlaceholder: '选择名称', inspectPrompt: '选中代码中的名称，查看它在此文件中的作用。', functionLabel: '函数', variableLabel: '变量', parameterLabel: '参数', apiLabel: 'Godot API', identifierLabel: '标识符', contextLabel: '所在代码行',
  finishTitle: '准备提交了吗？', finishOne: '同一个关卡可从开场一直玩到结局与制作名单。', finishTwo: '主角、世界、道具、敌人、首领、界面和结局使用你制作或选用的素材。',
  finishThree: '用键盘和手柄测试同一关卡的单人及本地合作模式，再测试在线访客控制。', finishFour: '商店、成就、分数、排行榜、设置和重新开始都能正常工作。', finishFive: '下载最终项目 ZIP，并打开副本确认所有改动都在其中。',
  referencesTitle: 'Godot 参考文档', functionStepsLabel: '代码执行步骤'
});
Object.assign(copy.ms, {
  eyebrow: 'PROJEK AKHIR / GODOT',
  intro: 'Bina satu tahap 2D yang lengkap dalam editor awan Godot menggunakan watak, seni dan sistem daripada modul 1–19.',
  briefTitle: 'Cabaran satu tahap', briefBody: 'Cipta satu perjalanan: bermula di kawasan selamat, lepasi bahaya, kumpul 20 syiling, lawati kedai, kalahkan dua jenis musuh dan bos, kemudian buat pilihan akhir dan paparkan kredit. Gunakan tahap yang sama untuk solo, kerjasama setempat dan permainan dalam talian.',
  briefFreedom: 'Pilih cerita dan tema visual anda sendiri. Pastikan perjalanan lengkap boleh dimainkan sebelum menambah perincian.',
  kitDescription: 'ZIP mengandungi projek Godot, media pelajaran, fail koordinat animasi dan katalog aset. Projek bermula dengan adegan alu-aluan yang akan digantikan dengan tahap anda.',
  savedAssetsTitle: 'Aset permainan tersimpan', savedAssetsDescription: 'Watak, bos dan helaian aset yang anda hasilkan berasingan daripada ZIP bersama. Muat turun fail PNG dan JSON di sini, kemudian masukkan ke projek Godot.',
  assetsLoading: 'Memuatkan aset…', assetsEmpty: 'Tiada aset Permainan Akhir tersimpan lagi. Anda masih boleh menggunakan kit bersama dan fail PNG anda sendiri.', assetsError: 'Aset tersimpan tidak dapat dimuatkan. Muat semula halaman untuk mencuba lagi.',
  stepThree: 'Ikuti bahagian di bawah mengikut turutan dan jalankan tahap yang sama selepas setiap bahagian.',
  stepFour: 'Untuk fail PNG dan JSON anda sendiri, gunakan kawalan Files di bahagian atas ruang kerja awan untuk memuat naiknya ke assets/my-game, kemudian kembali ke panel FileSystem Godot.',
  buildNavLabel: 'Bahagian pembinaan permainan akhir', buildTitle: 'Bina permainan mengikut bahagian', buildIntro: 'Setiap bahagian menunjukkan modul terdahulu yang digabungkan dan berakhir dengan semakan permainan.', guideLanguageNote: 'Arahan Godot terperinci dan contoh GDScript di bawah tersedia dalam bahasa Inggeris buat masa ini.',
  stepsLabel: 'Dalam Godot', codeLabel: 'Cipta fail GDScript ini', treeLabel: 'Pokok adegan', checkLabel: 'Uji permainan', copyCode: 'Salin kod', copied: 'Disalin', walkthroughTitle: 'Aliran logik', walkthroughHint: 'Ikuti aliran ini, kemudian klik nama dalam kod atau pilih pemboleh ubah untuk penerangan.', inspectLabel: 'TEROKA FUNGSI ATAU PEMBOLEH UBAH', inspectPlaceholder: 'Pilih nama', inspectPrompt: 'Pilih nama dalam kod untuk melihat peranannya dalam fail ini.', functionLabel: 'Fungsi', variableLabel: 'Pemboleh ubah', parameterLabel: 'Parameter', apiLabel: 'Godot API', identifierLabel: 'Pengecam', contextLabel: 'Pada baris ini',
  finishTitle: 'Sedia untuk dihantar?', finishOne: 'Satu tahap boleh dimainkan dari permulaan hingga pengakhiran dan kredit.', finishTwo: 'Wira, dunia, item, musuh, bos, antara muka dan pengakhiran menggunakan aset yang anda hasilkan atau pilih.',
  finishThree: 'Uji tahap yang sama secara solo dan kerjasama setempat dengan papan kekunci serta pad permainan, kemudian uji kawalan tetamu dalam talian.', finishFour: 'Kedai, pencapaian, markah, papan kedudukan, tetapan dan fungsi mula semula berfungsi.', finishFive: 'Muat turun ZIP projek siap dan buka salinannya untuk mengesahkan perubahan anda.',
  referencesTitle: 'Rujukan Godot', functionStepsLabel: 'Cara kod berjalan'
});

Object.assign(copy.en, {
  codeLabel: 'Reference script',
  buildIntro: 'Write one small part in Godot, test it, then continue. Open a GDScript hint whenever you need to check the complete file.',
  stepThree: 'Work through one task at a time below. Type the code in Godot and run each milestone before moving on.',
  taskOf: (current, total) => `TASK ${current} OF ${total}`,
  taskThink: 'Think first', taskWrite: 'Write in Godot', taskHint: 'Need a hint?', taskReveal: 'Show this step’s code', taskOutline: 'Fill in this outline',
  taskWhy: 'Why these lines matter', taskContinue: 'Continue below the previous lines in this file. Keep the indentation shown.',
  taskFirst: 'Create this script in Godot. Type only the lines for this step.', taskReplace: 'Clear the temporary Online.gd script, then type these lines into the same file.',
  taskPrevious: 'Previous', taskNext: 'Next', taskDone: 'I wrote this step', taskChecked: 'I ran this check',
  taskPrepared: 'I completed this step', taskPracticed: 'I tried this change', taskCompleted: 'Done ✓', taskReady: 'All tasks complete ✓',
  referenceTitle: 'GDScript hint', referenceHint: 'Use the complete script to check a line or function, then return to the current task and type that part in Godot.',
  progressNote: 'This checklist saves your place in this browser. Check the result in Godot before marking a task done.'
});
Object.assign(copy.zh, {
  codeLabel: '参考脚本',
  buildIntro: '在 Godot 中一次编写一小部分，测试后继续。需要帮助时可打开 GDScript 提示查看完整文件。',
  stepThree: '一次完成下方一个任务。在 Godot 中亲自输入代码，并在继续前运行每个阶段。',
  taskOf: (current, total) => `任务 ${current} / ${total}`,
  taskThink: '先思考', taskWrite: '在 Godot 中编写', taskHint: '需要提示？', taskReveal: '显示本步骤代码', taskOutline: '补全此代码框架',
  taskWhy: '这些代码的作用', taskContinue: '在此文件的上一部分下方继续输入，保持所示缩进。',
  taskFirst: '在 Godot 中创建此脚本，只输入本步骤的代码。', taskReplace: '清空临时的 Online.gd 脚本，然后在同一文件中输入这些代码。',
  taskPrevious: '上一步', taskNext: '下一步', taskDone: '我已编写此步骤', taskChecked: '我已运行检查',
  taskPrepared: '我已完成此步骤', taskPracticed: '我已尝试修改', taskCompleted: '已完成 ✓', taskReady: '所有任务已完成 ✓',
  referenceTitle: 'GDScript 提示', referenceHint: '用完整脚本核对代码行或函数，然后回到当前任务，亲自在 Godot 中输入这一部分。',
  progressNote: '此清单会在本浏览器中保存进度。完成任务前，请在 Godot 中检查结果。'
});
Object.assign(copy.ms, {
  codeLabel: 'Skrip rujukan',
  buildIntro: 'Tulis satu bahagian kecil dalam Godot, uji, kemudian teruskan. Buka petunjuk GDScript bila-bila masa untuk menyemak fail lengkap.',
  stepThree: 'Selesaikan satu tugasan pada satu masa. Taip kod dalam Godot dan jalankan setiap peringkat sebelum meneruskan.',
  taskOf: (current, total) => `TUGASAN ${current} DARIPADA ${total}`,
  taskThink: 'Fikir dahulu', taskWrite: 'Tulis dalam Godot', taskHint: 'Perlu petunjuk?', taskReveal: 'Tunjuk kod langkah ini', taskOutline: 'Lengkapkan rangka kod ini',
  taskWhy: 'Mengapa baris ini penting', taskContinue: 'Teruskan di bawah baris sebelumnya dalam fail ini. Kekalkan inden yang ditunjukkan.',
  taskFirst: 'Cipta skrip ini dalam Godot. Taip hanya baris untuk langkah ini.', taskReplace: 'Kosongkan skrip Online.gd sementara, kemudian taip baris ini dalam fail yang sama.',
  taskPrevious: 'Sebelumnya', taskNext: 'Seterusnya', taskDone: 'Saya sudah menulis langkah ini', taskChecked: 'Saya sudah menjalankan semakan',
  taskPrepared: 'Saya sudah menyelesaikan langkah ini', taskPracticed: 'Saya sudah mencuba perubahan', taskCompleted: 'Selesai ✓', taskReady: 'Semua tugasan selesai ✓',
  referenceTitle: 'Petunjuk GDScript', referenceHint: 'Gunakan skrip lengkap untuk menyemak satu baris atau fungsi, kemudian kembali ke tugasan semasa dan taip bahagian itu dalam Godot.',
  progressNote: 'Senarai ini menyimpan tempat anda dalam pelayar ini. Semak hasilnya dalam Godot sebelum menandakan tugasan selesai.'
});

Object.assign(copy.en, {
  intro: 'Build one complete 2D level in a locally installed Godot editor or a cloud workspace, using the characters, art, and systems you made across modules 1–19.',
  editorChoice: 'Choose one way to work. Both use Godot 4 and the same starter project.',
  localEditorTitle: 'Option 1 · Godot on your computer',
  localStepOne: 'Download and extract the starter ZIP above. Install or open Godot 4 on your computer.',
  localStepTwo: 'In Godot’s Project Manager, choose Import, select the extracted project.godot file, and open the project.',
  localStepThree: 'To use your own PNG and JSON files, copy them into assets/my-game in the extracted project folder. Create the folder if needed, then check Godot’s FileSystem panel.',
  downloadGodot: 'Get Godot 4 ↗',
  localSaveNote: 'Your local changes stay in the project folder on your computer. Back up that folder or make a ZIP when you finish.',
  cloudEditorTitle: 'Option 2 · Cloud workspace',
  editorSyncNote: 'Local and cloud projects do not sync automatically. To continue a cloud project locally, download its project ZIP from the cloud workspace, extract it, and import its project.godot file in Godot.',
  finishFive: 'Back up the finished project: copy the local project folder or download the cloud project ZIP, then open the copy to confirm your changes.'
});
Object.assign(copy.zh, {
  intro: '使用本机安装的 Godot 编辑器或云端工作区，结合第 1–19 章制作的角色、美术和系统，完成一个完整的 2D 关卡。',
  editorChoice: '选择一种方式制作。两种方式都使用 Godot 4 和相同的入门项目。',
  localEditorTitle: '方式 1 · 本机 Godot 编辑器',
  localStepOne: '下载并解压上方的入门 ZIP。在电脑上安装或打开 Godot 4。',
  localStepTwo: '在 Godot 项目管理器中选择“导入”，选择解压后的 project.godot 文件，然后打开项目。',
  localStepThree: '要使用自己的 PNG 和 JSON 文件，请将它们复制到解压后项目文件夹中的 assets/my-game。必要时先创建该文件夹，再查看 Godot 的 FileSystem 面板。',
  downloadGodot: '获取 Godot 4 ↗',
  localSaveNote: '本机修改保存在电脑的项目文件夹中。完成后请备份该文件夹或将其压缩为 ZIP。',
  cloudEditorTitle: '方式 2 · 云端工作区',
  editorSyncNote: '本机和云端项目不会自动同步。要在本机继续云端项目，请从云端工作区下载项目 ZIP，解压后在 Godot 中导入其中的 project.godot 文件。',
  finishFive: '备份完成的项目：复制本机项目文件夹或下载云端项目 ZIP，再打开副本确认改动。'
});
Object.assign(copy.ms, {
  intro: 'Bina satu tahap 2D yang lengkap dalam editor Godot yang dipasang pada komputer atau dalam ruang kerja awan, menggunakan watak, seni dan sistem daripada modul 1–19.',
  editorChoice: 'Pilih satu cara untuk bekerja. Kedua-duanya menggunakan Godot 4 dan projek permulaan yang sama.',
  localEditorTitle: 'Pilihan 1 · Godot pada komputer',
  localStepOne: 'Muat turun dan ekstrak ZIP permulaan di atas. Pasang atau buka Godot 4 pada komputer anda.',
  localStepTwo: 'Dalam Pengurus Projek Godot, pilih Import, pilih fail project.godot yang diekstrak, kemudian buka projek.',
  localStepThree: 'Untuk menggunakan fail PNG dan JSON sendiri, salinnya ke assets/my-game dalam folder projek yang diekstrak. Cipta folder jika perlu, kemudian semak panel FileSystem Godot.',
  downloadGodot: 'Dapatkan Godot 4 ↗',
  localSaveNote: 'Perubahan setempat disimpan dalam folder projek pada komputer anda. Sandarkan folder itu atau hasilkan ZIP apabila selesai.',
  cloudEditorTitle: 'Pilihan 2 · Ruang kerja awan',
  editorSyncNote: 'Projek setempat dan awan tidak disegerakkan secara automatik. Untuk meneruskan projek awan secara setempat, muat turun ZIP projek dari ruang kerja awan, ekstrak dan import fail project.godot dalam Godot.',
  finishFive: 'Sandarkan projek siap: salin folder projek setempat atau muat turun ZIP projek awan, kemudian buka salinannya untuk mengesahkan perubahan.'
});

const guide = window.finalGameGuide || [];
const walkthroughs = window.finalGameWalkthrough || {};
const functionDetails = window.finalGameFunctionDetails || {};
const commonSymbols = window.finalGameCommonSymbols || {};
const writing = window.finalGameWriting;
const writingProgressKey = 'godot-forge-final-writing-v1';
function readWritingProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(writingProgressKey) || '{}');
    return { completed: new Set(Array.isArray(saved.completed) ? saved.completed : []), positions: saved.positions || {} };
  } catch { return { completed: new Set(), positions: {} }; }
}
const writingProgress = readWritingProgress();
const hintsShown = new Set();
const codeShown = new Set();
const openReferences = new Set();
const tasksBySection = new Map(guide.map(section => [section.id, writing.makeTasks(section, walkthroughs, functionDetails)]));
function saveWritingProgress() {
  localStorage.setItem(writingProgressKey, JSON.stringify({ completed: [...writingProgress.completed], positions: writingProgress.positions }));
}
const moduleSlugs = {
  1: 'character-creation', 2: 'game-assets-creation', 3: 'boss-creation',
  4: 'storyline-engine', 5: 'parallax-tiling-map', 6: 'items-spawning',
  7: 'enemies-ai', 8: 'game-loop-engine', 9: 'game-controls',
  10: 'game-settings', 11: 'game-physics', 12: 'sound-engine',
  13: 'game-ending-cutscene', 14: 'credits', 15: 'marketplace-system',
  16: 'game-achievement', 17: 'game-leaderboard', 18: 'local-coop', 19: 'multiplayer-game'
};
const navList = document.querySelector('#build-nav-list');
const sections = document.querySelector('#build-sections');
Object.assign(copy.en, { previewKicker: 'THE SLEEPING GROVE', previewTitle: 'See the game in action', previewDescription: 'A glimpse of the forest adventure you can build in Godot.', previewCaption: 'Gameplay from the example project. Your own game can look and play differently.', previewAlt: 'A forest game showing a hero fighting an enemy and reaching a glowing portal.', previewPause: 'Pause animation', previewPlay: 'Play animation' });
Object.assign(copy.zh, { previewKicker: '沉睡的森林', previewTitle: '看看游戏的实际画面', previewDescription: '预览你可以在 Godot 中制作的森林冒险。', previewCaption: '示例项目的游戏画面。你可以自行设计游戏的外观和玩法。', previewAlt: '森林游戏中的英雄与敌人战斗，并走向发光的传送门。', previewPause: '暂停动画', previewPlay: '播放动画' });
Object.assign(copy.ms, { previewKicker: 'RIMBA YANG TIDUR', previewTitle: 'Lihat permainan beraksi', previewDescription: 'Sekilas pandang pengembaraan hutan yang boleh anda bina dalam Godot.', previewCaption: 'Rakaman permainan contoh. Rupa dan cara permainan anda boleh berbeza.', previewAlt: 'Permainan hutan yang menunjukkan wira melawan musuh dan menuju ke portal bercahaya.', previewPause: 'Jeda animasi', previewPlay: 'Mainkan animasi' });
const previewImage = document.querySelector('#game-preview-image');
const previewToggle = document.querySelector('#game-preview-toggle');
const previewMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let previewPlaying = !previewMotion.matches;
function updatePreview() {
  const source = previewPlaying ? previewImage.dataset.animatedSrc : previewImage.dataset.stillSrc;
  if (previewImage.getAttribute('src') !== source) previewImage.setAttribute('src', source);
  previewImage.alt = copy[currentLocale].previewAlt;
  previewToggle.textContent = previewPlaying ? copy[currentLocale].previewPause : copy[currentLocale].previewPlay;
}
previewToggle.addEventListener('click', () => { previewPlaying = !previewPlaying; updatePreview(); });
previewMotion.addEventListener('change', event => { if (event.matches) { previewPlaying = false; updatePreview(); } });

const savedAssets = document.querySelector('#saved-assets');
let currentLocale = 'en';

function element(tag, className, value) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (value !== undefined) node.textContent = value;
  return node;
}

const gdscriptKeywords = new Set('extends class_name static func var const if elif else for in while match return pass break continue await signal enum is as and or not self super'.split(' '));
const gdscriptTypes = new Set('void bool int float String StringName Array Dictionary Vector2 Vector3 Color Node Node2D CharacterBody2D Area2D RigidBody2D Control Label Sprite2D AnimatedSprite2D InputEventJoypadButton InputEventJoypadMotion WebSocketPeer FileAccess JSON Input InputMap AudioServer Game'.split(' '));
const gdscriptLiterals = new Set(['true', 'false', 'null']);
const gdscriptTokenPattern = /#[^\n]*|"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|@[A-Za-z_]\w*|\$[A-Za-z_]\w*(?:\/[A-Za-z_]\w*)*|\b(?:0x[\da-fA-F]+|\d+(?:\.\d+)?)\b|\b[A-Za-z_]\w*\b/g;

function highlightedGDScript(source) {
  const fragment = document.createDocumentFragment();
  const pattern = new RegExp(gdscriptTokenPattern.source, 'g');
  let cursor = 0;
  for (const match of source.matchAll(pattern)) {
    const token = match[0];
    const index = match.index;
    if (index > cursor) fragment.append(document.createTextNode(source.slice(cursor, index)));
    let kind = '';
    if (token[0] === '#') kind = 'comment';
    else if (token[0] === '"' || token[0] === "'") kind = 'string';
    else if (token[0] === '@') kind = 'annotation';
    else if (token[0] === '$') kind = 'node';
    else if (/^(?:0x[\da-fA-F]+|\d)/.test(token)) kind = 'number';
    else if (gdscriptLiterals.has(token)) kind = 'literal';
    else if (gdscriptKeywords.has(token)) kind = 'keyword';
    else if (gdscriptTypes.has(token)) kind = 'type';
    else if (/^[A-Z][A-Z0-9_]+$/.test(token)) kind = 'constant';
    else if (/^\s*\(/.test(source.slice(index + token.length))) kind = 'function';
    const selectable = (/^[A-Za-z_]\w*$/.test(token) && !gdscriptKeywords.has(token) && !gdscriptLiterals.has(token)) || token[0] === '$';
    if (selectable && !kind) kind = 'identifier';
    const node = kind ? element('span', `gd-token gd-${kind}`, token) : document.createTextNode(token);
    if (selectable) {
      node.classList.add('gd-symbol');
      node.dataset.symbol = token;
      node.dataset.offset = String(index);
    }
    fragment.append(node);
    cursor = index + token.length;
  }
  if (cursor < source.length) fragment.append(document.createTextNode(source.slice(cursor)));
  return fragment;
}

function declaredSymbols(source) {
  const symbols = new Map();
  let owner = '';
  source.split('\n').forEach((line, index) => {
    const method = line.match(/^\s*(?:static\s+)?func\s+([A-Za-z_]\w*)\s*\(([^)]*)\)/);
    if (method) {
      owner = method[1];
      symbols.set(owner, { kind: 'function', line: index + 1 });
      for (const argument of method[2].split(',')) {
        const name = argument.trim().match(/^([A-Za-z_]\w*)/)?.[1];
        if (name && !symbols.has(name)) symbols.set(name, { kind: 'parameter', line: index + 1, owner });
      }
    }
    const declaration = line.match(/^\s*(?:(?:@export|@onready)\s+)?(?:var|const)\s+([A-Za-z_]\w*)/);
    if (declaration && !symbols.has(declaration[1])) {
      symbols.set(declaration[1], { kind: 'variable', line: index + 1, owner: /^\s/.test(line) ? owner : '' });
    }
  });
  return symbols;
}

function sourceLine(source, offset) {
  const position = Math.max(0, offset);
  const start = source.lastIndexOf('\n', position - 1) + 1;
  const end = source.indexOf('\n', position);
  return source.slice(start, end < 0 ? source.length : end).trim();
}

function selectedCodeName(codeElement) {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || !codeElement.contains(selection.anchorNode) || !codeElement.contains(selection.focusNode)) return '';
  const name = selection.toString().trim();
  return /^[A-Za-z_]\w*$/.test(name) ? name : '';
}

function createCodeStudy(code, notes, words, fileName) {
  const study = element('div', 'code-study');
  const pre = element('pre', 'gdscript');
  pre.tabIndex = 0;
  const codeElement = element('code');
  codeElement.append(highlightedGDScript(code));
  codeElement.querySelectorAll('.gd-symbol').forEach(token => {
    const description = notes.symbols?.[token.dataset.symbol] || commonSymbols[token.dataset.symbol];
    if (description) token.title = description;
  });
  pre.append(codeElement);

  const panel = element('aside', 'logic-panel');
  panel.append(element('h4', '', words.walkthroughTitle), element('p', 'logic-hint', words.walkthroughHint));
  const flow = element('ol', 'logic-flow');
  (notes.flow || []).forEach(step => flow.append(element('li', '', step)));
  panel.append(flow);
  const selectorLabel = element('label', 'symbol-picker-label', words.inspectLabel);
  const selector = element('select', 'symbol-picker');
  selector.append(element('option', '', words.inspectPlaceholder));
  selector.firstElementChild.value = '';
  selectorLabel.append(selector);
  const details = element('div', 'symbol-detail');
  details.setAttribute('aria-live', 'polite');
  details.append(element('p', 'symbol-prompt', words.inspectPrompt));
  panel.append(selectorLabel, details);

  const declarations = declaredSymbols(code);
  for (const name of Object.keys(notes.symbols || {})) {
    const option = element('option', '', `${name} · ${words[`${declarations.get(name)?.kind || 'identifier'}Label`] || words.identifierLabel}`);
    option.value = name;
    selector.append(option);
  }

  function explain(name, offset = code.indexOf(name)) {
    const info = declarations.get(name);
    const kind = info?.kind || (commonSymbols[name] ? 'api' : 'identifier');
    let explanation = notes.symbols?.[name] || commonSymbols[name];
    if (!explanation && info?.kind === 'parameter') explanation = `This value is passed into ${info.owner}() by its caller or signal.`;
    if (!explanation && info?.kind === 'variable') explanation = `This variable is declared ${info.owner ? `inside ${info.owner}()` : 'for this script'} and stores a value used by the surrounding logic.`;
    if (!explanation && info?.kind === 'function') explanation = 'This function runs when another part of the game calls it or when its connected signal fires.';
    if (!explanation) explanation = 'This name is used in the line below. Read the surrounding function to see where its value comes from and what it changes.';
    details.replaceChildren();
    details.append(element('span', 'symbol-kind', words[`${kind}Label`] || words.identifierLabel), element('h5', '', name), element('p', '', explanation));
    const steps = kind === 'function' ? functionDetails[fileName]?.[name] : null;
    if (steps?.length) {
      details.append(element('h6', 'function-steps-label', words.functionStepsLabel));
      const list = element('ol', 'function-steps');
      steps.forEach(([snippet, reason]) => {
        const item = element('li');
        item.append(element('code', '', snippet), element('p', '', reason));
        list.append(item);
      });
      details.append(list);
    }
    const line = sourceLine(code, offset);
    if (line) {
      const context = element('div', 'symbol-context');
      context.append(element('span', '', words.contextLabel), element('code', '', line));
      details.append(context);
    }
    codeElement.querySelectorAll('.gd-symbol').forEach(token => token.classList.toggle('is-selected', token.dataset.symbol === name));
    selector.value = Object.hasOwn(notes.symbols || {}, name) ? name : '';
    panel.scrollTop += details.getBoundingClientRect().top - panel.getBoundingClientRect().top - 12;
  }

  codeElement.addEventListener('click', event => {
    const selection = selectedCodeName(codeElement);
    if (selection) { explain(selection); return; }
    const token = event.target.closest?.('.gd-symbol');
    if (token) explain(token.dataset.symbol, Number(token.dataset.offset));
  });
  pre.addEventListener('mouseup', () => {
    const name = selectedCodeName(codeElement);
    if (name) explain(name);
  });
  pre.addEventListener('keyup', () => {
    const name = selectedCodeName(codeElement);
    if (name) explain(name);
  });
  selector.addEventListener('change', () => {
    if (!selector.value) return;
    explain(selector.value);
    const token = codeElement.querySelector('.gd-symbol.is-selected');
    if (token) pre.scrollTop += token.getBoundingClientRect().top - pre.getBoundingClientRect().top - pre.clientHeight / 2;
  });

  study.append(pre, panel);
  return study;
}

function writingStep(task, words) {
  const body = element('div', 'writing-task-body');
  if (task.kind !== 'code') {
    body.append(element('p', 'writing-goal', task.body));
    return body;
  }
  body.append(element('p', 'writing-goal', task.goal));
  const think = element('div', 'writing-think');
  think.append(element('strong', '', words.taskThink), element('p', '', task.think));
  body.append(think);
  const instruction = task.fileName === 'scripts/Online.gd' && task.code.startsWith('extends ')
    ? words.taskReplace : task.id === 'code:plan:game-stub' || task.part === 1 && task.code.startsWith('extends ')
      ? words.taskFirst : words.taskContinue;
  const write = element('div', 'writing-instruction');
  write.append(element('strong', '', `${words.taskWrite} · ${task.displayFileName || task.fileName}`), element('p', '', instruction));
  body.append(write);
  const hasHint = hintsShown.has(task.id);
  const hasCode = task.coached || codeShown.has(task.id) || writingProgress.completed.has(task.id);
  if (task.coached && task.hint) body.append(element('p', 'writing-hint', task.hint));
  if (!hasCode && task.skeleton) {
    body.append(element('strong', 'writing-outline-label', words.taskOutline));
    const outline = element('pre', 'step-outline');
    outline.append(element('code', '', task.skeleton));
    body.append(outline);
  }
  if (!hasHint && !hasCode) {
    const hintButton = element('button', 'writing-help', words.taskHint);
    hintButton.type = 'button';
    hintButton.addEventListener('click', () => { hintsShown.add(task.id); renderGuide(task.sectionId, '.writing-reveal'); });
    body.append(hintButton);
  }
  if (hasHint) body.append(element('p', 'writing-hint', task.hint));
  if (!hasCode) {
    if (hasHint) {
      const reveal = element('button', 'writing-reveal', words.taskReveal);
      reveal.type = 'button';
      reveal.addEventListener('click', () => { codeShown.add(task.id); renderGuide(task.sectionId, '.step-code'); });
      body.append(reveal);
    }
  } else {
    const pre = element('pre', 'step-code');
    const code = element('code');
    code.append(highlightedGDScript(task.code));
    pre.append(code);
    body.append(pre);
    if (task.explanations?.length) {
      const why = element('div', 'writing-why');
      why.append(element('strong', '', words.taskWhy));
      const list = element('ul');
      task.explanations.forEach(explanation => list.append(element('li', '', explanation)));
      why.append(list);
      body.append(why);
    }
  }
  return body;
}

function renderTask(section, words) {
  const tasks = tasksBySection.get(section.id);
  const position = Math.min(Math.max(Number(writingProgress.positions[section.id]) || 0, 0), tasks.length - 1);
  const task = tasks[position];
  const completedCount = tasks.filter(item => writingProgress.completed.has(item.id)).length;
  const shell = element('div', 'writing-stepper');
  const top = element('div', 'writing-stepper-top');
  top.append(element('span', 'writing-count', words.taskOf(position + 1, tasks.length)),
    element('span', 'writing-progress-text', `${completedCount} / ${tasks.length}`));
  shell.append(top);
  const meter = element('progress', 'writing-progress');
  meter.max = tasks.length;
  meter.value = completedCount;
  meter.setAttribute('aria-label', `${completedCount} / ${tasks.length}`);
  shell.append(meter);
  shell.append(element('h3', 'writing-task-title', task.title));
  shell.append(writingStep(task, words));
  const actions = element('div', 'writing-actions');
  const previous = element('button', 'writing-previous', words.taskPrevious);
  previous.type = 'button';
  previous.disabled = position === 0;
  previous.addEventListener('click', () => {
    writingProgress.positions[section.id] = position - 1;
    saveWritingProgress();
    renderGuide(section.id, '.writing-next');
  });
  const doneText = writingProgress.completed.has(task.id) ? words.taskCompleted
    : task.kind === 'checkpoint' ? words.taskChecked
      : task.kind === 'practice' ? words.taskPracticed
        : task.kind === 'setup' ? words.taskPrepared : words.taskDone;
  const done = element('button', 'writing-done', doneText);
  done.type = 'button';
  done.disabled = writingProgress.completed.has(task.id);
  done.addEventListener('click', () => {
    writingProgress.completed.add(task.id);
    if (position + 1 < tasks.length) writingProgress.positions[section.id] = position + 1;
    saveWritingProgress();
    renderGuide(section.id, '.writing-done');
  });
  const next = element('button', 'writing-next', words.taskNext);
  next.type = 'button';
  next.disabled = position + 1 >= tasks.length || !writingProgress.completed.has(task.id);
  next.addEventListener('click', () => {
    writingProgress.positions[section.id] = position + 1;
    saveWritingProgress();
    renderGuide(section.id, '.writing-done');
  });
  actions.append(previous, done, next);
  shell.append(actions);
  if (completedCount === tasks.length) shell.append(element('p', 'writing-ready', words.taskReady));
  return shell;
}

function renderGuide(focusSection = '', focusSelector = '') {
  navList.replaceChildren();
  sections.replaceChildren();
  const words = copy[currentLocale];
  guide.forEach(section => {
    const tasks = tasksBySection.get(section.id);
    const completeCount = tasks.filter(task => writingProgress.completed.has(task.id)).length;
    const item = element('li');
    const link = element('a', '', section.title);
    link.href = `#${section.id}`;
    const count = element('span', 'nav-progress', `${completeCount}/${tasks.length}`);
    link.append(count);
    item.append(link);
    navList.append(item);
    const card = element('section', 'build-section');
    card.id = section.id;
    const modules = element('p', 'module-links');
    section.modules.split(' · ').forEach((part, index) => {
      if (index) modules.append(document.createTextNode(' · '));
      const number = Number(part.match(/^(\d+)\s/)?.[1]);
      if (moduleSlugs[number]) {
        const link = element('a', '', part);
        link.href = `/${moduleSlugs[number]}/`;
        modules.append(link);
      } else {
        modules.append(document.createTextNode(part));
      }
    });
    card.append(modules);
    card.append(element('h2', '', section.title));
    card.append(element('p', 'section-summary', section.summary));
    card.append(element('p', 'writing-progress-note', words.progressNote));
    card.append(renderTask(section, words));
    if (section.tree) {
      const tree = element('details', 'scene-tree-reference');
      tree.append(element('summary', '', words.treeLabel));
      const pre = element('pre', 'scene-tree');
      pre.append(element('code', '', section.tree));
      tree.append(pre);
      card.append(tree);
    }
    writing.buildFiles(section).forEach(file => {
      const reference = element('details', 'file-reference');
      const referenceId = `${section.id}:${file.name}`;
      reference.open = openReferences.has(referenceId);
      reference.addEventListener('toggle', () => {
        if (reference.open) openReferences.add(referenceId);
        else openReferences.delete(referenceId);
      });
      reference.append(element('summary', '', `${words.referenceTitle} · ${file.name}`));
      reference.append(element('p', 'reference-hint', words.referenceHint));
      const header = element('div', 'code-header');
      header.append(element('h3', '', `${words.codeLabel}: ${file.name}`));
      const code = file.code.replace('__RELAY_URL__', writing.relayUrl());
      reference.append(header, createCodeStudy(code, walkthroughs[file.name] || {}, words, file.name));
      card.append(reference);
    });
    sections.append(card);
  });
  if (focusSection) {
    const card = document.getElementById(focusSection);
    card?.querySelector(focusSelector)?.focus?.({ preventScroll: true });
  }
}

function applyLocale(locale) {
  currentLocale = locale;
  document.documentElement.lang = locale === 'zh' ? 'zh-CN' : locale;
  document.querySelectorAll('[data-copy]').forEach(element => { element.textContent = copy[locale][element.dataset.copy] || ''; });
  document.querySelectorAll('[data-aria-label]').forEach(element => { element.setAttribute('aria-label', copy[locale][element.dataset.ariaLabel]); });
  document.querySelectorAll('[data-locale]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.locale === locale)));
  updatePreview();
  document.title = `${copy[locale].title} · Godot Forge`;
  document.querySelector('#guide-language-note').hidden = locale === 'en';
  renderGuide();
}

async function loadSavedAssets() {
  savedAssets.textContent = copy[currentLocale].assetsLoading;
  try {
    const response = await fetch('/api/assets?module=final-game');
    if (!response.ok) throw new Error('Could not load assets');
    const assets = await response.json();
    if (!assets.length) {
      savedAssets.textContent = copy[currentLocale].assetsEmpty;
      return;
    }
    const list = element('ul', 'saved-asset-list');
    assets.forEach(asset => {
      const item = element('li');
      const link = element('a', '', asset.originalName);
      link.href = asset.assetUrl;
      link.download = asset.originalName;
      item.append(link);
      list.append(item);
    });
    savedAssets.replaceChildren(list);
  } catch {
    savedAssets.textContent = copy[currentLocale].assetsError;
  }
}

const savedLocale = localStorage.getItem('godot-forge-locale');
applyLocale(copy[savedLocale] ? savedLocale : 'en');
loadSavedAssets();
document.querySelector('#languages').addEventListener('click', event => {
  const locale = event.target.closest('[data-locale]')?.dataset.locale;
  if (!copy[locale]) return;
  localStorage.setItem('godot-forge-locale', locale);
  applyLocale(locale);
  if (!savedAssets.querySelector('ul')) loadSavedAssets();
});
