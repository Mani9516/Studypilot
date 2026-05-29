import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const log = readFileSync(
  join(
    process.env.USERPROFILE ?? '',
    '.cursor/projects/c-Users-ManiChourasiya-G10XI-OneDrive-G10X-Technology-Private-Limited-New-folder-2/terminals/495589.txt',
  ),
  'utf8',
)
const matches = [...log.matchAll(/^OK (.+) -> ([A-Za-z0-9_-]{11})$/gm)]
const lines = [
  '/** Auto-generated from YouTube search queries (Class 6–12 syllabus topics) */',
  'export const CLASS_612_SEARCH_VIDEO_IDS = {',
]
for (const [, key, id] of matches.sort((a, b) => a[1].localeCompare(b[1]))) {
  lines.push(`  '${key}': '${id}',`)
}
lines.push('}')
writeFileSync(join(root, 'src/data/generatedClass612SearchVideos.js'), lines.join('\n'))
console.log('Wrote', matches.length, 'ids')
