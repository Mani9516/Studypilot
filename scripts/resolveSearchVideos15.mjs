/**
 * Resolves Class 1–5 search queries → YouTube video id (yt-dlp).
 * Run: node scripts/resolveSearchVideos15.mjs
 */
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { writeFileSync } from 'node:fs'
import { CHAPTER_YOUTUBE_SEARCH_15 } from '../src/data/chapterYouTubeSearch15.js'

const execFileAsync = promisify(execFile)

async function searchVideoId(query) {
  const searchTerm = query.replace(/\+/g, ' ')
  const { stdout } = await execFileAsync(
    'python',
    ['-m', 'yt_dlp', `ytsearch1:${searchTerm}`, '--get-id'],
    { timeout: 120000, windowsHide: true },
  )
  const id = stdout.trim().split('\n')[0]
  return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null
}

async function mapPool(entries, concurrency, fn) {
  const out = {}
  let i = 0
  async function worker() {
    while (i < entries.length) {
      const idx = i++
      const [key, query] = entries[idx]
      try {
        const id = await fn(query)
        if (id) {
          out[key] = id
          console.log(`OK ${key} -> ${id}`)
        } else {
          console.warn(`SKIP ${key}`)
        }
      } catch (e) {
        console.warn(`FAIL ${key}:`, e.message?.slice(0, 60))
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()))
  return out
}

const entries = Object.entries(CHAPTER_YOUTUBE_SEARCH_15)
const resolved = await mapPool(entries, 3, searchVideoId)

const lines = [
  '/** Auto-generated from YouTube search queries (Class 1–5 syllabus topics) */',
  'export const CLASS_15_SEARCH_VIDEO_IDS = {',
]
for (const [key, id] of Object.entries(resolved)) {
  lines.push(`  '${key}': '${id}',`)
}
lines.push('}')
writeFileSync('src/data/generatedClass15SearchVideos.js', lines.join('\n'))
console.log(`Done: ${Object.keys(resolved).length}/${entries.length} resolved`)
