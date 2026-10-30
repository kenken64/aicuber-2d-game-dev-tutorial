const translations = {
  en: {},
  zh: {
    back:'← GODOT FORGE / 学习路径', chapter:'第 22 章 / 输入', eyebrow:'MAKECODE / 蓝牙 / 你的游戏', title:'制作 micro:bit 蓝牙游戏手柄。', intro:'使用 MakeCode 积木和电脑接收程序，将 ELECFREAKS Joystick:bit V2 变成无线控制器。', open:'打开 MakeCode ↗', photo:'Joystick:bit V2 套件 · 图片来自 ELECFREAKS ↗', howTitle:'三个部分，一个控制器', how:'Joystick:bit 读取操作，蓝牙 UART 发送数值，电脑接收程序将其转换成键盘或虚拟手柄输入。仅配对蓝牙不会创建原生游戏手柄。', hardware:'准备硬件', hardwareIntro:'你需要 micro:bit、Joystick:bit V2、两节 AAA 电池、USB 线和支持蓝牙的电脑。将 micro:bit 插入手柄并装入电池。', control:'手柄控制', pin:'micro:bit 引脚', x:'摇杆 X（左右）', y:'摇杆 Y（上下）', buttons:'按钮 C、D、E、F', vibration:'振动马达', docs:'ELECFREAKS 硬件文档 ↗', program:'创建积木程序', step1:'打开 MakeCode，创建名为 Bluetooth Gamepad 的项目。', step2:'选择扩展，添加官方 Bluetooth 扩展。如果 MakeCode 提示冲突，请移除 Radio 扩展。', step3:'切换到 JavaScript，用下方程序替换现有代码，再切回积木查看和编辑生成的积木。', step4:'通过 USB 将程序下载到 micro:bit，然后使用电池为手柄供电。', copy:'复制代码', programNote:'启动时，程序开启蓝牙 UART 并显示笑脸。在无限循环中，它读取两个轴和四个按钮，发送一行数值，然后暂停 50 毫秒——每秒约更新 20 次。程序假设按钮为低电平有效（按下时为 0）；请在你的电路板上验证。', connect:'连接电脑', connectBody:'根据 MakeCode 的蓝牙设置，使用相应的 micro:bit 蓝牙配对步骤。单独的电脑接收程序必须连接蓝牙 UART 服务、订阅通知，并在解析前拼接以换行符结尾的完整消息。', sample:'示例：摇杆大致居中，四个按钮均未按下。实际中心值可能不同。', calibrate:'检查每个轴和按钮。校准中心和方向，并设置死区，避免微小变化导致角色移动。接收程序断开连接时应释放所有按住的控制。', btDocs:'MakeCode 蓝牙文档 ↗', receiver:'选择电脑接收程序', keyboard:'键盘模拟器', keyboardBody:'将摇杆映射到 WASD 或方向键，将按钮映射到空格、回车或其他键。通常这是更容易入门的方式。', virtual:'虚拟游戏手柄', virtualBody:'将数值映射到虚拟 Xbox 或标准手柄，适用于需要手柄输入的游戏。这需要操作系统专用的额外软件。', receiverNote:'接收程序是适用于 Windows、macOS 或 Linux 的独立应用；本课程不会安装接收程序。构建前请选择操作系统和输入模式。', finish:'完成课程了吗？', finishBody:'学习程序和连接步骤后，保存你的进度。', complete:'标记课程完成', reopen:'重新打开课程', saved:'进度已保存。', error:'无法加载或保存进度，请刷新后重试。', copied:'代码已复制。', copyError:'无法复制代码，请手动选择并复制。'
  },
  ms: {
    back:'← GODOT FORGE / LALUAN PEMBELAJARAN', chapter:'BAB 22 / INPUT', eyebrow:'MAKECODE / BLUETOOTH / PERMAINAN ANDA', title:'Bina pad permainan Bluetooth micro:bit.', intro:'Jadikan ELECFREAKS Joystick:bit V2 pengawal wayarles menggunakan blok MakeCode dan penerima PC.', open:'Buka MakeCode ↗', photo:'Kit Joystick:bit V2 · foto oleh ELECFREAKS ↗', howTitle:'Tiga bahagian, satu pengawal', how:'Joystick:bit membaca kawalan, Bluetooth UART menghantar nilai dan penerima PC menukarkannya kepada input papan kekunci atau pengawal maya. Memadankan Bluetooth sahaja tidak menghasilkan pad permainan asli.', hardware:'Sediakan perkakasan', hardwareIntro:'Anda memerlukan micro:bit, Joystick:bit V2, dua bateri AAA, kabel USB dan komputer yang menyokong Bluetooth. Masukkan micro:bit ke dalam papan dan pasang bateri.', control:'Kawalan pad permainan', pin:'Pin micro:bit', x:'Kayu bedik X (kiri/kanan)', y:'Kayu bedik Y (atas/bawah)', buttons:'Butang C, D, E, F', vibration:'Motor getaran', docs:'Dokumentasi perkakasan ELECFREAKS ↗', program:'Cipta program blok', step1:'Buka MakeCode dan cipta projek bernama Bluetooth Gamepad.', step2:'Pilih Extensions dan tambah sambungan rasmi Bluetooth. Buang sambungan Radio jika MakeCode melaporkan konflik.', step3:'Tukar kepada JavaScript, gantikan kod dengan program di bawah, kemudian kembali ke Blocks untuk melihat dan mengedit blok yang dijana.', step4:'Muat turun program ke micro:bit melalui USB, kemudian gunakan bateri untuk membekalkan kuasa kepada pengawal.', copy:'Salin kod', programNote:'Semasa mula, program menghidupkan Bluetooth UART dan memaparkan muka senyum. Dalam gelung forever, program membaca dua paksi dan empat butang, menghantar satu baris nilai dan berhenti 50 ms—kira-kira 20 kemas kini sesaat. Program menganggap butang aktif-rendah (0 apabila ditekan); sahkan pada papan anda.', connect:'Sambung ke PC', connectBody:'Padankan menggunakan prosedur Bluetooth micro:bit yang sesuai dengan tetapan Bluetooth MakeCode anda. Penerima PC berasingan perlu menyambung ke perkhidmatan Bluetooth UART, melanggan pemberitahuan dan menyatukan mesej lengkap yang dipisahkan baris baharu sebelum mentafsirkannya.', sample:'Contoh: kayu bedik hampir di tengah dan empat butang dilepaskan. Nilai tengah sebenar mungkin berbeza.', calibrate:'Periksa setiap paksi dan butang. Kalibrasikan pusat dan arah serta gunakan zon mati supaya perubahan kecil tidak menggerakkan pemain. Lepaskan semua kawalan yang dipegang jika penerima terputus.', btDocs:'Dokumentasi Bluetooth MakeCode ↗', receiver:'Pilih penerima PC', keyboard:'Emulator papan kekunci', keyboardBody:'Petakan kayu bedik kepada WASD atau kekunci anak panah dan butang kepada Space, Enter atau kekunci lain. Ini biasanya projek pertama yang lebih mudah.', virtual:'Pad permainan maya', virtualBody:'Petakan nilai kepada pengawal Xbox maya atau pengawal standard untuk permainan yang memerlukan input pad. Ini memerlukan perisian tambahan khusus sistem operasi.', receiverNote:'Penerima ialah aplikasi berasingan untuk Windows, macOS atau Linux; pelajaran ini tidak memasangnya. Pilih sistem operasi dan mod input sebelum membinanya.', finish:'Selesai pelajaran?', finishBody:'Simpan kemajuan selepas meneroka program dan langkah sambungan.', complete:'Tanda pelajaran selesai', reopen:'Buka semula pelajaran', saved:'Kemajuan disimpan.', error:'Tidak dapat memuat atau menyimpan kemajuan. Sila segar semula dan cuba lagi.', copied:'Kod disalin.', copyError:'Tidak dapat menyalin kod; sila pilih dan salin secara manual.'
  }
};
const defaults = Object.fromEntries([...document.querySelectorAll('[data-copy]')].map(el => [el.dataset.copy, el.textContent]));
Object.assign(defaults, { reopen:'Reopen lesson', saved:'Progress saved.', error:'Unable to load or save progress. Please refresh and try again.', copied:'Code copied.', copyError:'Unable to copy code; select and copy it manually.' });
let locale = translations[localStorage.getItem('godot-forge-locale')] ? localStorage.getItem('godot-forge-locale') : 'en';
let moduleData = null;
const completion = document.querySelector('#complete');
const status = document.querySelector('#status');
let statusKey = '';
const learnerKey = 'godot-forge-learner-id';
let learnerId = localStorage.getItem(learnerKey);
if (!learnerId) { learnerId = crypto.randomUUID().replace(/-/g, ''); localStorage.setItem(learnerKey, learnerId); }
function t(key) { return translations[locale][key] || defaults[key] || ''; }
function render() {
  document.documentElement.lang = locale === 'zh' ? 'zh-Hans' : locale;
  document.querySelectorAll('[data-copy]').forEach(el => { el.textContent = t(el.dataset.copy); });
  document.querySelectorAll('[data-locale]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.locale === locale)));
  completion.textContent = t(moduleData?.completed ? 'reopen' : 'complete');
  status.textContent = statusKey ? t(statusKey) : '';
}
document.querySelector('.languages').addEventListener('click', event => {
  const selected = event.target.closest('[data-locale]')?.dataset.locale;
  if (!translations[selected]) return;
  locale = selected; localStorage.setItem('godot-forge-locale', locale); render();
});
document.querySelector('#copy-code').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(document.querySelector('#program-code').textContent); statusKey = 'copied'; }
  catch { statusKey = 'copyError'; }
  render();
});
completion.addEventListener('click', async () => {
  if (!moduleData) return;
  completion.disabled = true;
  try {
    const response = await fetch('/api/modules/microbit-gamepad/progress', { method:'PATCH', headers:{'content-type':'application/json'}, body:JSON.stringify({learnerId, completed:!moduleData.completed}) });
    if (!response.ok) throw new Error('Save failed');
    moduleData.completed = (await response.json()).completed; statusKey = 'saved';
  } catch { statusKey = 'error'; }
  completion.disabled = false; render();
});
render();
(async () => {
  try {
    const response = await fetch(`/api/modules?learnerId=${encodeURIComponent(learnerId)}`);
    if (!response.ok) throw new Error('Load failed');
    moduleData = (await response.json()).find(module => module.slug === 'microbit-gamepad');
    if (!moduleData) throw new Error('Module missing');
    completion.disabled = false;
  } catch { statusKey = 'error'; }
  render();
})();
