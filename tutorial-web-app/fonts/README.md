# Quiz PDF font

`NotoSansSC-quiz.ttf` is a static 400-weight subset of [Noto Sans SC](https://github.com/google/fonts/tree/main/ofl/notosanssc), used so PDF answers can include English, Simplified Chinese, Malay and mathematical notation in a small deployment. Its SIL Open Font License is in `OFL-NotoSansSC.txt`.

`NotoSansSC-certificate.ttf` is the complete static 400-weight font from the same source. Certificates use the full font so student names are not limited to characters that happen to occur in the quiz.

`NotoSans-tamil.ttf` and `NotoSans-devanagari.ttf` are static 400-weight fonts from Google Fonts, used for student names in those scripts. Their corresponding `OFL-NotoSans-*.txt` files contain their licenses. The certificate checks glyph coverage and rejects unsupported combinations rather than printing a name incorrectly.

When changing quiz questions, translations, PDF labels or detailed explanations, rebuild the font subset from the upstream variable TrueType font and the contents of `quiz-question-bank.mjs`, `quiz-question-translations.mjs`, `quiz-answer-details.mjs`, `quiz-answer-pdf.mjs` and `math-stem-physics-quiz/app.js`. Instantiate the `wght=400` axis with fontTools, then use `pyftsubset` with those files as the text corpus and include Basic Latin, Latin-1, punctuation, arrows and mathematical symbols. Verify all three generated PDFs after updating it. The PDF renderer replaces the unsupported subscript zero with `0`.
