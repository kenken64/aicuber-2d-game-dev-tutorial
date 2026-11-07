import PDFDocument from 'pdfkit';
import { fileURLToPath } from 'node:url';
import { detailedQuizExplanation } from './quiz-answer-details.mjs';

const fontPath = fileURLToPath(new URL('./fonts/NotoSansSC-quiz.ttf', import.meta.url));
const labels = {
  en: { title: 'Quiz answer sheet', subtitle: 'Math, STEM, physics and game history', answer: 'Correct answer', explanation: 'Explanation', source: 'Source', question: 'QUESTION', page: 'Page' },
  zh: { title: '测验答案及详细解析', subtitle: '数学、STEM、物理与游戏历史', answer: '正确答案', explanation: '解析', source: '资料来源', question: '第', page: '页' },
  ms: { title: 'Skema jawapan kuiz', subtitle: 'Matematik, STEM, fizik dan sejarah permainan', answer: 'Jawapan betul', explanation: 'Penerangan', source: 'Sumber', question: 'SOALAN', page: 'Halaman' },
};
// Noto Sans SC does not include this subscript; the equivalent plain digit
// keeps the initial-velocity formula readable instead of showing a blank glyph.
const display = value => String(value ?? '').replaceAll('₀', '0');

export function makeQuizAnswerPdf(questions, locale = 'en', passcode) {
  if (typeof passcode !== 'string' || !passcode) throw new Error('A passcode is required for the answer PDF.');
  const language = Object.hasOwn(labels, locale) ? locale : 'en';
  const text = labels[language];
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 48, bufferPages: true, pdfVersion: '1.7ext3', userPassword: passcode, permissions: { printing: 'highResolution', copying: true, contentAccessibility: true }, info: { Title: text.title, Author: 'Godot Forge', Subject: text.subtitle } });
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    try {
      doc.registerFont('quiz', fontPath).font('quiz');
      const width = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const bottom = () => doc.page.height - doc.page.margins.bottom - 24;
      doc.fillColor('#4b724f').fontSize(10).text('GODOT FORGE  /  KNOWLEDGE CHECK', { characterSpacing: .7 });
      doc.moveDown(.7).fillColor('#14251c').fontSize(24).text(text.title);
      doc.moveDown(.25).fillColor('#556a5e').fontSize(11).text(text.subtitle);
      doc.moveDown(1);
      let category = '';
      questions.forEach((item, index) => {
        const answer = `${text.answer}: ${String.fromCharCode(65 + item.correctOption)}. ${item.options[item.correctOption]}`;
        const explanation = `${text.explanation}: ${item.explanation} ${detailedQuizExplanation(item.id, language)}`;
        const heading = `${language === 'zh' ? `${text.question} ${index + 1} 题` : `${text.question} ${String(index + 1).padStart(2, '0')}`}  ${item.question}`;
        const isNewCategory = item.category !== category;
        const h = (value, size, textWidth = width) => { doc.fontSize(size); return doc.heightOfString(display(value), { width: textWidth, lineGap: 2 }); };
        const columnWidth = (width - 16) / 2;
        const choices = item.options.map((option, choiceIndex) => `${String.fromCharCode(65 + choiceIndex)}. ${option}`);
        const rowHeights = [0, 2].map(start => Math.max(h(choices[start], 9, columnWidth), h(choices[start + 1], 9, columnWidth)));
        const needed = (isNewCategory ? 44 : 0) + h(heading, 11) + rowHeights[0] + rowHeights[1] + h(answer, 10) + h(explanation, 10) + (item.sourceUrl ? h(`${text.source}: ${item.sourceUrl}`, 9) : 0) + 30;
        if (doc.y + needed > bottom()) doc.addPage();
        if (isNewCategory) {
          category = item.category;
          doc.moveDown(.6).fillColor('#567a48').fontSize(13).text(display(category));
          doc.moveDown(.35);
          doc.moveTo(doc.x, doc.y).lineTo(doc.x + width, doc.y).strokeColor('#cbd8ca').lineWidth(.6).stroke();
          doc.moveDown(.6);
        }
        doc.fillColor('#15271c').fontSize(11).text(display(heading), { width, lineGap: 2 });
        doc.moveDown(.25).fontSize(9).fillColor('#35443b');
        for (const [rowIndex, start] of [0, 2].entries()) {
          const y = doc.y;
          doc.text(display(choices[start]), doc.page.margins.left, y, { width: columnWidth, lineGap: 2 });
          doc.text(display(choices[start + 1]), doc.page.margins.left + columnWidth + 16, y, { width: columnWidth, lineGap: 2 });
          doc.x = doc.page.margins.left;
          doc.y = y + rowHeights[rowIndex] + 3;
        }
        doc.moveDown(.3).fillColor('#386949').fontSize(10).text(display(answer), { width, lineGap: 2 });
        doc.moveDown(.2).fillColor('#35443b').fontSize(10).text(display(explanation), { width, lineGap: 2 });
        if (item.sourceUrl) {
          doc.moveDown(.2).fillColor('#3b6177').fontSize(9).text(display(`${text.source}: ${item.sourceUrl}`), { width, lineGap: 2, link: item.sourceUrl, underline: true });
        }
        doc.moveDown(.65);
      });
      const range = doc.bufferedPageRange();
      for (let page = range.start; page < range.start + range.count; page++) {
        doc.switchToPage(page);
        const bottomMargin = doc.page.margins.bottom;
        doc.page.margins.bottom = 0;
        doc.fillColor('#738478').fontSize(9).text(`${text.page} ${page + 1} / ${range.count}`, 48, doc.page.height - 35, { width, align: 'right', lineBreak: false });
        doc.page.margins.bottom = bottomMargin;
      }
      doc.end();
    } catch (error) { reject(error); }
  });
}
