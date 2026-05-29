/**
 * Class 1–5 lesson videos from syllabus YouTube search topics.
 * IDs are resolved from `chapterYouTubeSearch15.js` → `generatedClass15SearchVideos.js`.
 */
import { CLASS_15_SEARCH_VIDEO_IDS } from './generatedClass15SearchVideos.js'
import { getChapterSearchQuery } from './chapterYouTubeSearch15'
import { youtubeSearchUrl } from './youtubeSearchUtils'

/**
 * @param {number} classLevel 1–5
 * @param {string} subject
 * @param {number} chapter 1–8
 */
export function resolveClass15VideoId(classLevel, subject, chapter) {
  const c = Number(classLevel)
  const ch = Number(chapter) || 1
  const key = `${c}|${subject}|${ch}`
  return CLASS_15_SEARCH_VIDEO_IDS[key] ?? null
}

/**
 * @param {number} classLevel
 * @param {string} subject
 * @param {number} chapter
 */
export function getClass15YouTubeSearchUrl(classLevel, subject, chapter) {
  const c = Number(classLevel)
  const ch = Number(chapter) || 1
  const query = getChapterSearchQuery(`${c}|${subject}|${ch}`)
  return query ? youtubeSearchUrl(query) : null
}
