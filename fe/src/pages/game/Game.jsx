// fe/src/pages/game/Game.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  spinPost,
  freeSpinsPost,
  balanceGet,
  dailyRewardPost,
  buyCoinsPost,
  setBalance,
} from "../../stores/gameSlice";
import "./Game.css";

const SYMBOL_EMOJI = {
  CHERRY: "🍒",
  LEMON: "🍋",
  ORANGE: "🍊",
  PLUM: "🍑",
  BELL: "🔔",
  BAR: "💎",
  SEVEN: "7️⃣",
  FREE: "🎁",
};

export default function Game() {
  const dispatch = useDispatch();
  const { hasSpun, lastResult, rewards, status, error } = useSelector(
    (s) => s.game
  );
  const { balance, freeSpins } = useSelector((s) => s.game);
  const authUser = useSelector((s) => s.auth?.user);
  const username =
    authUser?.username ||
    JSON.parse(localStorage.getItem("user") || "{}")?.username ||
    "";

  const [bet, setBet] = useState(10);
  const [spinning, setSpinning] = useState(false);
  const isBusy = spinning || status === "loading";
  const state = useSelector((s) => s.game);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    if (typeof stored?.balance === "number") {
      dispatch(setBalance(stored.balance));
    }

    const name = stored?.username;
    if (name) dispatch(balanceGet({ username: name }));
    console.log("Updated game state:", state);
  }, [dispatch]);

  const displayReels = useMemo(() => {
    if (Array.isArray(lastResult) && lastResult.length === 3) {
      return lastResult.map((s) => SYMBOL_EMOJI[s] || "❓");
    }
    return ["🍒", "⭐", "7️⃣"];
  }, [lastResult]);

  const msg =
    rewards?.message ??
    (status === "failed"
      ? String(error || "Something went wrong")
      : "Good luck! Press SPIN to play.");

  const handleSpin = useCallback(async () => {
    if (isBusy) return;
    if (!username) return;
    if (bet <= 0) return;
    if (balance != null && bet > balance) {
      alert("Not enough balance!");
      return;
    }

    try {
      setSpinning(true);
      await dispatch(
        spinPost({
          body: { username, bet: Number(bet) },
          config: { withCredentials: true },
        })
      );
    } finally {
      setSpinning(false);
    }
  }, [isBusy, username, bet, balance, dispatch]);

  // Daily Reward
  const handleDaily = async () => {
    if (isBusy || !username) return;
    try {
      const res = await dispatch(
        dailyRewardPost({ body: { username } })
      ).unwrap();
      const got = res?.data?.reward_points ?? 0;
      const newBal = res?.data?.balance;

      alert(`✅ Claimed +${got} coins!`);
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...stored, balance: newBal })
      );
    } catch (err) {
      alert("⚠️ Already claimed today or not eligible yet.");
    }
  };

  // Space = Spin, R = Reset
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleSpin();
      } else if (e.key === "r" || e.key === "R") {
        dispatch(balanceGet({ username }));
        setBet(10);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleSpin, dispatch, username]);

  return (
    <div
      className="game-container"
      role="application"
      aria-label="SpinStorm slot machine"
    >
      {/* LEFT: Game area */}
      <div className="game-area">
        <div className="header">
          <div className="logo">
            <div className="badge">SPINSTORM</div>
            <div className="logo-sub">Slot machine</div>
          </div>

          <div className="balance" aria-live="polite">
            <small>Balance</small>
            <div className="amt">{(balance ?? 0).toLocaleString()}</div>
          </div>
        </div>

        {/* Reels */}
        <div className="reel-board">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`reel ${spinning ? "spinning" : ""}`}
              aria-label={`Reel ${i + 1}`}
            >
              <div className="symbols">
                <div className="symbol">{displayReels[i]}</div>
                <div className="symbol">{displayReels[i]}</div>
                <div className="symbol">{displayReels[i]}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Message */}
        <div className="message">{msg}</div>

        {/* Controls */}
        <div className="controls" role="region" aria-label="Game controls">
          <button
            className="btn secondary"
            onClick={() => setBet((v) => Math.max(1, v - 5))}
            disabled={isBusy}
          >
            – Bet
          </button>
          <button
            className="btn spin"
            onClick={handleSpin}
            aria-pressed={isBusy ? "true" : "false"}
            aria-label="Spin button"
            disabled={isBusy}
          >
            {isBusy ? "..." : "SPIN"}
          </button>
          <button
            className="btn secondary"
            onClick={() => setBet((v) => Math.min(500, v + 5))}
            disabled={isBusy}
          >
            + Bet
          </button>
        </div>
      </div>

      {/* RIGHT: Side info / settings */}
      <aside className="side" aria-label="Game info and settings">
        <div className="panel">
          <div className="panel-title">Game Info</div>
          <div className="row">
            <div className="small">Current Bet</div>
            <div className="small">{bet}</div>
          </div>

          <div style={{ height: 10 }} />
          <div style={{ height: 10 }} />
          <div className="panel-title">Last Rewards</div>
          {hasSpun ? (
            <>
              <div className="row">
                <div className="small">Points</div>
                <div className="small">{rewards.points}</div>
              </div>
              <div className="row">
                <div className="small">Jackpot</div>
                <div className="small">{rewards.jackpot ? "Yes 🎉" : "No"}</div>
              </div>
              <div className="row">
                <div className="small">Free Spin</div>
                <div className="small">
                  {rewards.free_spin ? "Yes 🎁" : "No"}
                </div>
              </div>
            </>
          ) : (
            <div className="empty small" style={{ padding: 8, opacity: 0.8 }}>
              🎰 No spins yet — try your luck!
            </div>
          )}
          <div style={{ height: 20 }} />

          <div className="panel-title">Actions</div>
          <button
            className="btn secondary fullwidth"
            onClick={handleDaily}
            disabled={isBusy}
          >
            💰 Daily Reward
          </button>
          <div style={{ marginTop: 12 }}>
            <div className="small" style={{ marginBottom: 4 }}>
              Free Spins Remaining: <strong>{freeSpins ?? 0}</strong>
            </div>
            <button
              className="btn secondary fullwidth"
              onClick={() => dispatch(freeSpinsPost({ body: { username } }))}
              disabled={status === "loading" || freeSpins <= 0}
            >
              {freeSpins > 0 ? "🕹️ Use Free Spin" : "No Free Spins"}
            </button>
            <div style={{ marginTop: 12 }}></div>
          </div>
        </div>
      </aside>
    </div>
  );
}
