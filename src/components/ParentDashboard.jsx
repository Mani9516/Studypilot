import { useMemo, useState, useEffect } from 'react'
import { useUser } from '../context/UserContext'

function hashProgress(childId, classLevel) {
  let h = 0
  const str = `${childId}-${classLevel}`
  for (let i = 0; i < str.length; i += 1) h += str.charCodeAt(i)
  return {
    lessons: 32 + (h % 28),
    quizAvg: 55 + (h % 40),
    streak: 2 + (h % 8),
    certificates: h % 4,
  }
}

export default function ParentDashboard() {
  const { userProfile } = useUser()
  const children = userProfile?.children ?? []
  const [activeId, setActiveId] = useState(children[0]?.id ?? '')

  useEffect(() => {
    if (children.length && !children.some((c) => c.id === activeId)) {
      setActiveId(children[0].id)
    }
  }, [children, activeId])

  const activeChild = useMemo(
    () => children.find((c) => c.id === activeId) ?? children[0],
    [children, activeId],
  )

  const stats = useMemo(() => {
    if (!activeChild) return null
    return hashProgress(activeChild.id, activeChild.classLevel)
  }, [activeChild])

  if (children.length === 0) {
    return (
      <div className="page-dashboard">
        <p className="muted">No children on this plan.</p>
      </div>
    )
  }

  return (
    <div className="page-dashboard parent-dash">
      <header className="dash-greet">
        <h1 className="dash-title">Family overview</h1>
        <p className="muted">
          All children share one StudyPilot plan. Pick a learner to see mock
          progress (demo data).
        </p>
      </header>

      <div className="soft-card sp-section parent-child-bar">
        <span className="auth-label">Children on this plan</span>
        <div className="parent-child-pills">
          {children.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`filter-pill ${activeChild?.id === c.id ? 'active' : ''}`}
              onClick={() => setActiveId(c.id)}
            >
              {c.displayName} · Class {c.classLevel}
            </button>
          ))}
        </div>
      </div>

      {activeChild && stats && (
        <>
          <h2 className="sp-h2 sp-child-heading">
            {activeChild.displayName}{' '}
            <span className="muted small">Class {activeChild.classLevel}</span>
          </h2>

          <section className="stats-grid" aria-label="Child progress">
            <article className="stat-card mint">
              <div className="stat-icon clock" aria-hidden />
              <div>
                <div className="stat-value">{stats.lessons} lessons</div>
                <div className="stat-label">Completed</div>
              </div>
            </article>
            <article className="stat-card rose">
              <div className="stat-icon target" aria-hidden />
              <div>
                <div className="stat-value">{stats.quizAvg}%</div>
                <div className="stat-label">Quiz average</div>
              </div>
            </article>
            <article className="stat-card sky">
              <div className="stat-icon book" aria-hidden />
              <div>
                <div className="stat-value">{stats.streak} days</div>
                <div className="stat-label">Streak</div>
              </div>
            </article>
            <article className="stat-card sun">
              <div className="stat-icon trophy" aria-hidden />
              <div>
                <div className="stat-value">{stats.certificates}</div>
                <div className="stat-label">Certificates</div>
              </div>
            </article>
          </section>

          <section className="soft-card sp-section">
            <h2 className="sp-h2">Recent activity</h2>
            <ul className="sp-activity-list">
              <li>Finished a practice quiz — Mathematics</li>
              <li>Watched guided video — Science pathway</li>
              <li>Earned streak badge — {stats.streak} day run</li>
            </ul>
            <p className="muted small">
              Teachers can assign courses, quizzes, certifications, eBooks, and PDFs
              from their dashboard; students see them after sign-in.
            </p>
          </section>
        </>
      )}
    </div>
  )
}
