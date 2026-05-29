/** Chapters per subject (same for all tracks in this demo). */
export const CHAPTERS_PER_SUBJECT = 8

/** First N chapters are free; rest require library unlock. */
export const FREE_CHAPTER_COUNT = 2

/**
 * Class 1–4: Hindi, English, Maths, Science.
 * Class 6–10: Hindi, English, Maths, Science, Social Science, AI.
 * Class 5, 11, 12: use the 6-subject senior track for continuity.
 */
export function getSubjectsForClass(classLevel) {
  const c = Number(classLevel)
  if (c >= 1 && c <= 4) {
    return ['Hindi', 'English', 'Mathematics', 'Science']
  }
  return [
    'Hindi',
    'English',
    'Mathematics',
    'Science',
    'Social Science',
    'AI',
  ]
}

export function isChapterFree(chapterIndex1Based, allUnlocked) {
  if (allUnlocked) return true
  return chapterIndex1Based <= FREE_CHAPTER_COUNT
}
