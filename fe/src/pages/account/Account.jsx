// fe/src/pages/account/Account.jsx
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { rewardsHistoryGet } from "../../stores/accountSlice";
import "./Account.css";

function fmt(n) {
  return Number(n ?? 0).toLocaleString();
}

export default function Account() {
  const dispatch = useDispatch();
  const { rewardsHistory = [] } = useSelector((s) => s.account || {});
  const currentBalance = useSelector((s) => s.game?.balance) ?? 0;

  const username =
    useSelector((s) => s.auth?.user?.username) ||
    JSON.parse(localStorage.getItem("user") || "{}")?.username ||
    "";

  useEffect(() => {
    if (username) dispatch(rewardsHistoryGet({ username }));
  }, [dispatch, username]);

  const { totalEarned } = useMemo(() => {
    let earned = 0;
    let spent = 0;
    for (const r of rewardsHistory) {
      const v = Number(r?.amount ?? 0);
      if (!Number.isFinite(v)) continue;
      if (v >= 0) earned += v;
      else spent += Math.abs(v);
    }
    return { totalEarned: earned };
  }, [rewardsHistory]);

  const top3 = useMemo(() => {
    return rewardsHistory
      .filter((r) => Number.isFinite(Number(r?.amount)))
      .sort((a, b) => Number(b.amount) - Number(a.amount))
      .slice(0, 3);
  }, [rewardsHistory]);

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(rewardsHistory.length / pageSize));
  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rewardsHistory.slice(start, start + pageSize);
  }, [rewardsHistory, page]);

  return (
    <div
      className="account-container"
      role="main"
      aria-label="Account overview"
    >
      <div>
        <div className="header">
          <div className="title">
            <div className="badge">Account Overview</div>
          </div>
          <div className="top-actions">
            <div className="small">{username || "-"}</div>
          </div>
        </div>

        <div className="panel">
          <div className="stats-grid" aria-live="polite">
            <div className="stat">
              <div className="label">Current Balance</div>
              <div className="value">{fmt(currentBalance)}</div>
            </div>
            <div className="stat">
              <div className="label">Total Earned</div>
              <div className="value">{fmt(totalEarned)}</div>
            </div>
          </div>
          <div className="note" style={{ marginTop: 12 }}>
            Top 3 Scores
          </div>
          <div style={{ marginTop: 8 }}>
            <table aria-label="Top 3 Scores">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {top3.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="small" style={{ padding: 12 }}>
                      No records yet.
                    </td>
                  </tr>
                ) : (
                  top3.map((r, i) => (
                    <tr key={`${r.claimed_at}-${i}`}>
                      <td>{i + 1}</td>
                      <td>{r.reward_type || "-"}</td>
                      <td>{fmt(r.amount)}</td>
                      <td>{r.claimed_at}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="note" style={{ marginTop: 16 }}>
            Reward History
          </div>
          <div style={{ marginTop: 8 }}>
            <table aria-label="Reward & Game History">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {pageData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="small" style={{ padding: 12 }}>
                      No history found.
                    </td>
                  </tr>
                ) : (
                  pageData.map((r, idx) => (
                    <tr key={`${r.claimed_at}-${idx}`}>
                      <td>{(page - 1) * pageSize + idx + 1}</td>
                      <td>{r.reward_type || "-"}</td>
                      <td>{fmt(r.amount)}</td>
                      <td>{r.description || "-"}</td>
                      <td>{r.claimed_at}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="pager">
              <button
                className="btn secondary"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Prev
              </button>
              <span className="small" style={{ margin: "0 8px" }}>
                {page} / {totalPages}
              </span>
              <button
                className="btn secondary"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
