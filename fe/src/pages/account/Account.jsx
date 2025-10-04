import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Account.css";

function fmt(n) {
  return Number(n ?? 0).toLocaleString();
}
function shortDate(iso) {
  return new Date(iso).toLocaleString();
}

// ---- MOCK DATA (백엔드 붙기 전까지 사용) ----
const MOCK = {
  user: "demo@spinstorm.com",
  username: "demo",
  totalEarned: 2500,
  totalSpent: 900,
  totalPoints: 1600,
  highScores: [
    { score: 5000, date: "2025-09-01T10:20:00Z" },
    { score: 3200, date: "2025-09-03T14:05:00Z" },
    { score: 2800, date: "2025-09-05T09:45:00Z" },
  ],
};

export default function Account() {
  const navigate = useNavigate();
  const username = useState(MOCK.username);
  const [data, setData] = useState({
    totalEarned: MOCK.totalEarned,
    totalSpent: MOCK.totalSpent,
    totalPoints: MOCK.totalPoints,
    highScores: MOCK.highScores,
  });

  const top10 = useMemo(() => {
    const sorted = (data.highScores ?? [])
      .slice()
      .sort((a, b) => b.score - a.score);
    return sorted.slice(0, 10);
  }, [data.highScores]);

  const clearHistory = () => {
    if (!window.confirm("Clear all high scores and reset earned/spent?"))
      return;
    setData((prev) => ({
      ...prev,
      highScores: [],
      totalEarned: 0,
      totalSpent: 0,
    }));
  };

  return (
    <div
      className="account-container"
      role="main"
      aria-label="Account overview"
    >
      {/* LEFT: Overview */}
      <div>
        <div className="header">
          <div className="title">
            <div className="badge">Account Overview</div>
          </div>

          <div className="top-actions">
            <div className="small">{username}</div>
          </div>
        </div>

        <div className="panel">
          <div className="stats-grid" aria-live="polite">
            <div className="stat" aria-hidden="false">
              <div className="label">Total Currency Earned</div>
              <div className="value">{fmt(data.totalEarned)}</div>
            </div>
            <div className="stat">
              <div className="label">Total Currency Spent</div>
              <div className="value">{fmt(data.totalSpent)}</div>
            </div>
            <div className="stat">
              <div className="label">Total Points (Current)</div>
              <div className="value">{fmt(data.totalPoints)}</div>
            </div>
          </div>

          <div className="note">Below are your top 10 scores!</div>

          <div style={{ marginTop: 12 }}>
            <table aria-label="Top 10 High Scores">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Score</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {top10.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="small" style={{ padding: 12 }}>
                      No scores yet — play to populate your top scores.
                    </td>
                  </tr>
                ) : (
                  top10.map((entry, idx) => (
                    <tr key={`${entry.score}-${entry.date}-${idx}`}>
                      <td>{idx + 1}</td>
                      <td>{fmt(entry.score)}</td>
                      <td>{shortDate(entry.date)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RIGHT: Tools */}
      <aside className="side">
        <div className="panel">
          <div className="small" style={{ marginBottom: 8 }}>
            Account Tools
          </div>

          <div className="controls">
            <button className="btn secondary" onClick={clearHistory}>
              Clear History
            </button>
          </div>
          <div style={{ height: 12 }} />
        </div>

        <div className="panel small">
          <div>
            <strong>Quick Info</strong>
          </div>
          <div style={{ marginTop: 8 }}>
            Total spins and points are tracked per account. Top scores preserves
            the best values you achieve.
          </div>
        </div>
      </aside>
    </div>
  );
}
