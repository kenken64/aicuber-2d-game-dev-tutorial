import PDFDocument from 'pdfkit';
import * as fontkit from 'fontkit';
import { fileURLToPath } from 'node:url';

const fontPath = fileURLToPath(new URL('./fonts/NotoSansSC-certificate.ttf', import.meta.url));
const logoPath = fileURLToPath(new URL('./branding/aicuber-logo.png', import.meta.url));
const nameFonts = [fontPath, ...['tamil', 'devanagari'].map(script => fileURLToPath(new URL(`./fonts/NotoSans-${script}.ttf`, import.meta.url)))].map(path => ({ path, font: fontkit.openSync(path) }));
const nameFont = name => nameFonts.find(({ font }) => [...name].every(char => /\s/u.test(char) || font.hasGlyphForCodePoint(char.codePointAt(0))));
const copy = {
  en: { label: 'GODOT FORGE  /  2D GAME DEVELOPMENT', title: 'Certificate of Completion', presented: 'THIS CERTIFICATE IS PRESENTED TO', body: 'For completing the Godot Forge 2D Game Development learning path, from first character to final game.', issued: 'DATE ISSUED', footer: 'LEARN  ·  BUILD  ·  PLAY', locale: 'en-GB' },
  zh: { label: 'GODOT FORGE  /  2D 游戏开发', title: '课程完成证书', presented: '谨以此证书颁发给', body: '已完成 Godot Forge 2D 游戏开发学习路径，从创建第一个角色到完成最终游戏。', issued: '颁发日期', footer: '学习  ·  创作  ·  游戏', locale: 'zh-CN' },
  ms: { label: 'GODOT FORGE  /  PEMBANGUNAN PERMAINAN 2D', title: 'Sijil Penyempurnaan', presented: 'SIJIL INI DISAMPAIKAN KEPADA', body: 'Kerana melengkapkan laluan pembelajaran Pembangunan Permainan 2D Godot Forge, daripada watak pertama hingga permainan akhir.', issued: 'TARIKH DIKELUARKAN', footer: 'BELAJAR  ·  BINA  ·  BERMAIN', locale: 'ms-MY' },
};

export function validateCertificateName(value) {
  if (typeof value !== 'string') return { error: 'name' };
  const name = value.trim().normalize('NFC');
  if (!name || [...name].length > 80 || /[\p{Cc}\p{Cf}\p{Cs}\p{Zl}\p{Zp}]/u.test(name)) return { error: 'name' };
  if (!nameFont(name)) return { error: 'unsupported' };
  return { name };
}

export function makeCertificatePdf(name, locale = 'en', issuedAt = new Date(), timeZone = 'UTC') {
  const text = copy[locale] || copy.en;
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 0, info: { Title: text.title, Author: 'Godot Forge', Subject: '2D Game Development' } });
    const chunks = [];
    doc.on('data', data => chunks.push(data));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    try {
      const width = doc.page.width, height = doc.page.height;
      const center = (str, y, size, color = '#263c30') => doc.fillColor(color).fontSize(size).text(str, 75, y, { width: width - 150, align: 'center', lineBreak: false });
      doc.font(fontPath);
      doc.rect(0, 0, width, height).fill('#f8f8f1');
      doc.lineWidth(1.5).strokeColor('#345846').rect(24, 24, width - 48, height - 48).stroke();
      doc.lineWidth(.5).strokeColor('#adbd8d').rect(31, 31, width - 62, height - 62).stroke();
      doc.save().fillColor('#e4ead4').circle(53, 53, 6).fill().circle(width - 53, 53, 6).fill().circle(53, height - 53, 6).fill().circle(width - 53, height - 53, 6).fill().restore();
      doc.image(logoPath, width / 2 - 90, 42, { fit: [180, 60], align: 'center', valign: 'center' });
      center(text.label, 105, 9, '#567b59');
      center(text.title, 132, 34, '#183a2a');
      doc.moveTo(width / 2 - 68, 184).lineTo(width / 2 + 68, 184).lineWidth(1.2).strokeColor('#adc76c').stroke();
      center(text.presented, 207, 10, '#728679');
      doc.font(nameFont(name)?.path || fontPath);
      let nameSize = 38;
      const nameWidth = width - 170;
      while (nameSize > 18 && doc.fontSize(nameSize).heightOfString(name, { width: nameWidth, align: 'center', lineGap: 1 }) > 78) nameSize -= 1;
      doc.fontSize(nameSize);
      const nameHeight = doc.heightOfString(name, { width: nameWidth, align: 'center', lineGap: 1 });
      doc.fillColor('#172d21').text(name, 85, 246 + Math.max(0, (78 - nameHeight) / 2), { width: nameWidth, align: 'center', lineGap: 1 });
      doc.font(fontPath);
      doc.moveTo(172, 335).lineTo(width - 172, 335).lineWidth(.7).strokeColor('#b8c7b3').stroke();
      doc.fillColor('#4b5d50').fontSize(12).text(text.body, 144, 355, { width: width - 288, align: 'center', lineGap: 4 });
      let date;
      try { date = new Intl.DateTimeFormat(text.locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone }).format(issuedAt); }
      catch { date = new Intl.DateTimeFormat(text.locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(issuedAt); }
      center(text.issued, 442, 9, '#728679');
      center(date, 461, 12, '#264734');
      center(text.footer, 525, 9, '#66845e');
      doc.end();
    } catch (error) { reject(error); }
  });
}
