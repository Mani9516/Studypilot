import BrandMark from './BrandMark'

function IconBoard({ active }) {
  const c = active ? '#0e1a3a' : '#64748b'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="5" width="16" height="12" rx="2" stroke={c} strokeWidth="1.8" />
      <path d="M8 21h8M12 17v4" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function IconAssign({ active }) {
  const c = active ? '#0e1a3a' : '#64748b'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 5v14M5 12h14"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconUser({ active }) {
  const c = active ? '#0e1a3a' : '#64748b'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 20a8 8 0 0116 0"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function TeacherLayout({ activeTab, onTab, onLogout, children }) {
  return (
    <div className="app-layout app-layout--teacher">
      <aside className="sidebar sidebar--sp" aria-label="Teacher navigation">
        <div className="sidebar-brand">
          <BrandMark size={44} className="sidebar-brand-img" />
          <div>
            <strong>StudyPilot</strong>
            <span className="sidebar-tagline">Teacher</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            type="button"
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => onTab('overview')}
          >
            <IconBoard active={activeTab === 'overview'} />
            Overview
          </button>
          <button
            type="button"
            className={`nav-item ${activeTab === 'assign' ? 'active' : ''}`}
            onClick={() => onTab('assign')}
          >
            <IconAssign active={activeTab === 'assign'} />
            Assign
          </button>
          <button
            type="button"
            className={`nav-item ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => onTab('account')}
          >
            <IconUser active={activeTab === 'account'} />
            Account
          </button>
        </nav>

        <div className="sidebar-footer">
          <button type="button" className="sidebar-logout" onClick={onLogout}>
            Log out
          </button>
        </div>
      </aside>

      <main className="main-canvas main-canvas--wide">{children}</main>
    </div>
  )
}
