/**
 * Display copy for video + chapters from class + subject (demo templates).
 */
import { getClass15ChapterTitle } from '../data/syllabusClass15'
import { getClass612ChapterTitle } from '../data/syllabusClass612'

const SUBJECT_FOCUS = {
  Hindi: 'listening, reading, and writing with accuracy',
  English: 'close reading, craft, and clear expression',
  Mathematics: 'problem-solving routines and visual models',
  Science: 'hands-on inquiry and evidence-based explanations',
  'Social Science': 'maps, timelines, and civic reasoning',
  AI: 'patterns, data sense, and responsible use of tools',
  Physics: 'laws, diagrams, and real-world applications',
  Chemistry: 'particles, reactions, and lab-safe reasoning',
  Biology: 'structures, cycles, and evidence-based claims',
}

const CH1 = {
  Hindi: 'sounds, matras, and short poems or dialogues',
  English: 'how writers hook readers and how we annotate a passage',
  Mathematics: 'number lines, place value, and short word problems',
  Science: 'observing patterns in living and non-living things',
  'Social Science': 'maps, directions, and community roles',
  AI: 'what computers can (and cannot) do responsibly',
  Physics: 'units, measurement, and describing motion in words',
  Chemistry: 'matter, mixtures, and safe observation habits',
  Biology: 'living vs non-living and how we organize life science topics',
}

const VIDEO_LINE = {
  Hindi: 'Guided reading aloud, short writing frames, and quick checks.',
  English: 'Model sentences, tone shifts, and quick revision tactics.',
  Mathematics: 'Worked examples with step-by-step reasoning checkpoints.',
  Science: 'Mini investigations with predict–observe–explain prompts.',
  'Social Science': 'Sources, timelines, and “why here?” map prompts.',
  AI: 'Tracing inputs/outputs and testing simple prediction ideas.',
  Physics: 'Mini demos: sketches, arrows, and "what stays the same?" prompts.',
  Chemistry: 'Symbol → particle story → quick check-your-understanding.',
  Biology: 'Label–predict–explain loops with simple diagrams.',
}

export function getSubjectFocus(subject) {
  return SUBJECT_FOCUS[subject] ?? SUBJECT_FOCUS.Mathematics
}

export function getChapter1Blurb(classLevel, subject) {
  const line = CH1[subject] ?? CH1.Mathematics
  return `Class ${classLevel} ${subject} opens with ${line}.`
}

export function getChapter2Summary(classLevel, subject) {
  return `${VIDEO_LINE[subject] ?? VIDEO_LINE.Mathematics} Tailored for Class ${classLevel}.`
}

export function getVideoBadge(subject) {
  return `${subject} · Guided`
}

export function getChapterNBlurb(classLevel, subject, chapterNum) {
  if (chapterNum <= 2) return ''
  const c = Number(classLevel)
  const title =
    getClass15ChapterTitle(c, subject, chapterNum) ??
    getClass612ChapterTitle(c, subject, chapterNum)
  if (title) {
    return `Chapter ${chapterNum}: ${title} — topic lesson, practice, and quick checks.`
  }
  return `Chapter ${chapterNum} builds fluency for Class ${classLevel} ${subject} with mixed practice and checks.`
}

export function videoFrameClass(subject) {
  const k = (subject || 'Mathematics').replace(/\s/g, '')
  const map = {
    Hindi: 'Mathematics',
    English: 'English',
    Mathematics: 'Mathematics',
    Science: 'Chemistry',
    SocialScience: 'Physics',
    AI: 'Biology',
    Physics: 'Physics',
    Chemistry: 'Chemistry',
    Biology: 'Biology',
  }
  const theme = map[k] ?? 'Mathematics'
  return `video-frame--${theme}`
}
