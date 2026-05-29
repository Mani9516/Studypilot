/**
 * Resolves Class 6–12 search queries → YouTube video id (yt-dlp).
 * Run: node scripts/resolveSearchVideos612.mjs
 */
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { writeFileSync, readFileSync } from 'node:fs'
import { CHAPTER_YOUTUBE_SEARCH_612 } from '../src/data/chapterYouTubeSearch612.js'

const execFileAsync = promisify(execFile)

let existing = {}
try {
  const raw = readFileSync('src/data/generatedClass612SearchVideos.js', 'utf8')
  const m = raw.matchAll(/'([^']+)': '([^']+)'/g)
  for (const [, k, id] of m) existing[k] = id
} catch {
  /* fresh */
}

async function searchVideoId(query) {
  const searchTerm = query.replace(/\+/g, ' ')
  const { stdout } = await execFileAsync(
    'python',
    ['-m', 'yt_dlp', `ytsearch1:${searchTerm}`, '--get-id', '--no-warnings'],
    { timeout: 180000, windowsHide: true },
  )
  const id = stdout.trim().split('\n')[0]
  return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null
}

const resolved = { ...existing }
const missing = Object.entries(CHAPTER_YOUTUBE_SEARCH_612).filter(([k]) => !resolved[k])
console.log(`Resolving ${missing.length} missing of ${Object.keys(CHAPTER_YOUTUBE_SEARCH_612).length}...`)

for (const [key, query] of missing) {
  try {
    const id = await searchVideoId(query)
    if (id) {
      resolved[key] = id
      console.log(`OK ${key} -> ${id}`)
    } else {
      console.warn(`SKIP ${key}`)
    }
  } catch {
    console.warn(`FAIL ${key}`)
  }
}

const lines = [
  '/** Auto-generated from YouTube search queries (Class 6–12 syllabus topics) */',
  'export const CLASS_612_SEARCH_VIDEO_IDS = {',
]
for (const [key, id] of Object.entries(resolved).sort()) {
  lines.push(`  '${key}': '${id}',`)
}
lines.push('}')
writeFileSync('src/data/generatedClass612SearchVideos.js', lines.join('\n'))
console.log(`Total: ${Object.keys(resolved).length}`)
