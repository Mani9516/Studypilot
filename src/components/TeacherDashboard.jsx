import { useState, useMemo } from 'react'
import { useUser } from '../context/UserContext'

const MOCK_STUDENTS = [
  { id: 's1', name: 'Riya Sharma', classLevel: 9, progress: 72, lastActive: '2h ago' },
  { id: 's2', name: 'Arjun Mehta', classLevel: 10, progress: 58, lastActive: 'Yesterday' },
  { id: 's3', name: 'Neha Kulkarni', classLevel: 8, progress: 91, lastActive: '30m ago' },
  { id: 's4', name: 'Kabir Singh', classLevel: 12, progress: 44, lastActive: '3d ago' },
  { id: 's5', name: 'Isha Gupta', classLevel: 7, progress: 67, lastActive: '1h ago' },
]

const RESOURCE_TYPES = [
  { value: 'course', label: 'Course' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'certification', label: 'Certification' },
  { value: 'ebook', label: 'eBook' },
  { value: 'pdf', label: 'PDF' },
]

function studentNameById(id) {
  return MOCK_STUDENTS.find((s) => s.id === id)?.name ?? id
}

export default function TeacherDashboard({ activeTab }) {
  const { userProfile, teacherAssignments, addTeacherAssignment } = useUser()
  const [resourceType, setResourceType] = useState('course')
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [assignees, setAssignees] = useState(() =>
    MOCK_STUDENTS.reduce((acc, s) => ({ ...acc, [s.id]: true }), {}),
  )
  const [formMsg, setFormMsg] = useState('')

  const selectedIds = useMemo(
    () => Object.entries(assignees).filter(([, v]) => v).map(([k]) => k),
    [assignees],
  )

  const handleAssignSubmit = (e) => {
    e.preventDefault()
    setFormMsg('')
    if (!title.trim()) {
      setFormMsg('Add a title for this resource.')
      return
    }
    if (selectedIds.length === 0) {
      setFormMsg('Select at least one student.')
      return
    }
    addTeacherAssignment({
      resourceType,
      title: title.trim(),
      notes: notes.trim(),
      assignees: selectedIds,
    })
    setTitle('')
    setNotes('')
    setFormMsg('Assigned — students will see this in their queue (demo).')
  }

  const toggleAssignee = (id) => {
    setAssignees((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="page-dashboard teacher-dash">
      <header className="dash-greet">
        <h1 className="dash-title">
          Hello, {userProfile?.displayName ?? 'Teacher'}
        </h1>
        <p className="muted">
          Track progress, push courses and quizzes, and share certifications, eBooks,
          and PDFs — all simulated in this workspace.
        </p>
      </header>

      {activeTab === 'overview' && (
        <>
          <section className="soft-card sp-section">
            <h2 className="sp-h2">Student progress</h2>
            <div className="table-wrap">
              <table className="sp-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Class</th>
                    <th>Progress</th>
                    <th>Last active</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_STUDENTS.map((s) => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>Class {s.classLevel}</td>
                      <td>
                        <span className="sp-progress-bar" aria-hidden>
                          <span style={{ width: `${s.progress}%` }} />
                        </span>
                        <span className="sp-progress-num">{s.progress}%</span>
                      </td>
                      <td className="muted small">{s.lastActive}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="soft-card sp-section">
            <h2 className="sp-h2">Recent assignments</h2>
            {teacherAssignments.length === 0 ? (
              <p className="muted">No assignments yet — use the Assign tab.</p>
            ) : (
              <div className="table-wrap">
                <table className="sp-table">
                  <thead>
                    <tr>
                      <th>When</th>
                      <th>Type</th>
                      <th>Title</th>
                      <th>Students</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teacherAssignments.map((a) => (
                      <tr key={a.id}>
                        <td className="muted small">
                          {new Date(a.createdAt).toLocaleString()}
                        </td>
                        <td>{a.resourceType}</td>
                        <td>{a.title}</td>
                        <td>
                          {a.assignees?.length ?? 0} ·{' '}
                          {a.assignees?.map((id) => studentNameById(id)).join(', ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}

      {activeTab === 'assign' && (
        <section className="soft-card sp-section">
          <h2 className="sp-h2">Assign resources</h2>
          <p className="muted small sp-form-intro">
            Pick a type, name it, choose learners, and publish to your class list
            (demo — no email is sent).
          </p>

          <form className="sp-assign-form" onSubmit={handleAssignSubmit}>
            <label className="auth-field">
              <span className="auth-label">Resource type</span>
              <select
                className="auth-input auth-select"
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value)}
              >
                {RESOURCE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="auth-field">
              <span className="auth-label">Title</span>
              <input
                className="auth-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Chapter 4 problem set"
              />
            </label>

            <label className="auth-field">
              <span className="auth-label">Notes (optional)</span>
              <textarea
                className="auth-input sp-textarea"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Instructions or link hints…"
              />
            </label>

            <fieldset className="auth-fieldset">
              <legend className="auth-label">Assign to</legend>
              <div className="sp-check-grid">
                {MOCK_STUDENTS.map((s) => (
                  <label key={s.id} className="sp-check">
                    <input
                      type="checkbox"
                      checked={!!assignees[s.id]}
                      onChange={() => toggleAssignee(s.id)}
                    />
                    <span>
                      {s.name}{' '}
                      <span className="muted small">(Class {s.classLevel})</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {formMsg && (
              <p className={formMsg.startsWith('Assigned') ? 'pay-success-text' : 'pay-error'}>
                {formMsg}
              </p>
            )}

            <button type="submit" className="auth-submit">
              Publish assignment
            </button>
          </form>
        </section>
      )}
    </div>
  )
}
