import { useEffect, useMemo, useState } from "react";
import "./Home.css";

export default function Home() {
  const user = useState(null);

  return (
    <div className="home-container" role="main" aria-label="SpinStorm home">
      <section className="home-hero">
        <h1 className="home-title">Spin. Win. Shine.</h1>
        <p className="home-sub">
          Experience the thrill of spinning reels, chasing jackpots, and
          watching your luck unfold — all in one elegant slot adventure.
        </p>

        <ul className="home-bullets" aria-label="Highlights">
          <li>🎰 Smooth reel animations & win/loss logic</li>
          <li>💰 Virtual currency with basic rewards</li>
          <li>📊 Track highscores & recent results</li>
        </ul>
      </section>

      <aside className="home-side">
        <div className="panel">
          <div className="small" style={{ marginBottom: 8 }}>
            How to Play
          </div>
          <ol className="home-steps">
            <li>Set your bet amount</li>
            <li>
              Press <strong>SPIN</strong>
            </li>
            <li>Match three identical symbols to win a Jackpot.</li>
            <li>A gift icon appearing in the center bar awards a Free Spin.</li>
            <li>Free Spins cannot generate additional Free Spins.</li>
            <li>Check your highscores in Account.</li>
          </ol>
        </div>
      </aside>
    </div>
  );
}
