import { useEffect, useState, useCallback } from "react";
import "./Game.css";

export default function Game() {
  const [currentUser, setCurrentUser] = useState(true);
  useEffect(() => {
    if (!currentUser) {
      window.location.href = "/login";
    }
  }, []);

  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(10);
  const [message, setMessage] = useState("Good luck! Press SPIN to play.");
  const [spinning, setSpinning] = useState(false);

  const symbols = ["🍒", "🍋", "🔔", "⭐", "💎", "7️⃣"];
  const [reels, setReels] = useState([
    ["🍒", "⭐", "7️⃣"],
    ["⭐", "🍒", "💎"],
    ["💎", "🔔", "🍒"],
  ]);
  const [isReelSpinning, setIsReelSpinning] = useState([false, false, false]);

  const randomSymbol = () =>
    symbols[Math.floor(Math.random() * symbols.length)];

  const spinOneReel = useCallback((reelIndex, duration = 1500) => {
    return new Promise((resolve) => {
      // spinning class on
      setIsReelSpinning((prev) => {
        const next = [...prev];
        next[reelIndex] = true;
        return next;
      });

      setTimeout(() => {
        const res = [randomSymbol(), randomSymbol(), randomSymbol()];
        setReels((prev) => {
          const next = [...prev];
          next[reelIndex] = res;
          return next;
        });

        // spinning class off
        setIsReelSpinning((prev) => {
          const next = [...prev];
          next[reelIndex] = false;
          return next;
        });

        resolve(res[1]);
      }, duration);
    });
  }, []);

  const updateStats = useCallback((winAmount = 0) => {
    const currentUser = localStorage.getItem("loggedInUser");
    if (!currentUser) return;
    const raw = localStorage.getItem(currentUser);
    let userData = raw
      ? JSON.parse(raw)
      : { totalSpins: 0, totalPoints: 0, highScore: 0 };

    userData.totalSpins += 1;
    userData.totalPoints += winAmount;
    if (winAmount > userData.highScore) userData.highScore = winAmount;

    localStorage.setItem(currentUser, JSON.stringify(userData));
  }, []);

  const doSpin = useCallback(async () => {
    if (spinning) return;
    if (bet > balance) {
      setMessage("Not enough balance.");
      return;
    }

    setSpinning(true);
    setMessage("Spinning... Good luck!");
    setBalance((b) => b - bet);

    const r0 = await spinOneReel(0, 1500);
    const r1 = await spinOneReel(1, 1800);
    const r2 = await spinOneReel(2, 2100);

    if (r0 === r1 && r1 === r2) {
      const winAmt = bet * 10;
      setBalance((b) => b + winAmt);
      setMessage(`🎉 JACKPOT! You won ${winAmt} credits!`);
      updateStats(winAmt);
    } else {
      setMessage("Try again!");
      updateStats(0);
    }

    setSpinning(false);
  }, [bet, balance, spinOneReel, spinning, updateStats]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        doSpin();
      }
      if (e.key === "r" || e.key === "R") {
        setBalance(1000);
        setBet(10);
        setMessage("Reset to defaults");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [doSpin]);

  return (
    <div
      className="game-container"
      role="application"
      aria-label="SpinStorm slot machine mockup"
    >
      {/* LEFT: Game area */}
      <div className="game-area">
        <div className="header" aria-hidden="false">
          <div className="logo">
            <div className="badge">Slot machine mockup</div>
          </div>

          <div className="balance" aria-live="polite">
            <small>Balance</small>
            <div className="amt">{balance.toLocaleString()}</div>
          </div>
        </div>

        {/* Reels */}
        <div className="reel-board" aria-hidden="false">
          {reels.map((cols, idx) => (
            <div
              key={idx}
              className={`reel ${isReelSpinning[idx] ? "spinning" : ""}`}
              aria-label={`Reel ${idx + 1}`}
            >
              <div className="symbols">
                <div className="symbol">{cols[0]}</div>
                <div className="symbol">{cols[1]}</div>
                <div className="symbol">{cols[2]}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Message */}
        <div className="message">{message}</div>

        {/* Controls */}
        <div className="controls" role="region" aria-label="Game controls">
          <button
            className="btn secondary"
            onClick={() => setBet((v) => Math.max(1, v - 5))}
            disabled={spinning}
          >
            – Bet
          </button>
          <button
            className="btn secondary"
            onClick={() => setBet((v) => Math.min(500, v + 5))}
            disabled={spinning}
          >
            + Bet
          </button>

          <button
            className="btn spin"
            onClick={doSpin}
            aria-pressed={spinning ? "true" : "false"}
            aria-label="Spin button"
            disabled={spinning}
          >
            SPIN
          </button>

          <button
            className="btn secondary"
            onClick={() => {
              if (!spinning) doSpin();
            }}
            disabled={spinning}
          >
            Auto
          </button>

          <button
            className="btn secondary"
            onClick={() => setBet((_) => Math.min(balance, 100))}
            disabled={spinning}
          >
            Max
          </button>
        </div>

        <div className="meta" aria-hidden="true">
          <div>Controls: Left = Bet −/+, Center = Spin, Right = Auto/Max</div>
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

          <div className="panel-title">Sound</div>
          <div className="row">
            <div className="small">SFX</div>
            <div className="toggle">
              <label className="small">Off</label>
              <input type="checkbox" defaultChecked />
            </div>
          </div>

          <div className="dashboard">
            <h2>Player Dashboard</h2>
            <p>
              <strong>User:</strong>{" "}
              <span id="userEmail">
                {localStorage.getItem("loggedInUser") || "-"}
              </span>
            </p>
            <p>
              <strong>High Score:</strong> <span id="highScore">0</span>
            </p>
            <p>
              <strong>Total Spins:</strong> <span id="totalSpins">0</span>
            </p>
            <p>
              <strong>Total Points:</strong> <span id="totalPoints">0</span>
            </p>
          </div>

          <div style={{ height: 10 }} />

          <div className="panel-title">Shortcuts</div>
          <div className="row">
            <div className="small">Space = Spin</div>
            <div className="small">R = Reset</div>
          </div>
        </div>
      </aside>
    </div>
  );
}
