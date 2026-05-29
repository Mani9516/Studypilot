/**
 * Adaptive chapter quiz: 8 questions tied to syllabus/video topic.
 * All four options relate to the chapter topic.
 * Next question difficulty (levels 1–5) rises after correct, falls after wrong.
 */
import { getChapterSyllabus } from '../data/syllabusVideos'
import { buildTopicQuestion, normalizeQuizItem } from '../data/topicQuizContent'
import {
  createQuizSessionSeed,
  questionSignature,
  shuffledIndices,
} from './quizSession'

export { createQuizSessionSeed }

export const QUIZ_QUESTION_COUNT = 8
export const ADAPTIVE_LEVEL_MIN = 1
export const ADAPTIVE_LEVEL_MAX = 5

const LEVEL_LABELS = {
  1: 'Easy',
  2: 'Moderate',
  3: 'Standard',
  4: 'Challenging',
  5: 'Expert',
}

/** @param {number} classLevel */
export function getInitialAdaptiveLevel(classLevel) {
  const c = Number(classLevel) || 6
  if (c <= 4) return 2
  if (c <= 8) return 3
  return 3
}

/** @param {number} level @param {boolean} wasCorrect */
export function nextAdaptiveLevel(level, wasCorrect) {
  const n = Number(level) || 3
  if (wasCorrect) return Math.min(ADAPTIVE_LEVEL_MAX, n + 1)
  return Math.max(ADAPTIVE_LEVEL_MIN, n - 1)
}

function levelLabel(level) {
  return LEVEL_LABELS[level] ?? `Level ${level}`
}

function hashSeed(parts) {
  const str = parts.join('|')
  let h = 0
  for (let i = 0; i < str.length; i += 1) {
    h = (h * 31 + str.charCodeAt(i)) % 9973
  }
  return h
}

const VARIANT_POOL_SIZE = 64

function buildQuestion({ classLevel, subject, unit, chapter, level, variant }) {
  const c = Number(classLevel)
  const topic = unit || `Chapter ${chapter}`
  const raw = buildTopicQuestion(topic, subject, level, variant)
  const { prompt, options, correctIndex } = normalizeQuizItem(raw, topic, subject)

  return {
    id: `${c}|${subject}|${chapter}|L${level}|v${variant}|${questionSignature(prompt).slice(0, 40)}`,
    difficulty: levelLabel(level),
    level,
    prompt,
    options,
    correctIndex,
    syllabusUnit: topic,
  }
}

/**
 * Pick one unused question for the current adaptive level.
 * @param {object} ctx
 * @param {Set<string>} usedSignatures prompt dedupe within one quiz
 * @param {number} sessionSeed random per quiz attempt
 * @param {number} pickIndex 0-based index in this quiz (for shuffle salt)
 */
export function pickAdaptiveQuestion(ctx, usedSignatures, sessionSeed, pickIndex = 0) {
  const { classLevel, subject, chapterNumber, level } = ctx
  const syllabus = getChapterSyllabus(classLevel, subject, chapterNumber)
  const salt = hashSeed([classLevel, subject, chapterNumber, level, pickIndex])
  const order = shuffledIndices(VARIANT_POOL_SIZE, sessionSeed, salt)

  for (const variant of order) {
    const q = buildQuestion({
      classLevel,
      subject,
      unit: syllabus.unit,
      chapter: chapterNumber,
      level,
      variant,
    })
    const sig = questionSignature(q.prompt)
    if (!usedSignatures.has(sig)) {
      usedSignatures.add(sig)
      return q
    }
  }

  for (let extra = 0; extra < 32; extra += 1) {
    const variant = VARIANT_POOL_SIZE + pickIndex * 32 + extra + (sessionSeed % 97)
    const q = buildQuestion({
      classLevel,
      subject,
      unit: syllabus.unit,
      chapter: chapterNumber,
      level,
      variant,
    })
    const sig = questionSignature(q.prompt)
    if (!usedSignatures.has(sig)) {
      usedSignatures.add(sig)
      return q
    }
  }

  const fallback = buildQuestion({
    classLevel,
    subject,
    unit: syllabus.unit,
    chapter: chapterNumber,
    level,
    variant: sessionSeed + pickIndex * 1000,
  })
  usedSignatures.add(questionSignature(fallback.prompt))
  return fallback
}

/** @deprecated Use pickAdaptiveQuestion in AdaptiveQuiz */
export function generateAdaptiveQuizQuestions(
  classLevel,
  subject,
  chapterNumber = 2,
) {
  const used = new Set()
  const sessionSeed = createQuizSessionSeed()
  let level = getInitialAdaptiveLevel(classLevel)
  const out = []
  for (let i = 0; i < QUIZ_QUESTION_COUNT; i += 1) {
    const q = pickAdaptiveQuestion(
      { classLevel, subject, chapterNumber, level },
      used,
      sessionSeed,
      i,
    )
    out.push(q)
    level = nextAdaptiveLevel(level, i % 2 === 0)
  }
  return out
}
