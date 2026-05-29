import { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext'
import { validatePassword } from '../utils/passwordPolicy'
import { updateUserPassword } from '../services/userDatabase'

export default function AccountPage() {
  const { userProfile, updateProfile, logout } = useUser()
  const [name, setName] = useState(userProfile?.displayName ?? '')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [oldPw, setOldPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setName(userProfile?.displayName ?? '')
  }, [userProfile?.displayName])

  const handleSaveName = (e) => {
    e.preventDefault()
    setErr('')
    setMsg('')
    const n = name.trim()
    if (!n) {
      setErr('Name cannot be empty.')
      return
    }
    updateProfile({ displayName: n })
    setMsg('Display name updated.')
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setErr('')
    setMsg('')
    const v = validatePassword(newPw)
    if (!v.ok) {
      setErr(v.message)
      return
    }
    if (!userProfile?.userId) {
      setErr('No stored account id.')
      return
    }
    setBusy(true)
    const res = await updateUserPassword(userProfile.userId, oldPw, newPw)
    setBusy(false)
    if (!res.ok) {
      setErr(res.error)
      return
    }
    setOldPw('')
    setNewPw('')
    setMsg('Password updated.')
  }

  return (
    <div className="page-dashboard">
      <header className="dash-greet">
        <h1 className="dash-title">Account</h1>
        <p className="muted">
          Profile is stored in this browser (localStorage). Clearing site data will
          remove it.
        </p>
      </header>

      {(msg || err) && (
        <p className={err ? 'pay-error' : 'pay-success-text'}>{err || msg}</p>
      )}

      <section className="soft-card sp-section">
        <h2 className="sp-h2">Profile</h2>
        <p className="muted small">
          <strong>Email</strong> · {userProfile?.email ?? '—'}
        </p>
        <p className="muted small">
          <strong>Role</strong> · {userProfile?.role ?? '—'}
        </p>
        {userProfile?.role === 'student' && (
          <p className="muted small">
            <strong>Class</strong> · {userProfile?.classLevel ?? '—'}
          </p>
        )}
        {userProfile?.role === 'parent' && userProfile?.children?.length > 0 && (
          <p className="muted small">
            <strong>Children on plan</strong> · {userProfile.children.length}
          </p>
        )}

        <form className="sp-assign-form" onSubmit={handleSaveName}>
          <label className="auth-field">
            <span className="auth-label">Display name</span>
            <input
              className="auth-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="primary">
            Save name
          </button>
        </form>
      </section>

      <section className="soft-card sp-section">
        <h2 className="sp-h2">Change password</h2>
        <p className="muted small">
          Same rules as sign-up: 8+ characters with letter, number, and special
          character.
        </p>
        <form className="sp-assign-form" onSubmit={handleChangePassword}>
          <label className="auth-field">
            <span className="auth-label">Current password</span>
            <input
              className="auth-input"
              type="password"
              value={oldPw}
              onChange={(e) => setOldPw(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          <label className="auth-field">
            <span className="auth-label">New password</span>
            <input
              className="auth-input"
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              autoComplete="new-password"
              required
            />
          </label>
          <button type="submit" className="primary" disabled={busy}>
            {busy ? 'Saving…' : 'Update password'}
          </button>
        </form>
      </section>

      <section className="soft-card sp-section">
        <h2 className="sp-h2">Session</h2>
        <button type="button" className="sidebar-logout" onClick={logout}>
          Log out
        </button>
      </section>
    </div>
  )
}
