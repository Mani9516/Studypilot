/**
 * At least 8 characters, with at least one letter, one digit, and one special character.
 * Special = any character that is not a letter or digit (e.g. !@#$%).
 */
export function validatePassword(password) {
  const pw = String(password ?? '')
  if (pw.length < 8) {
    return { ok: false, message: 'Use at least 8 characters.' }
  }
  if (!/[A-Za-z]/.test(pw)) {
    return { ok: false, message: 'Include at least one letter.' }
  }
  if (!/\d/.test(pw)) {
    return { ok: false, message: 'Include at least one number.' }
  }
  if (!/[^A-Za-z0-9]/.test(pw)) {
    return {
      ok: false,
      message: 'Include at least one special character (e.g. ! @ # $ %).',
    }
  }
  return { ok: true, message: '' }
}
