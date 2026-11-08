const slug = 'sound-engine';
const $ = selector => document.querySelector(selector);
const learnerId = (() => {
  const key = 'godot-forge-learner-id';
  let id = localStorage.getItem(key);
  if (!id) { id = crypto.randomUUID().replace(/-/g, ''); localStorage.setItem(key, id); }
  return id;
})();
const copy = {
  en: {
    back:'← GODOT FORGE / LEARNING PATH',chapter:'CHAPTER 12 / SOUND ENGINE',eyebrow:'MUSIC / EFFECTS / YOUR GAME',title:'Give your game a voice.',intro:'Set the mood with background music, then bring every jump, coin and sword swing to life.',
    musicEyebrow:'01 / THE SOUNDTRACK',musicTitle:'Start with a mood.',musicIntro:'Describe your world and generate a short instrumental background track, or listen to the free example.',musicBadge:'PROMPT → MUSIC',promptLabel:'BACKGROUND MUSIC PROMPT',generate:'GENERATE MUSIC',example:'USE FREE EXAMPLE',cost:'OpenRouter’s Lyria 3 Clip Preview is listed at about US$0.04 per 30-second clip. Prices and availability can change; generation uses the server’s configured OpenRouter account.',listenEyebrow:'BACKGROUND MUSIC',noTrack:'No track selected yet',listenHelp:'Play the example or generate your own. Download your track to use it in Godot.',downloadMusic:'DOWNLOAD TRACK ↓',
    effectsEyebrow:'02 / THE ACTIONS',effectsTitle:'Make every action count.',effectsIntro:'Try the sounds below. Each one is made in your browser and can be downloaded as a WAV file.',localBadge:'MADE LOCALLY',stageReady:'Choose an action to hear it.',jump:'Jump',jumpDescription:'A rising sound gives lift to the player.',tryJump:'▶ TRY JUMP',coin:'Collect coin',coinDescription:'A bright chime rewards the pickup.',tryCoin:'▶ TRY COIN',sword:'Sword slash',swordDescription:'A quick swoosh makes a swing feel responsive.',trySword:'▶ TRY SLASH',downloadWav:'DOWNLOAD WAV ↓',
    mixEyebrow:'03 / THE MIX',mixTitle:'Find the right balance.',mixIntro:'Adjust music and effects separately. Your settings stay on this device.',soundOn:'SOUND: ON',soundOff:'SOUND: OFF',master:'MASTER',musicVolume:'MUSIC',effectVolume:'EFFECTS',finishEyebrow:'YOUR SOUND ENGINE',finishTitle:'Ready for the next level?',finishHint:'Play the background preview and try all three effects to complete this module.',complete:'COMPLETE MODULE',completed:'MODULE COMPLETE ✓',saved:'Sound Engine complete. Progress saved.',saveError:'Could not save progress. Please try again.',ready:'All sounds tried. You can complete the module.',
    noService:'Music generation is not configured on this server. You can still use the free example.',serviceReady:'OpenRouter is ready. Generation may incur a charge.',loading:'Generating music. This may take a minute…',generated:'Your track is ready. Press play to listen.',exampleName:'Free example loop',generatedName:'Your generated track',needPrompt:'Write a music prompt first.',turnOn:'Turn sound on to preview an effect.',playedJump:'Jump!',playedCoin:'Coin collected!',playedSword:'Sword slash!',playError:'Audio could not play. Check your browser’s sound settings.',generateError:'Could not generate music. Please try again.',stageAria:'Forest sound-effects demonstration',audioAria:'Background music player',language:'Language'
  },
  zh: {
    back:'← GODOT FORGE / 学习路径',chapter:'第 12 章 / 声音引擎',eyebrow:'音乐 / 音效 / 你的游戏',title:'为游戏注入声音。',intro:'用背景音乐营造氛围，再为跳跃、金币和挥剑加入音效。',
    musicEyebrow:'01 / 背景音乐',musicTitle:'从氛围开始。',musicIntro:'描述你的世界并生成一段纯音乐，或试听免费的示例。',musicBadge:'提示词 → 音乐',promptLabel:'背景音乐提示词',generate:'生成音乐',example:'使用免费示例',cost:'OpenRouter 的 Lyria 3 Clip Preview 标价约为每段 30 秒音频 0.04 美元。价格及可用性可能变化；生成使用服务器配置的 OpenRouter 账户。',listenEyebrow:'背景音乐',noTrack:'尚未选择音乐',listenHelp:'播放示例或生成自己的音乐。下载后可用于 Godot。',downloadMusic:'下载音乐 ↓',
    effectsEyebrow:'02 / 动作音效',effectsTitle:'让每个动作都有反馈。',effectsIntro:'试听以下音效。它们在浏览器中生成，可下载为 WAV 文件。',localBadge:'本地生成',stageReady:'选择动作以试听音效。',jump:'跳跃',jumpDescription:'上升的声音让跳跃更有动感。',tryJump:'▶ 试听跳跃',coin:'收集金币',coinDescription:'清脆的音效奖励玩家拾取。',tryCoin:'▶ 试听金币',sword:'挥剑',swordDescription:'快速的挥动声让攻击更有反馈。',trySword:'▶ 试听挥剑',downloadWav:'下载 WAV ↓',
    mixEyebrow:'03 / 混音',mixTitle:'找到合适的平衡。',mixIntro:'分别调整音乐与音效。设置保存在此设备上。',soundOn:'声音：开启',soundOff:'声音：关闭',master:'主音量',musicVolume:'音乐',effectVolume:'音效',finishEyebrow:'你的声音引擎',finishTitle:'准备进入下一关了吗？',finishHint:'播放背景预览并尝试全部三种音效后即可完成本模块。',complete:'完成模块',completed:'模块已完成 ✓',saved:'声音引擎模块已完成，进度已保存。',saveError:'无法保存进度，请重试。',ready:'已试听所有音效，可以完成模块。',
    noService:'此服务器尚未配置音乐生成，但仍可使用免费示例。',serviceReady:'OpenRouter 已就绪。生成音乐可能产生费用。',loading:'正在生成音乐，可能需要一分钟……',generated:'音乐已生成，点击播放试听。',exampleName:'免费示例循环',generatedName:'你生成的音乐',needPrompt:'请先输入音乐提示词。',turnOn:'请先开启声音以试听音效。',playedJump:'跳跃！',playedCoin:'收集金币！',playedSword:'挥剑！',playError:'无法播放音频，请检查浏览器声音设置。',generateError:'无法生成音乐，请重试。',stageAria:'森林音效演示',audioAria:'背景音乐播放器',language:'语言'
  },
  ms: {
    back:'← GODOT FORGE / LALUAN PEMBELAJARAN',chapter:'BAB 12 / ENJIN BUNYI',eyebrow:'MUZIK / KESAN / PERMAINAN ANDA',title:'Berikan suara kepada permainan.',intro:'Cipta suasana dengan muzik latar, kemudian hidupkan setiap lompatan, syiling dan hayunan pedang.',
    musicEyebrow:'01 / MUZIK LATAR',musicTitle:'Mulakan dengan suasana.',musicIntro:'Terangkan dunia anda dan jana muzik latar instrumental pendek, atau dengar contoh percuma.',musicBadge:'PROMPT → MUZIK',promptLabel:'PROMPT MUZIK LATAR',generate:'JANA MUZIK',example:'GUNAKAN CONTOH PERCUMA',cost:'Lyria 3 Clip Preview di OpenRouter disenaraikan sekitar AS$0.04 bagi klip 30 saat. Harga dan ketersediaan boleh berubah; penjanaan menggunakan akaun OpenRouter yang dikonfigurasi pada pelayan.',listenEyebrow:'MUZIK LATAR',noTrack:'Tiada trek dipilih lagi',listenHelp:'Mainkan contoh atau jana sendiri. Muat turun trek untuk digunakan dalam Godot.',downloadMusic:'MUAT TURUN TREK ↓',
    effectsEyebrow:'02 / AKSI',effectsTitle:'Hidupkan setiap aksi.',effectsIntro:'Cuba bunyi di bawah. Setiap bunyi dibuat dalam pelayar dan boleh dimuat turun sebagai fail WAV.',localBadge:'DIBUAT SECARA SETEMPAT',stageReady:'Pilih aksi untuk mendengar bunyinya.',jump:'Lompat',jumpDescription:'Bunyi menaik memberikan rasa lompatan.',tryJump:'▶ CUBA LOMPAT',coin:'Kutip syiling',coinDescription:'Bunyi loceng ceria menghargai kutipan.',tryCoin:'▶ CUBA SYILING',sword:'Hayunan pedang',swordDescription:'Bunyi hayunan pantas menjadikan serangan lebih responsif.',trySword:'▶ CUBA HAYUNAN',downloadWav:'MUAT TURUN WAV ↓',
    mixEyebrow:'03 / CAMPURAN',mixTitle:'Cari keseimbangan yang sesuai.',mixIntro:'Laraskan muzik dan kesan secara berasingan. Tetapan disimpan pada peranti ini.',soundOn:'BUNYI: HIDUP',soundOff:'BUNYI: MATI',master:'UTAMA',musicVolume:'MUZIK',effectVolume:'KESAN',finishEyebrow:'ENJIN BUNYI ANDA',finishTitle:'Sedia untuk aras seterusnya?',finishHint:'Mainkan pratonton muzik dan cuba ketiga-tiga kesan untuk melengkapkan modul.',complete:'SELESAIKAN MODUL',completed:'MODUL SELESAI ✓',saved:'Enjin Bunyi selesai. Kemajuan disimpan.',saveError:'Kemajuan tidak dapat disimpan. Cuba lagi.',ready:'Semua bunyi telah dicuba. Anda boleh melengkapkan modul.',
    noService:'Penjanaan muzik belum dikonfigurasi pada pelayan ini. Anda masih boleh menggunakan contoh percuma.',serviceReady:'OpenRouter sedia. Penjanaan mungkin dikenakan caj.',loading:'Menjana muzik. Ini mungkin mengambil masa seminit…',generated:'Trek anda sedia. Tekan main untuk mendengar.',exampleName:'Gelung contoh percuma',generatedName:'Trek yang anda jana',needPrompt:'Masukkan prompt muzik dahulu.',turnOn:'Hidupkan bunyi untuk mendengar kesan.',playedJump:'Lompat!',playedCoin:'Syiling dikutip!',playedSword:'Hayunan pedang!',playError:'Audio tidak dapat dimainkan. Semak tetapan bunyi pelayar.',generateError:'Muzik tidak dapat dijana. Sila cuba lagi.',stageAria:'Demonstrasi kesan bunyi hutan',audioAria:'Pemain muzik latar',language:'Bahasa'
  }
};
const godotCopy = {
 en: { godotEyebrow:'04 / PUT IT IN YOUR GAME', godotTitle:'Bring the sounds into Godot.', godotIntro:'Use the downloaded files in a local Godot project or your cloud workspace.', godotStep1:'Download the music and all three WAV effects. Copy them into your project’s assets/audio folder (or upload them using Files in the cloud workspace), then wait for Godot to import them.', godotStep2:'Add an AudioStreamPlayer named Music to your main scene. Assign the music file to Stream and enable Autoplay. Enable looping on the imported audio resource if you want continuous music.', godotStep3:'Add AudioStreamPlayer children named JumpSound, CoinSound and SwordSound to the node that controls each action. Assign the matching WAV file to each Stream.', godotStep4:'In the script that owns each sound player, call its play() method when that action happens. For example, after a successful jump use $JumpSound.play(); call $CoinSound.play() when collecting a coin and $SwordSound.play() when attacking. Adjust node paths if your scene is organised differently.', godotStep5:'Run the scene and test all four sounds. Use Godot’s Audio buses and volume controls to balance music against effects.' },
 zh: { godotEyebrow:'04 / 加入你的游戏', godotTitle:'在 Godot 中使用声音。', godotIntro:'在本地 Godot 项目或云工作区中使用下载的文件。', godotStep1:'下载音乐和三个 WAV 音效。将它们复制到项目的 assets/audio 文件夹（云工作区可使用 Files 上传），然后等待 Godot 导入。', godotStep2:'在主场景添加名为 Music 的 AudioStreamPlayer，将音乐文件设置为 Stream 并启用 Autoplay。如需持续播放，请在导入的音频资源上启用循环。', godotStep3:'在控制各动作的节点下添加名为 JumpSound、CoinSound 和 SwordSound 的 AudioStreamPlayer 子节点，并为每个节点设置对应的 WAV 文件。', godotStep4:'在拥有声音播放器的脚本中，于对应动作发生时调用 play()。例如成功跳跃后使用 $JumpSound.play()；收集金币时调用 $CoinSound.play()，攻击时调用 $SwordSound.play()。根据场景结构调整节点路径。', godotStep5:'运行场景并测试四种声音。使用 Godot 音频总线和音量控制平衡音乐与音效。' },
 ms: { godotEyebrow:'04 / MASUKKAN KE DALAM PERMAINAN', godotTitle:'Gunakan bunyi dalam Godot.', godotIntro:'Gunakan fail yang dimuat turun dalam projek Godot setempat atau ruang kerja awan.', godotStep1:'Muat turun muzik dan ketiga-tiga kesan WAV. Salin ke folder assets/audio projek (atau muat naik menggunakan Files di ruang kerja awan), kemudian tunggu Godot mengimportnya.', godotStep2:'Tambah AudioStreamPlayer bernama Music ke adegan utama. Tetapkan fail muzik sebagai Stream dan hidupkan Autoplay. Hidupkan gelung pada sumber audio yang diimport untuk muzik berterusan.', godotStep3:'Tambah anak AudioStreamPlayer bernama JumpSound, CoinSound dan SwordSound pada nod yang mengawal setiap tindakan. Tetapkan fail WAV yang sepadan pada setiap Stream.', godotStep4:'Dalam skrip yang memiliki pemain bunyi, panggil play() apabila tindakan berlaku. Contohnya, gunakan $JumpSound.play() selepas lompatan berjaya; panggil $CoinSound.play() semasa mengutip syiling dan $SwordSound.play() semasa menyerang. Laraskan laluan nod mengikut struktur adegan.', godotStep5:'Jalankan adegan dan cuba keempat-empat bunyi. Gunakan bas Audio dan kawalan kelantangan Godot untuk mengimbangi muzik dan kesan.' }
};
let locale = copy[localStorage.getItem('godot-forge-locale')] ? localStorage.getItem('godot-forge-locale') : 'en';
let completed = false, musicTried = false, busy = false, configured = false;
const tried = new Set();
let musicUrl = '', currentTrack = '';
const effectUrls = new Map(), activeEffects = new Set();
const music = $('#music-player');
const mixKey = 'godot-forge-sound-engine-mix-v1';
let mix = { master: 80, music: 60, effects: 80, muted: false };
try { const saved = JSON.parse(localStorage.getItem(mixKey) || '{}'); for (const key of ['master','music','effects']) if (Number.isFinite(saved[key])) mix[key] = Math.max(0, Math.min(100, saved[key])); if (typeof saved.muted === 'boolean') mix.muted = saved.muted; } catch {}
const t = () => copy[locale];
function applyCopy() {
  Object.assign(copy[locale], godotCopy[locale]);
  document.documentElement.lang = locale === 'zh' ? 'zh-CN' : locale;
  document.querySelectorAll('[data-i18n]').forEach(node => { const key = node.dataset.i18n; if (copy[locale][key] !== undefined) node.textContent = copy[locale][key]; });
  document.querySelectorAll('[data-locale]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.locale === locale)));
  $('#languages').setAttribute('aria-label', t().language); $('#stage').setAttribute('aria-label', t().stageAria); music.setAttribute('aria-label', t().audioAria);
  $('#track-name').textContent = currentTrack === 'example' ? t().exampleName : currentTrack === 'generated' ? t().generatedName : t().noTrack;
  $('#music-status').textContent = busy ? t().loading : configured ? t().serviceReady : t().noService;
  updateMix(); updateCompletion();
}
function updateMix() {
  for (const key of ['master','music','effects']) { $(`#${key}-volume`).value = mix[key]; $(`#${key}-value`).value = `${mix[key]}%`; $(`#${key}-value`).textContent = `${mix[key]}%`; }
  $('#mute-toggle').textContent = mix.muted ? t().soundOff : t().soundOn;
  $('#mute-toggle').setAttribute('aria-pressed', String(mix.muted));
  music.volume = (mix.master / 100) * (mix.music / 100); music.muted = mix.muted;
  for (const audio of activeEffects) { audio.volume = (mix.master / 100) * (mix.effects / 100); audio.muted = mix.muted; }
}
function storeMix() { localStorage.setItem(mixKey, JSON.stringify(mix)); updateMix(); }
function setStatus(message, error = false) { const node = $('#music-status'); node.textContent = message; node.classList.toggle('error', error); }
function wav(samples, rate) {
  const buffer = new ArrayBuffer(44 + samples.length * 2), view = new DataView(buffer);
  const text = (at, value) => { for (let i = 0; i < value.length; i++) view.setUint8(at + i, value.charCodeAt(i)); };
  text(0,'RIFF'); view.setUint32(4,36 + samples.length * 2,true); text(8,'WAVE'); text(12,'fmt '); view.setUint32(16,16,true); view.setUint16(20,1,true); view.setUint16(22,1,true); view.setUint32(24,rate,true); view.setUint32(28,rate * 2,true); view.setUint16(32,2,true); view.setUint16(34,16,true); text(36,'data'); view.setUint32(40,samples.length * 2,true);
  samples.forEach((value,index) => view.setInt16(44 + index * 2, Math.round(Math.max(-1,Math.min(1,value)) * 32767), true));
  return new Blob([buffer], { type:'audio/wav' });
}
function synthesize(kind) {
  const rate = 22050, duration = ({jump:.30,coin:.42,sword:.32,example:5})[kind], samples = new Float32Array(Math.floor(rate * duration));
  let phase = 0, random = 7919, noise = 0;
  const notes = [261.63,329.63,392,329.63,293.66,349.23,440,349.23];
  for (let i = 0; i < samples.length; i++) {
    const time = i / rate, fraction = time / duration;
    if (kind === 'example') {
      const beat = time / (duration / notes.length), n = Math.floor(beat) % notes.length, local = beat - Math.floor(beat);
      const envelope = Math.min(local * 10,1) * Math.pow(1 - local,1.5);
      samples[i] = .13 * envelope * Math.sin(2 * Math.PI * notes[n] * time) + .05 * Math.sin(2 * Math.PI * (n < 4 ? 130.81 : 146.83) * time) * Math.sin(Math.PI * fraction);
    } else if (kind === 'sword') {
      random = (random * 1664525 + 1013904223) >>> 0; const white = random / 2147483648 - 1; noise = .55 * noise + .45 * white;
      samples[i] = .52 * (white - noise) * Math.sin(Math.PI * fraction) * (1 - fraction);
    } else {
      const frequency = kind === 'jump' ? 300 + 420 * fraction : (fraction < .36 ? 880 : 1320);
      phase += 2 * Math.PI * frequency / rate;
      const envelope = Math.min(time / .012,1) * Math.pow(1 - fraction,1.6);
      samples[i] = .28 * envelope * (Math.sin(phase) + .2 * Math.sin(phase * 2));
    }
  }
  return wav(samples, rate);
}
function effectUrl(kind) { if (!effectUrls.has(kind)) effectUrls.set(kind, URL.createObjectURL(synthesize(kind))); return effectUrls.get(kind); }
function setTrack(blob, kind) {
  music.pause(); if (musicUrl) URL.revokeObjectURL(musicUrl);
  musicUrl = URL.createObjectURL(blob); music.src = musicUrl; currentTrack = kind;
  $('#track-name').textContent = kind === 'example' ? t().exampleName : t().generatedName;
  const link = $('#download-music'); link.href = musicUrl; link.download = blob.type === 'audio/mpeg' ? 'game-background-music.mp3' : 'game-background-music.wav'; link.hidden = false;
  updateMix();
}
async function playEffect(kind) {
  if (mix.muted) { $('#stage-message').textContent = t().turnOn; return; }
  const audio = new Audio(effectUrl(kind)); activeEffects.add(audio); updateMix();
  audio.addEventListener('ended', () => activeEffects.delete(audio), { once:true });
  try {
    await audio.play(); tried.add(kind);
    const hero = $('#hero-sprite'), coin = $('#coin'), slash = $('#slash');
    for (const [element, name] of [[hero,'jump'],[hero,'swing'],[coin,'collect'],[slash,'active']]) element.classList.remove(name);
    void hero.offsetWidth;
    if (kind === 'jump') hero.classList.add('jump');
    if (kind === 'coin') coin.classList.add('collect');
    if (kind === 'sword') { hero.classList.add('swing'); slash.classList.add('active'); }
    $('#stage-message').textContent = t()[{jump:'playedJump',coin:'playedCoin',sword:'playedSword'}[kind]];
    updateCompletion();
  } catch { activeEffects.delete(audio); $('#stage-message').textContent = t().playError; }
}
function updateCompletion() {
  const ready = musicTried && ['jump','coin','sword'].every(kind => tried.has(kind));
  $('#complete-module').disabled = completed || !ready;
  $('#complete-module').textContent = completed ? t().completed : t().complete;
  $('#completion-status').textContent = completed ? t().saved : ready ? t().ready : t().finishHint;
}
async function generateMusic() {
  const prompt = $('#music-prompt').value.trim();
  if (!prompt) { setStatus(t().needPrompt, true); return; }
  if (busy || !configured) return;
  busy = true; $('#generate-music').disabled = true; setStatus(t().loading);
  try {
    const response = await fetch('/api/sound-engine/music', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({learnerId,prompt,acknowledgeCost:true}) });
    if (!response.ok) { const info = await response.json().catch(() => ({})); throw new Error(info.error || t().generateError); }
    const blob = await response.blob();
    if (!blob.size || !blob.type.startsWith('audio/')) throw new Error(t().generateError);
    setTrack(blob,'generated'); setStatus(t().generated);
  } catch (error) { setStatus(error.message || t().generateError, true); }
  finally { busy = false; $('#generate-music').disabled = !configured; }
}
$('#languages').addEventListener('click', event => { const next = event.target.closest('[data-locale]')?.dataset.locale; if (!copy[next]) return; locale = next; localStorage.setItem('godot-forge-locale', locale); applyCopy(); });
$('#generate-music').addEventListener('click', generateMusic);
$('#example-music').addEventListener('click', async () => { setTrack(synthesize('example'),'example'); try { await music.play(); } catch { setStatus(t().playError, true); } });
music.addEventListener('play', () => { musicTried = true; updateCompletion(); });
for (const button of document.querySelectorAll('[data-effect]')) button.addEventListener('click', () => playEffect(button.dataset.effect));
for (const button of document.querySelectorAll('[data-download]')) button.addEventListener('click', () => { const link = document.createElement('a'); link.href = effectUrl(button.dataset.download); link.download = `game-${button.dataset.download}.wav`; link.click(); });
for (const key of ['master','music','effects']) $(`#${key}-volume`).addEventListener('input', event => { mix[key] = Number(event.target.value); storeMix(); });
$('#mute-toggle').addEventListener('click', () => { mix.muted = !mix.muted; storeMix(); });
$('#complete-module').addEventListener('click', async () => {
  if (completed || !musicTried || !['jump','coin','sword'].every(kind => tried.has(kind))) return;
  $('#complete-module').disabled = true;
  try { const response = await fetch(`/api/modules/${slug}/progress`, { method:'PATCH', headers:{'content-type':'application/json'}, body:JSON.stringify({learnerId,completed:true}) }); if (!response.ok) throw new Error(); completed = true; updateCompletion(); window.showToast?.(t().saved,'success'); }
  catch { updateCompletion(); $('#completion-status').textContent = t().saveError; }
});
window.addEventListener('godot-forge-module-reset', event => { if (event.detail?.slug !== slug) return; completed = false; musicTried = false; tried.clear(); music.pause(); updateCompletion(); });
window.addEventListener('pagehide', event => { music.pause(); for (const audio of activeEffects) audio.pause(); if (!event.persisted) { if (musicUrl) URL.revokeObjectURL(musicUrl); for (const url of effectUrls.values()) URL.revokeObjectURL(url); } });
applyCopy();
fetch('/api/sound-engine/music/config').then(response => response.ok ? response.json() : Promise.reject()).then(config => { configured = Boolean(config.configured); $('#generate-music').disabled = !configured; setStatus(configured ? t().serviceReady : t().noService); }).catch(() => setStatus(t().noService));
fetch(`/api/modules?learnerId=${encodeURIComponent(learnerId)}`).then(response => response.json()).then(modules => { completed = Boolean(modules.find(module => module.slug === slug)?.completed); updateCompletion(); }).catch(() => {});
