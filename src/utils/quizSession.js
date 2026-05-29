/** Random seed per quiz attempt so questions vary each time. */
export function createQuizSessionSeed() {
  return (
    (Date.now() % 1_000_000) +
    Math.floor(Math.random() * 1_000_000)
  )
}

/** Fisher–Yates shuffle of [0..count-1] using session seed + salt. */
export function shuffledIndices(count, sessionSeed, salt = 0) {
  const arr = Array.from({ length: count }, (_, i) => i)
  let state = (sessionSeed ^ salt) >>> 0
  for (let i = arr.length - 1; i > 0; i -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    const j = state % (i + 1)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** Dedupe key — same prompt text is treated as the same question. */
export function questionSignature(prompt) {
  return String(prompt ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}
