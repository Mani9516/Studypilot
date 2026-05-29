/**
 * Chapter syllabus labels + topic-matched YouTube (nocookie) embeds.
 * Classes 1–5: `syllabusClass15.js` + YouTube search topics
 * Classes 6–12: `syllabusClass612.js` + YouTube search topics
 */
import { getClass612ChapterTitle } from './syllabusClass612'
import { getClass15ChapterTitle } from './syllabusClass15'
import {
  resolveClass15VideoId,
  getClass15YouTubeSearchUrl,
} from './topicVideoClass15'
import {
  resolveClass612VideoId,
  getClass612YouTubeSearchUrl,
} from './topicVideoClass612'

const UNITS_FALLBACK = {
  Hindi: [
    'अक्षर, मात्रा और शब्द पहचान (Letters, matras & word sense)',
    'पठन अभ्यास व वाक्य रचना (Reading practice & simple sentences)',
    'कविता व गद्य — भाव और प्रश्न (Poetry & prose — theme & questions)',
    'व्याकरण: संज्ञा, सर्वनाम, क्रिया (Grammar: noun, pronoun, verb)',
    'अनुच्छेद लेखन व संवाद (Paragraph writing & dialogue)',
    'पाठ आधारित प्रश्न व शब्दार्थ (Text-based questions & vocabulary)',
    'मुहावरे, लोकोक्तियाँ व सारांश (Idioms, proverbs & summary)',
    'पुनरावृत्ति व परीक्षा तैयारी (Revision & exam readiness)',
  ],
  English: [
    'Phonics, blends & sight words',
    'Reading strategies: predict, clarify, summarise',
    'Grammar: tense agreement & sentence patterns',
    'Writing craft: hooks, details, and conclusions',
    'Comprehension: inference & evidence from text',
    'Vocabulary in context & word roots',
    'Listening & speaking: clear expression',
    'Integrated revision: read–write–speak loop',
  ],
  Mathematics: [
    'Number sense, place value & operations',
    'Fractions, decimals & comparisons',
    'Patterns, expressions & simple equations',
    'Measurement, perimeter & area basics',
    'Data handling: tables, charts & averages',
    'Geometry: shapes, angles & constructions',
    'Ratio, proportion & everyday modelling',
    'Mixed problem solving & review',
  ],
  Science: [
    'Observation, sorting & scientific method',
    'Living things: habitat, adaptation & food chains',
    'Matter: states, mixtures & simple changes',
    'Motion, force & energy in daily life',
    'Earth, sky & weather patterns',
    'Light, sound & circuits (intro)',
    'Health, hygiene & environment links',
    'Investigations & revision lab',
  ],
  'Social Science': [
    'Self, family & neighbourhood',
    'Maps, directions & local geography',
    'Time lines & change in communities',
    'Governance: rules, rights & responsibilities',
    'Livelihoods & economic ideas (intro)',
    'History: sources & continuity',
    'India & the world: connections',
    'Civics, economics & geography integration',
  ],
  AI: [
    'What is computing? Inputs, outputs & safety',
    'Patterns, sorting & simple decisions',
    'Data representation & privacy basics',
    'Logic: conditions, loops unplugged',
    'Responsible tech & digital citizenship',
    'Mini projects: plan–test–reflect',
    'AI in daily life: benefits & limits',
    'Showcase & portfolio review',
  ],
  Physics: [
    'Units, measurement & estimation',
    'Motion in one dimension',
    'Forces, Newton’s laws & free-body sketches',
    'Work, energy & power',
    'Waves & sound basics',
    'Light & optics intro',
    'Electricity & simple circuits',
    'Mixed numerical practice',
  ],
  Chemistry: [
    'Matter, classification & lab safety',
    'Atomic structure & periodic trends',
    'Chemical bonding & nomenclature',
    'Reactions, equations & stoichiometry intro',
    'Acids, bases & salts',
    'Organic families (intro)',
    'Practical skills & observation',
    'Revision drills',
  ],
  Biology: [
    'Living world: cell theory & microscopy',
    'Plant & animal tissues',
    'Life processes: nutrition & transport',
    'Control & coordination',
    'Reproduction & heredity basics',
    'Environment & ecosystems',
    'Health & disease awareness',
    'Revision & diagram practice',
  ],
}

function unitsFor(subject) {
  return UNITS_FALLBACK[subject] ?? UNITS_FALLBACK.Mathematics
}

function trackLabel(classLevel) {
  const c = Number(classLevel) || 10
  if (c >= 1 && c <= 5) return `Class ${c} — 8 chapters (Hindi, English, Maths, Science)`
  if (c >= 6 && c <= 12) return `Class ${c} — 8 core chapters (syllabus-aligned)`
  return 'Syllabus-aligned chapters'
}

function pickVideoId(classLevel, subject, chapter) {
  const c = Number(classLevel) || 10
  const ch = Number(chapter) || 1
  const key = `${c}|${subject}|${ch}`

  if (c >= 1 && c <= 5) {
    return resolveClass15VideoId(c, subject, ch)
  }

  if (c >= 6 && c <= 12) {
    return resolveClass612VideoId(c, subject, ch)
  }

  return null
}

/**
 * @param {number|string} classLevel
 * @param {string} subject
 * @param {number|string} chapter 1–8
 */
export function getChapterSyllabus(classLevel, subject, chapter) {
  const ch = Math.min(Math.max(Number(chapter) || 1, 1), 8)
  const idx = ch - 1
  const c = Number(classLevel) || 10

  const title612 = getClass612ChapterTitle(c, subject, ch)
  const title15 = getClass15ChapterTitle(c, subject, ch)
  const fallbackTitle = unitsFor(subject)[idx] ?? `Chapter ${ch} core topics`
  const unit = title612 ?? title15 ?? fallbackTitle

  const searchUrl =
    c >= 1 && c <= 5
      ? getClass15YouTubeSearchUrl(c, subject, ch)
      : c >= 6 && c <= 12
        ? getClass612YouTubeSearchUrl(c, subject, ch)
        : null
  const videoId = pickVideoId(c, subject, ch)

  return {
    chapter: ch,
    unit,
    track: trackLabel(c),
    videoId: videoId ?? null,
    searchUrl,
    embedUrl: videoId
      ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`
      : null,
  }
}
