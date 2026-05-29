/**
 * Class 6–12 lesson videos from syllabus YouTube search topics.
 */
import { CLASS_612_SEARCH_VIDEO_IDS } from './generatedClass612SearchVideos.js'
import { getChapterSearchQuery612 } from './chapterYouTubeSearch612'
import { youtubeSearchUrl } from './youtubeSearchUtils'

/**
 * @param {number} classLevel 6–12
 * @param {string} subject
 * @param {number} chapter 1–8
 */
export function resolveClass612VideoId(classLevel, subject, chapter) {
  const c = Number(classLevel)
  const ch = Number(chapter) || 1
  const key = `${c}|${subject}|${ch}`
  return CLASS_612_SEARCH_VIDEO_IDS[key] ?? null
}

export function getClass612YouTubeSearchUrl(classLevel, subject, chapter) {
  const c = Number(classLevel)
  const ch = Number(chapter) || 1
  const query = getChapterSearchQuery612(`${c}|${subject}|${ch}`)
  return query ? youtubeSearchUrl(query) : null
}
