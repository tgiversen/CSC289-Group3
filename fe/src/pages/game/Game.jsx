// fe/src/pages/game/Game.jsx
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  spinPost,
  balanceGet,
  dailyRewardPost,
  buyCoinsPost,
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

  const {
    balance,
    lastResult, // e.g. ["ORANGE","PLUM","BELL"]
    rewards, // { free_spin, jackpot, message, points }
    status, // "idle" | "loading" | "succeeded" | "failed"
    error,
  } = useSelector((s) => s.game);

  const username = "jisu";

  const [bet, setBet] = useState(10);
  const [spinning, setSpinning] = useState(false);
  const isBusy = spinning || status === "loading";

  useEffect(() => {
    if (!username) return;
    dispatch(balanceGet({ username }));
  }, [dispatch, username]);

  const displayReels = useMemo(() => {
    if (Array.isArray(lastResult) && lastResult.length === 3) {
      return lastResult.map((s) => SYMBOL_EMOJI[s] || "❓");
    }
    return ["🍒", "⭐", "7️⃣"];
  }, [lastResult]);

  const msg = rewards?.message
    ? rewards.message
    : status === "failed"
    ? String(error || "Something went wrong")
    : "Good luck! Press SPIN to play.";

  const handleSpin = async () => {
    if (isBusy) return;
    if (bet <= 0) return;
    if (balance != null && bet > balance) return;

    try {
      setSpinning(true);
      await dispatch(
        spinPost({
          body: { username, bet: Number(bet) },
          config: {},
        })
      );
    } finally {
      setSpinning(false);
    }
  };

  const handleDaily = () => {
    if (isBusy) return;
    dispatch(dailyRewardPost({ body: { username } }));
  };

  const handleBuyCoins = (amount = 500) => {
    if (isBusy) return;
    dispatch(buyCoinsPost({ body: { username, amount } }));
  };

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
                {/* 가운데 값이 결과처럼 보이게 3칸 렌더 */}
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
            className="btn secondary"
            onClick={() => setBet((v) => Math.min(500, v + 5))}
            disabled={isBusy}
          >
            + Bet
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
            onClick={handleDaily}
            disabled={isBusy}
          >
            Daily Reward
          </button>
          <button
            className="btn secondary"
            onClick={() => handleBuyCoins(500)}
            disabled={isBusy}
          >
            Buy 500
          </button>
        </div>

        <div className="meta" aria-hidden="true">
          Controls: Left = Bet −/+, Center = Spin, Right = Daily/Buy
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

          <div className="panel-title">Status</div>
          <div className="row">
            <div className="small">State</div>
            <div className="small">{status}</div>
          </div>

          {(rewards?.points || rewards?.jackpot || rewards?.free_spin) && (
            <>
              <div style={{ height: 10 }} />
              <div className="panel-title">Last Rewards</div>
              <div className="row">
                <div className="small">Points</div>
                <div className="small">{rewards.points || 0}</div>
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
          )}
        </div>
      </aside>
    </div>
  );
}
