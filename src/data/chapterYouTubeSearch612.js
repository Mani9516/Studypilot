/**
 * YouTube search queries per Class 6–12 chapter.
 * User-provided links take priority; other chapters use Class+subject+topic pattern.
 */
import { CHAPTER_TITLES_612 } from './syllabusClass612.js'

/** Exact search_query from syllabus YouTube links */
const USER_SEARCH_612 = {
  '6|Hindi|1': 'Class+6+Hindi+Vasant+Parichay',
  '6|Hindi|2': 'Class+6+Hindi+Grammar+Basics',
  '6|Hindi|3': 'Class+6+Hindi+Kahani+Lekhan',
  '6|Hindi|4': 'Class+6+Hindi+Patra+Lekhan',
  '6|Hindi|5': 'Class+6+Hindi+Kavita',
  '6|Hindi|6': 'Class+6+Hindi+Paryayvachi+Shabd',
  '6|Hindi|7': 'Class+6+Hindi+Muhavare+Lokoktiyan',
  '6|Hindi|8': 'Class+6+Hindi+Apathit+Gadyansh',
  '6|English|1': 'Class+6+English+Grammar+Basics',
  '6|English|2': 'Class+6+English+Reading+Comprehension',
  '6|English|3': 'Class+6+English+Tenses',
  '6|English|4': 'Class+6+English+Paragraph+Writing',
  '6|English|5': 'Class+6+English+Vocabulary',
  '6|English|6': 'Class+6+English+Story+Writing',
  '6|English|7': 'Class+6+English+Pronouns+Adjectives',
  '6|English|8': 'Class+6+English+Letter+Writing',
  '6|Mathematics|1': 'Class+6+Knowing+Our+Numbers',
  '6|Mathematics|2': 'Class+6+Whole+Numbers',
  '6|Mathematics|3': 'Class+6+Fractions',
  '6|Mathematics|4': 'Class+6+Decimals',
  '6|Mathematics|5': 'Class+6+Basic+Geometry',
  '6|Mathematics|6': 'Class+6+Integers',
  '6|Mathematics|7': 'Class+6+Ratio+and+Proportion',
  '6|Mathematics|8': 'Class+6+Data+Handling',

  '7|Hindi|1': 'Class+7+Hindi+Gadya+Padya',
  '7|Hindi|2': 'Class+7+Hindi+Sangya+Sarvanam',
  '7|Hindi|3': 'Class+7+Hindi+Samvad+Lekhan',
  '7|Hindi|4': 'Class+7+Hindi+Anuchhed+Lekhan',
  '7|Hindi|5': 'Class+7+Hindi+Kahani+Kavita',
  '7|Hindi|6': 'Class+7+Hindi+Muhavare',
  '7|Hindi|7': 'Class+7+Hindi+Apathit+Gadyansh',
  '7|Hindi|8': 'Class+7+Hindi+Patra+Lekhan',
  '7|Mathematics|1': 'Class+7+Integers',
  '7|Mathematics|2': 'Class+7+Fractions+and+Decimals',
  '7|Mathematics|3': 'Class+7+Algebra+Basics',
  '7|Mathematics|4': 'Class+7+Simple+Equations',
  '7|Mathematics|5': 'Class+7+Lines+and+Angles',
  '7|Mathematics|6': 'Class+7+Perimeter+and+Area',
  '7|Mathematics|7': 'Class+7+Ratio+and+Proportion',
  '7|Mathematics|8': 'Class+7+Data+Handling',

  '8|Science|1': 'Class+8+Crop+Production',
  '8|Science|2': 'Class+8+Microorganisms',
  '8|Science|3': 'Class+8+Coal+and+Petroleum',
  '8|Science|4': 'Class+8+Combustion+and+Flame',
  '8|Science|5': 'Class+8+Cell+Structure',
  '8|Science|6': 'Class+8+Force+and+Pressure',
  '8|Science|7': 'Class+8+Sound',
  '8|Science|8': 'Class+8+Light',

  '9|Mathematics|1': 'Class+9+Number+Systems',
  '9|Mathematics|2': 'Class+9+Polynomials',
  '9|Mathematics|3': 'Class+9+Coordinate+Geometry',
  '9|Mathematics|4': 'Class+9+Linear+Equations',
  '9|Mathematics|5': 'Class+9+Euclid+Geometry',
  '9|Mathematics|6': 'Class+9+Mensuration',
  '9|Mathematics|7': 'Class+9+Statistics',
  '9|Mathematics|8': 'Class+9+Probability',

  '10|Science|1': 'Class+10+Chemical+Reactions',
  '10|Science|2': 'Class+10+Acids+and+Bases',
  '10|Science|3': 'Class+10+Life+Processes',
  '10|Science|4': 'Class+10+Control+and+Coordination',
  '10|Science|5': 'Class+10+Electricity',
  '10|Science|6': 'Class+10+Magnetic+Effects+of+Current',
  '10|Science|7': 'Class+10+Sources+of+Energy',
  '10|Science|8': 'Class+10+Environment+and+Sustainability',

  '11|AI|1': 'Class+11+AI+Introduction+to+Data+Science',
  '11|AI|2': 'Class+11+AI+Python+Programming',
  '11|AI|3': 'Class+11+AI+Machine+Learning',
  '11|AI|4': 'Class+11+AI+Deep+Learning+Basics',
  '11|AI|5': 'Class+11+AI+Algorithms',
  '11|AI|6': 'Class+11+AI+NLP',
  '11|AI|7': 'Class+11+AI+Computer+Vision',
  '11|AI|8': 'Class+11+AI+Ethics+and+Governance',

  '12|Mathematics|1': 'Class+12+Relations+and+Functions',
  '12|Mathematics|2': 'Class+12+Calculus',
  '12|Mathematics|3': 'Class+12+Matrices',
  '12|Mathematics|4': 'Class+12+Determinants',
  '12|Mathematics|5': 'Class+12+Probability',
  '12|Mathematics|6': 'Class+12+Linear+Programming',
  '12|Mathematics|7': 'Class+12+Vectors',
  '12|Mathematics|8': 'Class+12+Three+Dimensional+Geometry',
  '12|AI|1': 'Class+12+Advanced+Machine+Learning',
  '12|AI|2': 'Class+12+Neural+Networks',
  '12|AI|3': 'Class+12+Deep+Learning',
  '12|AI|4': 'Class+12+Natural+Language+Processing',
  '12|AI|5': 'Class+12+Computer+Vision',
  '12|AI|6': 'Class+12+Generative+AI',
  '12|AI|7': 'Class+12+AI+Deployment',
  '12|AI|8': 'Class+12+Responsible+AI',
}

function subjectSlug(subject) {
  if (subject === 'Social Science') return 'Social+Science'
  return subject.replace(/\s/g, '+')
}

function titleSlug(title) {
  return title
    .replace(/[–—]/g, ' ')
    .replace(/\s+/g, '+')
    .replace(/[^A-Za-z0-9+\u0900-\u097F]/g, '')
}

function defaultQuery(classLevel, subject, title) {
  const sub = subjectSlug(subject)
  const topic = titleSlug(title)
  if (subject === 'AI') {
    return `Class+${classLevel}+AI+${topic}`
  }
  return `Class+${classLevel}+${sub}+${topic}`
}

function buildSearchMap() {
  /** @type {Record<string, string>} */
  const map = {}
  for (const c of [6, 7, 8, 9, 10, 11, 12]) {
    const byClass = CHAPTER_TITLES_612[c]
    for (const subject of Object.keys(byClass)) {
      byClass[subject].forEach((title, i) => {
        const ch = i + 1
        const key = `${c}|${subject}|${ch}`
        map[key] = USER_SEARCH_612[key] ?? defaultQuery(c, subject, title)
      })
    }
  }
  return map
}

export const CHAPTER_YOUTUBE_SEARCH_612 = buildSearchMap()

/** @param {string} key e.g. `6|Mathematics|3` */
export function getChapterSearchQuery612(key) {
  return CHAPTER_YOUTUBE_SEARCH_612[key] ?? null
}
