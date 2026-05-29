/**
 * Verify every class/subject/chapter quiz has 8 unique question prompts.
 */
import { buildChapterQuizDeck } from '../src/utils/chapterQuizDeck.js'
import { questionSignature } from '../src/utils/quizSession.js'
import { getSubjectsForClass } from '../src/utils/curriculum.js'

let failures = 0
for (let c = 1; c <= 12; c += 1) {
  const subjects = getSubjectsForClass(c)
  for (const subject of subjects) {
    for (let ch = 1; ch <= 8; ch += 1) {
      const deck = buildChapterQuizDeck(c, subject, ch, 12345 + c * 100 + ch)
      const sigs = deck.map((q) => questionSignature(q.prompt))
      const unique = new Set(sigs)
      if (deck.length !== 8 || unique.size !== 8) {
        failures += 1
        console.error(
          `FAIL Class ${c} ${subject} Ch.${ch}: ${deck.length} questions, ${unique.size} unique`,
        )
      }
    }
  }
}
if (failures === 0) {
  console.log('OK: all chapter quizzes have 8 unique questions')
} else {
  console.error(`${failures} chapter(s) failed`)
  process.exit(1)
}
