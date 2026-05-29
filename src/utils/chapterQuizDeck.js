/**
 * Build exactly 8 unique questions for one chapter quiz.
 */
import { getChapterSyllabus } from '../data/syllabusVideos'
import { buildTopicQuestion, normalizeQuizItem } from '../data/topicQuizContent'
import {
  buildEnglishSlotQuestion,
  buildHindiSlotQuestion,
} from '../data/chapterQuizSlots'
import {
  createQuizSessionSeed,
  questionSignature,
  shuffledIndices,
} from './quizSession'
const QUIZ_QUESTION_COUNT = 8

/** @param {number} classLevel */
function getInitialAdaptiveLevel(classLevel) {
  const c = Number(classLevel) || 6
  if (c <= 4) return 2
  if (c <= 8) return 3
  return 3
}

const LEVEL_LABELS = {
  1: 'Easy',
  2: 'Moderate',
  3: 'Standard',
  4: 'Challenging',
  5: 'Expert',
}

function levelLabel(level) {
  return LEVEL_LABELS[level] ?? `Level ${level}`
}

function toQuizCard({
  prompt,
  options,
  correctIndex,
  level,
  classLevel,
  subject,
  chapter,
  slot,
  variant,
}) {
  return {
    id: `${classLevel}|${subject}|${chapter}|s${slot}|v${variant}|${questionSignature(prompt).slice(0, 48)}`,
    difficulty: levelLabel(level),
    level,
    prompt,
    options,
    correctIndex,
    slot,
  }
}

function tryCurated(topic, subject, level, slot, attempt) {
  const variant = slot * 53 + attempt * 7
  const raw = buildTopicQuestion(topic, subject, level, variant, slot)
  return normalizeQuizItem(raw, topic, subject)
}

/**
 * @param {number} classLevel
 * @param {string} subject
 * @param {number} chapterNumber 1–8
 * @param {number} [sessionSeed]
 */
export function buildChapterQuizDeck(
  classLevel,
  subject,
  chapterNumber,
  sessionSeed = createQuizSessionSeed(),
) {
  const syllabus = getChapterSyllabus(classLevel, subject, chapterNumber)
  const topic = syllabus.unit
  const baseLevel = getInitialAdaptiveLevel(classLevel)
  const seen = new Set()
  const deck = []

  const levelOrder = shuffledIndices(QUIZ_QUESTION_COUNT, sessionSeed, 90210).map(
    (i) => Math.min(5, Math.max(1, baseLevel + (i % 3) - 1)),
  )

  for (let slot = 0; slot < QUIZ_QUESTION_COUNT; slot += 1) {
    const level = levelOrder[slot]
    let picked = null

    for (let attempt = 0; attempt < 48; attempt += 1) {
      const item = tryCurated(topic, subject, level, slot, attempt)
      const sig = questionSignature(item.prompt)
      if (!seen.has(sig)) {
        seen.add(sig)
        picked = toQuizCard({
          ...item,
          level,
          classLevel,
          subject,
          chapter: chapterNumber,
          slot,
          variant: slot * 53 + attempt * 7,
        })
        break
      }
    }

    if (!picked) {
      const raw =
        subject === 'Hindi'
          ? buildHindiSlotQuestion(topic, slot)
          : buildEnglishSlotQuestion(topic, subject, slot)
      const item = normalizeQuizItem(raw, topic, subject)
      const sig = questionSignature(item.prompt)
      if (!seen.has(sig)) {
        seen.add(sig)
        picked = toQuizCard({
          ...item,
          level,
          classLevel,
          subject,
          chapter: chapterNumber,
          slot,
          variant: slot,
        })
      }
    }

    if (picked) deck.push(picked)
  }

  while (deck.length < QUIZ_QUESTION_COUNT) {
    const slot = deck.length
    const raw =
      subject === 'Hindi'
        ? buildHindiSlotQuestion(topic, slot)
        : buildEnglishSlotQuestion(topic, subject, slot)
    const item = normalizeQuizItem(raw, topic, subject)
    let prompt = item.prompt
    let guard = 0
    while (seen.has(questionSignature(prompt)) && guard < 8) {
      prompt = `${item.prompt} (${slot + 1})`
      guard += 1
    }
    seen.add(questionSignature(prompt))
    deck.push(
      toQuizCard({
        ...item,
        prompt,
        level: levelOrder[slot] ?? baseLevel,
        classLevel,
        subject,
        chapter: chapterNumber,
        slot,
        variant: slot + 900,
      }),
    )
  }

  const order = shuffledIndices(deck.length, sessionSeed, chapterNumber * 131)
  return order.map((i) => deck[i])
}
