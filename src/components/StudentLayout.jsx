import { useUser } from '../context/UserContext'
import BrandMark from './BrandMark'

function IconHome({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z"
        stroke={active ? '#111' : '#7c6f8a'}
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={active ? '#111' : 'none'}
        fillOpacity={active ? 0.08 : 0}
      />
    </svg>
  )
}

function IconChart({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 19V5M5 19h14M9 15V9m4 6V7m4 8v-4"
        stroke={active ? '#111' : '#7c6f8a'}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconTrophy({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 21h8M12 17v4M6 3h12v4a4 4 0 01-4 4h-4a4 4 0 01-4-4V3zM4 7H2v1a3 3 0 003 3h1M20 7h2v1a3 3 0 01-3 3h-1"
        stroke={active ? '#111' : '#7c6f8a'}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconUser({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 20a8 8 0 0116 0"
        stroke={active ? '#111' : '#7c6f8a'}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function StudentLayout({
  studentView,
  onNavigate,
  onLogout,
  children,
}) {
  const { userProfile, setClassLevel, allCoursesUnlocked } = useUser()
  const level = userProfile?.classLevel ?? 10
  const name = userProfile?.displayName ?? 'Student'

  const navActive = (id) => {
    if (id === 'home') return studentView === 'dashboard'
    if (id === 'progress') return studentView === 'progress'
    if (id === 'leaderboard') return studentView === 'leaderboard'
    if (id === 'account') return studentView === 'account'
    return false
  }

  return (
    <div className="app-layout app-layout--student">
      <aside className="sidebar sidebar--sp" aria-label="Main navigation">
        <div className="sidebar-brand">
          <BrandMark size={44} className="sidebar-brand-img" />
          <div>
            <strong>StudyPilot</strong>
            <div className="sidebar-brand-row">
              <span className="sidebar-tagline">Study smarter</span>
              {allCoursesUnlocked && (
                <span className="sidebar-pro-badge" title="Full library unlocked">
                  Pro
                </span>
              )}
            </div>
          </div>
        </div>

        <label className="sidebar-field">
          <span>Class</span>
          <select
            className="sidebar-select"
            value={level}
            onChange={(e) => setClassLevel(e.target.value)}
            aria-label="Class level 1 to 12"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                Class {n}
              </option>
            ))}
          </select>
        </label>

        <nav className="sidebar-nav">
          <button
            type="button"
            className={`nav-item ${navActive('home') ? 'active' : ''}`}
            onClick={() => onNavigate('dashboard')}
          >
            <IconHome active={navActive('home')} />
            Home
          </button>
          <button
            type="button"
            className={`nav-item ${navActive('progress') ? 'active' : ''}`}
            onClick={() => onNavigate('progress')}
          >
            <IconChart active={navActive('progress')} />
            Progress
          </button>
          <button
            type="button"
            className={`nav-item ${navActive('leaderboard') ? 'active' : ''}`}
            onClick={() => onNavigate('leaderboard')}
          >
            <IconTrophy active={navActive('leaderboard')} />
            Leaderboard
          </button>
          <button
            type="button"
            className={`nav-item ${navActive('account') ? 'active' : ''}`}
            onClick={() => onNavigate('account')}
          >
            <IconUser active={navActive('account')} />
            Account
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar sm">{name.slice(0, 1).toUpperCase()}</div>
            <div>
              <div className="sidebar-user-name">{name}</div>
              <div className="sidebar-user-meta">Class {level}</div>
            </div>
          </div>
          <button type="button" className="sidebar-logout" onClick={onLogout}>
            Log out
          </button>
        </div>
      </aside>

      <main className="main-canvas">{children}</main>
    </div>
  )
}
