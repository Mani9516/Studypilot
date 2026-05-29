import { useState } from 'react'
import { useUser } from '../context/UserContext'

const SUBJECT_SHORT = {
  Hindi: 'Hindi',
  English: 'English',
  Mathematics: 'Maths',
  Science: 'Science',
  'Social Science': 'SST',
  AI: 'AI',
  Physics: 'Physics',
  Chemistry: 'Chem',
  Biology: 'Bio',
}

const SUBJECT_SWATCH = {
  Hindi: 'swatch-rose',
  English: 'swatch-orange',
  Mathematics: 'swatch-purple',
  Science: 'swatch-teal',
  'Social Science': 'swatch-green',
  AI: 'swatch-purple',
  Physics: 'swatch-orange',
  Chemistry: 'swatch-teal',
  Biology: 'swatch-green',
}

export default function StudentDashboard({ onOpenCourse, onOpenPayment }) {
  const {
    userProfile,
    currentSubject,
    subjects,
    setSubject,
    allCoursesUnlocked,
    purchaseInfo,
  } = useUser()
  const [pillFocus, setPillFocus] = useState('all')
  const level = userProfile?.classLevel ?? 10
  const name = userProfile?.displayName ?? 'Alex'
  const progressPct = Math.min(100, 35 + level * 4)

  return (
    <div className="page-dashboard">
      {!allCoursesUnlocked && (
        <section className="soft-card pay-banner" aria-label="Unlock offer">
          <div className="pay-banner-row">
            <div>
              <strong className="pay-banner-title">Unlock every course</strong>
              <p className="muted small pay-banner-copy">
                Chapters 3–8 in each subject stay paid until you unlock the library.
                Chapters 1–2 stay free with quizzes. UPI, card, or net banking (demo).
              </p>
            </div>
            <button type="button" className="primary pay-banner-btn" onClick={onOpenPayment}>
              Pay ₹499
            </button>
          </div>
        </section>
      )}

      {allCoursesUnlocked && (
        <section className="soft-card pay-unlocked-banner" role="status">
          <strong>Full access active</strong>
          <span className="muted small">
            {purchaseInfo?.channel === 'upi' && purchaseInfo.app
              ? `Paid via UPI (${purchaseInfo.app})`
              : purchaseInfo?.channel === 'card'
                ? `Paid via card ·••• ${purchaseInfo.last4}`
                : purchaseInfo?.channel === 'netbanking'
                  ? `Paid via ${purchaseInfo.bank}`
                  : 'All courses unlocked'}
          </span>
        </section>
      )}

      <header className="dash-top row space-between align-center">
        <div className="dash-user row align-center gap-12">
          <div className="avatar lg">{name.slice(0, 1).toUpperCase()}</div>
          <div>
            <div className="dash-name">{name}</div>
            <div className="dash-level row align-center gap-8">
              <span>Level {level}</span>
              <span className="level-track" aria-hidden>
                <span
                  className="level-fill"
                  style={{ width: `${progressPct}%` }}
                />
              </span>
            </div>
          </div>
        </div>
        <button type="button" className="icon-circle ghost-heart" aria-label="Favorites">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 21s-7-4.35-10-9c-2.5-4.5 1.5-9 6-6 1 .6 2 .6 3 0 4.5-3 8.5 1.5 6 6-3 4.65-10 9-10 9z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </header>

      <section className="dash-greet">
        <h1 className="dash-title">
          Ready to Start Learn? <span className="wave">👋</span>
        </h1>
        <p className="muted">
          It&apos;s time to continue your process of learning.
        </p>
      </section>

      <div className="filter-pills subject-pills" role="tablist" aria-label="Subject">
        <button
          type="button"
          className={`filter-pill ${pillFocus === 'all' ? 'active' : ''}`}
          onClick={() => setPillFocus('all')}
        >
          All
        </button>
        {subjects.map((s) => (
          <button
            key={s}
            type="button"
            className={`filter-pill ${pillFocus === s ? 'active' : ''}`}
            onClick={() => {
              setPillFocus(s)
              setSubject(s)
            }}
          >
            {SUBJECT_SHORT[s] ?? s}
          </button>
        ))}
      </div>

      <section className="stats-grid" aria-label="Summary stats">
        <article className="stat-card mint">
          <div className="stat-icon clock" aria-hidden />
          <div>
            <div className="stat-value">12 hours</div>
            <div className="stat-label">Total Hours</div>
          </div>
        </article>
        <article className="stat-card rose">
          <div className="stat-icon target" aria-hidden />
          <div>
            <div className="stat-value">7 topics</div>
            <div className="stat-label">Progress Now</div>
          </div>
        </article>
        <article className="stat-card sky">
          <div className="stat-icon book" aria-hidden />
          <div>
            <div className="stat-value">20</div>
            <div className="stat-label">Be Learned</div>
          </div>
        </article>
        <article className="stat-card sun">
          <div className="stat-icon trophy" aria-hidden />
          <div>
            <div className="stat-value">2 Rank</div>
            <div className="stat-label">Ranking</div>
          </div>
        </article>
      </section>

      <section className="keep-section">
        <div className="section-head row space-between align-center">
          <h2>Keep Learning</h2>
          <button type="button" className="text-link">
            View all
          </button>
        </div>
        <ul className="course-list">
          {subjects.map((s) => (
            <li key={s}>
              <button
                type="button"
                className={`course-row ${s === currentSubject ? 'primary-row' : ''}`}
                onClick={() => {
                  setSubject(s)
                  onOpenCourse()
                }}
              >
                <span
                  className={`course-icon ${SUBJECT_SWATCH[s] ?? 'swatch-purple'}`}
                />
                <span className="course-meta">
                  <span className="course-title">
                    Class {level} {s}
                  </span>
                  <span className="muted small">
                    8 chapters · syllabus video + quiz each chapter
                  </span>
                </span>
                <span className="course-play" aria-hidden>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#111" />
                    <path d="M10 8l8 4-8 4V8z" fill="#fff" />
                  </svg>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
