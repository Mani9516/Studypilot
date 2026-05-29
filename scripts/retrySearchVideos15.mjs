import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { readFileSync, writeFileSync } from 'node:fs'
import { CHAPTER_YOUTUBE_SEARCH_15 } from '../src/data/chapterYouTubeSearch15.js'
import { CLASS_15_SEARCH_VIDEO_IDS } from '../src/data/generatedClass15SearchVideos.js'

const execFileAsync = promisify(execFile)
const resolved = { ...CLASS_15_SEARCH_VIDEO_IDS }

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

const missing = Object.entries(CHAPTER_YOUTUBE_SEARCH_15).filter(([k]) => !resolved[k])
console.log(`Retrying ${missing.length} missing...`)

for (const [key, query] of missing) {
  try {
    const id = await searchVideoId(query)
    if (id) {
      resolved[key] = id
      console.log(`OK ${key} -> ${id}`)
    } else {
      console.warn(`SKIP ${key}`)
    }
  } catch (e) {
    console.warn(`FAIL ${key}`)
  }
}

const lines = [
  '/** Auto-generated from YouTube search queries (Class 1–5 syllabus topics) */',
  'export const CLASS_15_SEARCH_VIDEO_IDS = {',
]
for (const [key, id] of Object.entries(resolved).sort()) {
  lines.push(`  '${key}': '${id}',`)
}
lines.push('}')
writeFileSync('src/data/generatedClass15SearchVideos.js', lines.join('\n'))
console.log(`Total: ${Object.keys(resolved).length}/160`)
