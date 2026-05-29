import BrandMark from './BrandMark'

function IconFamily({ active }) {
  const c = active ? '#0e1a3a' : '#64748b'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="8" r="3" stroke={c} strokeWidth="1.8" />
      <circle cx="17" cy="9" r="2.5" stroke={c} strokeWidth="1.8" />
      <path
        d="M4 20c0-3 2.5-5 5-5s5 2 5 5M14 20c0-2.5 1.8-4.2 4-4.7"
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

export default function ParentLayout({ activeTab, onTab, onLogout, children }) {
  return (
    <div className="app-layout app-layout--parent">
      <aside className="sidebar sidebar--sp" aria-label="Parent navigation">
        <div className="sidebar-brand">
          <BrandMark size={44} className="sidebar-brand-img" />
          <div>
            <strong>StudyPilot</strong>
            <span className="sidebar-tagline">Family</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            type="button"
            className={`nav-item ${activeTab === 'family' ? 'active' : ''}`}
            onClick={() => onTab('family')}
          >
            <IconFamily active={activeTab === 'family'} />
            Children
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
