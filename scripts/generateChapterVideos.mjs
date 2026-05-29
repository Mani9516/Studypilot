import { writeFileSync } from 'node:fs'
import { CHAPTER_TITLES_612 } from '../src/data/syllabusClass612.js'
import { CHAPTER_TITLES_15 } from '../src/data/syllabusClass15.js'
import { resolveClass15VideoId } from '../src/data/topicVideoClass15.js'
import { resolveClass612VideoId } from '../src/data/topicVideoClass612.js'
import { CLASS_15_SEARCH_VIDEO_IDS } from '../src/data/generatedClass15SearchVideos.js'
import { CLASS_612_SEARCH_VIDEO_IDS } from '../src/data/generatedClass612SearchVideos.js'

const lines = [
  '/** Auto-generated — YouTube ids from syllabus search topics (classes 1–12) */',
  'export const CLASS_CHAPTER_VIDEO_ALL = {',
]

for (const c of [1, 2, 3, 4, 5]) {
  for (const subject of Object.keys(CHAPTER_TITLES_15[c])) {
    CHAPTER_TITLES_15[c][subject].forEach((title, i) => {
      const ch = i + 1
      const key = `${c}|${subject}|${ch}`
      const id = CLASS_15_SEARCH_VIDEO_IDS[key] ?? resolveClass15VideoId(c, subject, ch)
      if (id) lines.push(`  '${key}': '${id}',`)
    })
  }
}

for (const c of [6, 7, 8, 9, 10, 11, 12]) {
  for (const subject of Object.keys(CHAPTER_TITLES_612[c])) {
    CHAPTER_TITLES_612[c][subject].forEach((title, i) => {
      const ch = i + 1
      const key = `${c}|${subject}|${ch}`
      const id = CLASS_612_SEARCH_VIDEO_IDS[key] ?? resolveClass612VideoId(c, subject, ch)
      if (id) lines.push(`  '${key}': '${id}',`)
    })
  }
}

lines.push('}')
writeFileSync('src/data/generatedClassChapterVideo.js', lines.join('\n'))
console.log('Wrote', lines.length, 'lines')
