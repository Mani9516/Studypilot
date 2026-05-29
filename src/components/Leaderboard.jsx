import { getLeaderboard } from '../services/userDatabase'

export default function Leaderboard() {
  const rows = getLeaderboard(40)

  return (
    <div className="page-dashboard">
      <header className="dash-greet">
        <h1 className="dash-title">Leaderboard</h1>
        <p className="muted">
          Quiz runs saved in your browser database — highest points first.
        </p>
      </header>

      <section className="soft-card sp-section">
        {rows.length === 0 ? (
          <p className="muted">
            No quiz scores yet. Complete a chapter quiz as a signed-in student to
            appear here.
          </p>
        ) : (
          <div className="table-wrap">
            <table className="sp-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Player</th>
                  <th>Class</th>
                  <th>Subject</th>
                  <th>Ch.</th>
                  <th>Score</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.id}>
                    <td>{i + 1}</td>
                    <td>{r.name}</td>
                    <td>{r.classLevel ?? '—'}</td>
                    <td>{r.subject}</td>
                    <td>{r.chapter}</td>
                    <td>
                      {r.score}/{r.max}
                    </td>
                    <td>
                      <strong>{r.points}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
