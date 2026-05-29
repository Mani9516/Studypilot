/**
 * Browser-local "database" (localStorage). Demo only — not a secure production backend.
 * Passwords are stored as SHA-256 hashes (still vulnerable if device is compromised).
 */

const STORAGE_KEY = 'studypilot_db_v2'
const HASH_PREFIX = 'studypilot|v2|'

function emptyDb() {
  return { users: [], leaderboard: [] }
}

export function loadDb() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyDb()
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.users)) parsed.users = []
    if (!Array.isArray(parsed.leaderboard)) parsed.leaderboard = []
    return parsed
  } catch {
    return emptyDb()
  }
}

export function saveDb(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
}

export async function hashPassword(password) {
  const msg = `${HASH_PREFIX}${password}`
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(msg),
  )
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function verifyPassword(password, hashHex) {
  const h = await hashPassword(password)
  return h === hashHex
}

function normalizeEmail(email) {
  return String(email ?? '')
    .trim()
    .toLowerCase()
}

export function findUserByEmail(email) {
  const e = normalizeEmail(email)
  return loadDb().users.find((u) => u.email === e) ?? null
}

export async function registerUser({
  email,
  name,
  password,
  role,
  classLevel,
  children,
}) {
  const db = loadDb()
  const em = normalizeEmail(email)
  if (!em) return { ok: false, error: 'Email is required.' }
  if (db.users.some((u) => u.email === em)) {
    return { ok: false, error: 'An account with this email already exists.' }
  }
  const passwordHash = await hashPassword(password)
  const user = {
    id: crypto.randomUUID(),
    email: em,
    name: String(name).trim(),
    passwordHash,
    role,
    classLevel: classLevel ?? null,
    children: children ?? null,
    allCoursesUnlocked: false,
    purchaseInfo: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  db.users.push(user)
  saveDb(db)
  return { ok: true, user }
}

export async function authenticateUser(email, password) {
  const u = findUserByEmail(email)
  if (!u) return { ok: false, error: 'No account found for this email.' }
  const ok = await verifyPassword(password, u.passwordHash)
  if (!ok) return { ok: false, error: 'Incorrect password.' }
  return { ok: true, user: u }
}

export function persistUserPatch(userId, patch) {
  if (!userId) return
  const db = loadDb()
  const i = db.users.findIndex((u) => u.id === userId)
  if (i === -1) return
  db.users[i] = {
    ...db.users[i],
    ...patch,
    updatedAt: new Date().toISOString(),
  }
  saveDb(db)
}

export async function updateUserPassword(userId, oldPassword, newPassword) {
  const db = loadDb()
  const u = db.users.find((x) => x.id === userId)
  if (!u) return { ok: false, error: 'User not found.' }
  const match = await verifyPassword(oldPassword, u.passwordHash)
  if (!match) return { ok: false, error: 'Current password is incorrect.' }
  u.passwordHash = await hashPassword(newPassword)
  u.updatedAt = new Date().toISOString()
  saveDb(db)
  return { ok: true }
}

export function recordQuizScore({
  userId,
  name,
  classLevel,
  subject,
  chapter,
  score,
  max,
}) {
  const db = loadDb()
  const points = score * 100 + Number(chapter) * 10 + (max || 5)
  db.leaderboard.push({
    id: `lb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    userId,
    name,
    classLevel,
    subject,
    chapter,
    score,
    max,
    points,
    at: new Date().toISOString(),
  })
  saveDb(db)
}

export function getLeaderboard(limit = 50) {
  const rows = loadDb().leaderboard
  return [...rows]
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points
      return new Date(b.at) - new Date(a.at)
    })
    .slice(0, limit)
}
