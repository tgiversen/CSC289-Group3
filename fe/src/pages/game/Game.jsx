import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  spinPost,
  freeSpinsPost,
  balanceGet,
  dailyRewardPost,
  setBalance,
} from "../../stores/gameSlice";
import "./Game.css";
import SlotMachine from "../../components/layout/slotmachine/SlotMachine.jsx";

const SYMBOL_EMOJI = {
  CHERRY: "🍒",
  LEMON: "🍋",
  ORANGE: "🍊",
  PLUM: "🍑",
  BELL: "🔔",
  BAR: "💎",
  SEVEN: "7️⃣",
  FREE: "🎁",
  STAR: "⭐",
  CLOVER: "🍀",
  GRAPE: "🍇",
  WATERMELON: "🍉",
  HORSESHOE: "🐎",
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
  const savedBet = parseInt(localStorage.getItem("betAmount")) || 10; 
  const [showInfo, setShowInfo] = useState(false);
  const [showDailyInfo, setShowDailyInfo] = useState(false);
  const [bet, setBet] = useState(savedBet);
  const [animating, setAnimating] = useState(false);
  const [spinTrigger, setSpinTrigger] = useState(0);
  const isBusy = animating || status === "loading";

  const [displayBalance, setDisplayBalance] = useState(balance);
  useEffect(() => {
    if (!animating) setDisplayBalance(balance);
  }, [balance, animating]);

  const [displayRewards, setDisplayRewards] = useState(null);
  useEffect(() => {
    if (!animating) setDisplayRewards(rewards);
  }, [rewards, animating]);

  const [displayFreeSpins, setDisplayFreeSpins] = useState(freeSpins);
  useEffect(() => {
    if (!animating) setDisplayFreeSpins(freeSpins);
  }, [freeSpins, animating]);

  const emojiResult = useMemo(() => {
    if (Array.isArray(lastResult) && lastResult.length === 3) {
      return lastResult.map((s) => SYMBOL_EMOJI[s] || "❓");
    }
    return null;
  }, [lastResult]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    if (typeof stored?.balance === "number")
      dispatch(setBalance(stored.balance));
    const name = stored?.username;
    if (name) dispatch(balanceGet({ username: name }));
  }, [dispatch]);

  const msg = animating
    ? "Spinning..."
    : displayRewards?.message ??
      (status === "failed"
        ? String(error || "Something went wrong")
        : "Good luck! Press SPIN to play.");

  const handleSpin = useCallback(async () => {
    if (isBusy || !username || bet <= 0) return;
    if (balance != null && bet > balance) {
      alert("Not enough balance!");
      return;
    }

    setDisplayBalance(balance);
    setDisplayRewards(rewards);
    setDisplayFreeSpins(freeSpins);

    setAnimating(true);
    setSpinTrigger((t) => t + 1);

    try {
      await dispatch(
        spinPost({
          body: { username, bet: Number(bet) },
          config: { withCredentials: true },
        })
      );
    } catch {}
  }, [isBusy, username, bet, balance, rewards, dispatch]);

  const handleFreeSpin = useCallback(async () => {
    if (isBusy || !username) return;
    if ((freeSpins ?? 0) <= 0) return;

    setDisplayBalance(balance);
    setDisplayRewards(rewards);
    setDisplayFreeSpins(freeSpins);

    setAnimating(true);
    setSpinTrigger((t) => t + 1);

    try {
      await dispatch(
        freeSpinsPost({
          body: { username },
          config: { withCredentials: true },
        })
      );
    } catch {}
  }, [isBusy, username, freeSpins, balance, rewards, dispatch]);

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
    } catch {
      alert("⚠️ New users cannot claim the reward on the same day they register or already claimed today.");
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (isBusy) return;
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
  }, [handleSpin, dispatch, username, isBusy]);

  return (
    <div
      className="game-container"
      role="application"
      aria-label="SpinStorm slot machine"
    >
      <div className="game-area">
        <div className="header">
          <div className="logo">
            <div className="badge">SPINSTORM</div>
            <div className="logo-sub">Slot machine</div>
          </div>

          <div
            className="balance"
            aria-live="polite"
            style={{ opacity: animating ? 0.7 : 1 }}
          >
            <small>Balance{animating ? " · · ·" : ""}</small>
            <div className="amt">{(displayBalance ?? 0).toLocaleString()}</div>
          </div>
        </div>

        <div className="reel-board">
          <SlotMachine
            spinTrigger={spinTrigger}
            result={emojiResult}
            onStop={() => {
              setAnimating(false);
              setDisplayBalance(balance);
              setDisplayRewards(rewards);
              setDisplayFreeSpins(freeSpins);
            }}
          />
        </div>

        <div className="message">{msg}</div>

        <div className="controls" role="region" aria-label="Game controls">
          <button
            className="btn secondary"
            onClick={() => 
              setBet((v) => {
                const newBet = Math.max(1, v -5);
                localStorage.setItem("betAmount", newBet);
                return newBet;
              })
            }
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
            onClick={() => 
              setBet((v) => {
              const newBet = Math.min(500, v + 5);
              localStorage.setItem("betAmount", newBet);
              return newBet;
              })
            }
            disabled={isBusy}
          >
            + Bet
          </button>
        </div>
      </div>

      <aside className="side" aria-label="Game info and settings">
        <div className="panel" style={{ opacity: animating ? 0.8 : 1 }}>
          <div className="panel-title">Game Info</div>
          <div className="row">
            <div className="small">Current Bet</div>
            <div className="small">{bet}</div>
          </div>

          <div style={{ height: 10 }} />
          <div className="panel-title">Last Rewards</div>
          {hasSpun && displayRewards ? (
            <>
              <div className="row">
                <div className="small">Points</div>
                <div className="small">{displayRewards.points}</div>
              </div>
              <div className="row">
                <div className="small">Jackpot</div>
                <div className="small">
                  {displayRewards.jackpot ? "Yes 🎉" : "No"}
                </div>
              </div>
              <div className="row">
                <div className="small">Free Spin</div>
                <div className="small">
                  {displayRewards.free_spin ? "Yes 🎁" : "No"}
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
          <div className="row">
            <div className="btn secondary fullwidth">
              <span>Daily Reward</span>
              <button
                className="info-btn"
                type="button"
                onClick={() => setShowDailyInfo(true)}
              >
                i
              </button>
            </div>

            <button className="btn secondary" onClick={handleDaily}>
              Claim
            </button>
          </div>
          
          <div style={{ marginTop: 12 }}>
            <div
              className="small"
              style={{ marginBottom: 4, opacity: animating ? 0.7 : 1 }}
            >
              Free Spins Remaining: <strong>{displayFreeSpins ?? 0}</strong>
              <button className="info-btn" onClick={() => setShowInfo(true)}>i</button>
              
            </div>
            <button
              className="btn secondary fullwidth"
              onClick={handleFreeSpin}
              disabled={
                isBusy || status === "loading" || (displayFreeSpins ?? 0) <= 0
              }
              aria-busy={animating ? "true" : "false"}
              style={{
                opacity: animating ? 0.7 : 1,
                pointerEvents: animating ? "none" : "auto",
              }}
            >
              {displayFreeSpins > 0 ? "🕹️ Use Free Spin" : "No Free Spins"}
            </button>
          </div>
        </div>
      </aside>
      {showInfo && (
      <div className="info-popup">
        <div className="info-card">
          <h4>Free Spin Rules</h4>
          <ul>
            <li>Free Spins do not generate more Free Spins.</li>
            <li>Free Spin wins (including jackpot) are added to your balance.</li>
            <li>A gift icon in the center bar awards a Free Spin.</li>
          </ul>
          <button className="close-btn" onClick={() => setShowInfo(false)}>
            Close
          </button>
        </div>
      </div>
    )}
      {showDailyInfo && (
      <div className="info-popup">
        <div className="info-card">
          <h4>Daily Reward Rules</h4>
          <ul>
            <li>New users cannot claim the reward on the same day they register.</li>
            <li>The first eligible claim starts the next calendar day.</li>
            <li>You can claim one reward per day.</li>
            <li>Eligibility resets at <strong>12:00 AM</strong> every day.</li>
          </ul>

          <button className="close-btn" onClick={() => setShowDailyInfo(false)}>
            Close
          </button>
        </div>
      </div>
    )}
    </div>
  );
}
