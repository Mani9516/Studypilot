import { useState } from 'react'
import { useUser } from '../context/UserContext'
import BrandMark from './BrandMark'
import { validatePassword } from '../utils/passwordPolicy'
import {
  registerUser,
  authenticateUser,
} from '../services/userDatabase'
import { dbUserToProfile } from '../utils/dbUserToProfile'

const CLASSES = Array.from({ length: 12 }, (_, i) => i + 1)

function IconStudent({ active }) {
  const stroke = active ? '#0e1a3a' : '#7c6f8a'
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 14c-3.5 0-6 1.5-6 3.5V20h12v-2.5C18 15.5 15.5 14 12 14z"
        stroke={stroke}
        strokeWidth="1.6"
      />
      <circle cx="12" cy="9" r="3.5" stroke={stroke} strokeWidth="1.6" />
      <path d="M8 4l2 2M16 4l-2 2" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function IconTeacher({ active }) {
  const stroke = active ? '#0e1a3a' : '#7c6f8a'
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 6l8 4-8 4-8-4 8-4z"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M6 12v4M18 12v4" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9 20h6" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function IconParent({ active }) {
  const stroke = active ? '#0e1a3a' : '#7c6f8a'
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="8" r="3" stroke={stroke} strokeWidth="1.6" />
      <circle cx="17" cy="9" r="2.5" stroke={stroke} strokeWidth="1.6" />
      <path
        d="M4 20c0-3 2.5-5 5-5s5 2 5 5M14 20c0-2.5 1.8-4.2 4-4.7"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function newChildRow() {
  return {
    id: `row-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: '',
    classLevel: '6',
  }
}

function isValidEmail(email) {
  const s = String(email ?? '').trim()
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

export default function LoginScreen() {
  const { login } = useUser()
  const [isSignUp, setIsSignUp] = useState(false)
  const [role, setRole] = useState('student')
  const [classLevel, setClassLevel] = useState(10)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [busy, setBusy] = useState(false)
  const [children, setChildren] = useState([newChildRow()])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setAuthError('')
    const em = email.trim()
    if (!isValidEmail(em)) {
      setAuthError('Enter a valid email address.')
      return
    }

    if (isSignUp) {
      const nm = name.trim()
      if (!nm) {
        setAuthError('Full name is required.')
        return
      }
      const pv = validatePassword(password)
      if (!pv.ok) {
        setAuthError(pv.message)
        return
      }

      if (role === 'parent') {
        const cleaned = children
          .map((c) => ({
            id: c.id,
            displayName: c.name.trim(),
            classLevel: Number(c.classLevel),
          }))
          .filter((c) => c.displayName.length > 0)
        if (cleaned.length === 0) {
          setAuthError('Add at least one child with a name on this family plan.')
          return
        }
        setBusy(true)
        const reg = await registerUser({
          email: em,
          name: nm,
          password,
          role: 'parent',
          classLevel: null,
          children: cleaned,
        })
        setBusy(false)
        if (!reg.ok) {
          setAuthError(reg.error)
          return
        }
        login(dbUserToProfile(reg.user))
        return
      }

      setBusy(true)
      const reg = await registerUser({
        email: em,
        name: nm,
        password,
        role,
        classLevel: role === 'student' ? Number(classLevel) : null,
        children: null,
      })
      setBusy(false)
      if (!reg.ok) {
        setAuthError(reg.error)
        return
      }
      login(dbUserToProfile(reg.user))
      return
    }

    setBusy(true)
    const auth = await authenticateUser(em, password)
    setBusy(false)
    if (!auth.ok) {
      setAuthError(auth.error)
      return
    }
    login(dbUserToProfile(auth.user))
  }

  const addChild = () => {
    setChildren((rows) => [...rows, newChildRow()])
  }

  const removeChild = (id) => {
    setChildren((rows) => {
      if (rows.length <= 1) return rows
      return rows.filter((r) => r.id !== id)
    })
  }

  const updateChild = (id, field, value) => {
    setChildren((rows) =>
      rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-blob auth-blob--1" aria-hidden />
      <div className="auth-blob auth-blob--2" aria-hidden />
      <div className="auth-blob auth-blob--3" aria-hidden />

      <div className="auth-shell">
        <div className="auth-brand-bar">
          <BrandMark size={48} />
          <span className="auth-brand-name">StudyPilot</span>
        </div>

        <div className="auth-card-rim">
          <main className="auth-card" id="auth-card">
            <header className="auth-head">
              <h1 className="auth-title">
                {isSignUp ? 'Create your account' : 'Welcome back'}
              </h1>
              <p className="auth-sub">
                {isSignUp
                  ? 'Student, teacher, or parent — one cockpit for learning.'
                  : 'Sign in with email and password. Your account is stored in this browser only (localStorage), not on a server.'}
              </p>
            </header>

            <div className="auth-seg" role="tablist" aria-label="Sign in or sign up">
              <button
                type="button"
                role="tab"
                aria-selected={!isSignUp}
                className={!isSignUp ? 'is-active' : ''}
                onClick={() => setIsSignUp(false)}
              >
                Login
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={isSignUp}
                className={isSignUp ? 'is-active' : ''}
                onClick={() => setIsSignUp(true)}
              >
                Sign up
              </button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <label className="auth-field">
                <span className="auth-label">Email</span>
                <input
                  className="auth-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@school.edu"
                  autoComplete="email"
                  required
                />
              </label>

              {isSignUp && (
                <label className="auth-field">
                  <span className="auth-label">Full name</span>
                  <input
                    className="auth-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Kumar"
                    autoComplete="name"
                    required
                  />
                  <span className="auth-hint">Required when creating an account.</span>
                </label>
              )}

              <label className="auth-field">
                <span className="auth-label">Password</span>
                <input
                  className="auth-input"
                  type="password"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="auth-hint">
                  {isSignUp
                    ? 'At least 8 characters with a letter, a number, and a special character (e.g. ! @ #).'
                    : 'Your account password.'}
                </span>
              </label>

              {authError && <p className="pay-error">{authError}</p>}

              <fieldset className="auth-fieldset">
                <legend className="auth-label">I am a</legend>
                <div className="auth-role-grid auth-role-grid--3">
                  <button
                    type="button"
                    className={`auth-role-card ${role === 'student' ? 'is-on' : ''}`}
                    onClick={() => setRole('student')}
                    aria-pressed={role === 'student'}
                  >
                    <IconStudent active={role === 'student'} />
                    <span className="auth-role-title">Student</span>
                    <span className="auth-role-hint">Class 1–12</span>
                  </button>
                  <button
                    type="button"
                    className={`auth-role-card ${role === 'teacher' ? 'is-on' : ''}`}
                    onClick={() => setRole('teacher')}
                    aria-pressed={role === 'teacher'}
                  >
                    <IconTeacher active={role === 'teacher'} />
                    <span className="auth-role-title">Teacher</span>
                    <span className="auth-role-hint">Progress &amp; assign</span>
                  </button>
                  <button
                    type="button"
                    className={`auth-role-card ${role === 'parent' ? 'is-on' : ''}`}
                    onClick={() => setRole('parent')}
                    aria-pressed={role === 'parent'}
                  >
                    <IconParent active={role === 'parent'} />
                    <span className="auth-role-title">Parent</span>
                    <span className="auth-role-hint">Multi-child plan</span>
                  </button>
                </div>
              </fieldset>

              {role === 'student' && (
                <label className="auth-field">
                  <span className="auth-label">Your class</span>
                  <div className="auth-select-wrap">
                    <select
                      className="auth-input auth-select"
                      value={classLevel}
                      onChange={(e) => setClassLevel(e.target.value)}
                      aria-label="Select class from 1 to 12"
                    >
                      {CLASSES.map((n) => (
                        <option key={n} value={n}>
                          Class {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </label>
              )}

              {role === 'parent' && isSignUp && (
                <div className="auth-field">
                  <span className="auth-label">Children on the same plan</span>
                  <p className="auth-hint sp-child-hint">
                    Add every learner covered by your subscription. Each needs a name
                    and class.
                  </p>
                  <div className="child-rows">
                    {children.map((row, idx) => (
                      <div key={row.id} className="child-row">
                        <input
                          className="auth-input"
                          placeholder={`Child ${idx + 1} name`}
                          value={row.name}
                          onChange={(e) =>
                            updateChild(row.id, 'name', e.target.value)
                          }
                          aria-label={`Child ${idx + 1} name`}
                        />
                        <select
                          className="auth-input auth-select"
                          value={row.classLevel}
                          onChange={(e) =>
                            updateChild(row.id, 'classLevel', e.target.value)
                          }
                          aria-label={`Child ${idx + 1} class`}
                        >
                          {CLASSES.map((n) => (
                            <option key={n} value={n}>
                              Class {n}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="child-remove"
                          onClick={() => removeChild(row.id)}
                          aria-label={`Remove child ${idx + 1}`}
                          disabled={children.length <= 1}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <button type="button" className="child-add" onClick={addChild}>
                    + Add another child
                  </button>
                </div>
              )}

              <button type="submit" className="auth-submit" disabled={busy}>
                <span>
                  {busy
                    ? 'Please wait…'
                    : isSignUp
                      ? 'Create account'
                      : 'Continue'}
                </span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M5 12h14m-6-6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
          </main>
        </div>

        <p className="auth-footer">
          {isSignUp ? 'Already registered?' : 'New here?'}{' '}
          <button
            type="button"
            className="auth-footer-link"
            onClick={() => setIsSignUp((v) => !v)}
          >
            {isSignUp ? 'Log in' : 'Create an account'}
          </button>
        </p>
      </div>
    </div>
  )
}
