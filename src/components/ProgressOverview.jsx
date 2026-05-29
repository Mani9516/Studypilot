import { useState } from 'react'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const BAR_HEIGHTS = [40, 55, 100, 48, 62, 35, 28]

export default function ProgressOverview() {
  const [range, setRange] = useState('weekly')

  return (
    <div className="page-progress">
      <header className="page-head row space-between align-center">
        <div>
          <h1 className="page-title">Progress Overview</h1>
          <p className="muted small">
            Learning rhythm for your week — web-sized layout.
          </p>
        </div>
        <button type="button" className="icon-circle" aria-label="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 22a2 2 0 002-2H10a2 2 0 002 2zm6-6V11a6 6 0 10-12 0v5L4 18h16l-2-2z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </header>

      <div className="filter-pills" role="tablist" aria-label="Time range">
        {['weekly', 'monthly', 'yearly'].map((r) => (
          <button
            key={r}
            type="button"
            className={`filter-pill ${range === r ? 'active' : ''}`}
            onClick={() => setRange(r)}
          >
            {r === 'weekly' ? 'Weekly' : r === 'monthly' ? 'Monthly' : 'Yearly'}
          </button>
        ))}
      </div>

      <div className="progress-grid">
        <section className="soft-card chart-card mint">
          <div className="chart-card-head">
            <h2>Your Learning Analysis</h2>
            <span className="muted small">May 19 – May 25</span>
          </div>
          <div className="bar-chart" role="img" aria-label="Activity by weekday">
            {DAYS.map((d, i) => (
              <div key={d} className="bar-group">
                <div
                  className={`bar ${i === 2 ? 'bar-highlight' : ''}`}
                  style={{ height: `${BAR_HEIGHTS[i]}%` }}
                />
                <span className="bar-label">{d}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="progress-side">
          <section className="soft-card friends-card">
            <h3>Learning friends</h3>
            <div className="avatar-stack" aria-hidden>
              <span className="avatar fake a" />
              <span className="avatar fake b" />
              <span className="avatar fake c" />
            </div>
            <p className="muted small">Study streaks with your group.</p>
          </section>

          <section className="soft-card donut-card">
            <h3>Recent activity</h3>
            <div className="donut-wrap">
              <svg viewBox="0 0 36 36" className="donut-svg" aria-hidden>
                <path
                  className="donut-ring"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="donut-segment"
                  strokeDasharray="67, 100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="donut-label">
                <strong>67%</strong>
                <span>Completed</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
