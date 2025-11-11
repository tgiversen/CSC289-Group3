// SlotMachine.jsx
import { useEffect, useRef } from "react";
import "./SlotMachine.css";

export default function SlotMachine({ result, spinTrigger, onStop }) {
  const appRef = useRef(null);
  const timersRef = useRef([]);
  const loopsRef = useRef([]);

  const SPIN_POOL = ["🍒", "🍋", "🔔", "⭐", "💎", "7️⃣", "🍊", "🍑"];
  const PLACEHOLDER = "❓";

  const forceReflow = (el) => el && el.offsetHeight;

  const setBoxes = (doorEl, symbols) => {
    const boxes = doorEl.querySelector(".boxes");
    const clone = boxes.cloneNode(false);
    const h = doorEl.clientHeight;

    for (let i = symbols.length - 1; i >= 0; i--) {
      const box = document.createElement("div");
      box.className = "box";
      box.style.width = `${doorEl.clientWidth}px`;
      box.style.height = `${h}px`;
      box.textContent = symbols[i];
      clone.appendChild(box);
    }
    clone.style.transition = "none";
    clone.style.transform = `translateY(-${h * (symbols.length - 1)}px)`;
    doorEl.replaceChild(clone, boxes);
    return clone;
  };

  const initStatic = () => {
    const doors = appRef.current?.querySelectorAll(".door") ?? [];
    doors.forEach((door) => {
      door.dataset.spinned = "0";
      const b = setBoxes(door, [PLACEHOLDER]);
      forceReflow(b);
      b.style.transition = "none";
      b.style.transform = "translateY(0)";
    });
  };

  const oneCycleSpin = (doorEl, duration = 700) => {
    const boxes = doorEl.querySelector(".boxes");
    boxes.style.transition = `transform ${duration}ms ease-in-out`;
    requestAnimationFrame(() => {
      boxes.style.transform = "translateY(0)";
    });
  };

  const stopToSymbol = (doorEl, symbol, duration = 1000) => {
    const boxes = setBoxes(doorEl, [
      "🍒",
      "🔔",
      "⭐",
      "💎",
      "7️⃣",
      "🍑",
      symbol,
    ]);
    forceReflow(boxes);
    boxes.style.transition = `transform ${duration}ms ease-out`;
    requestAnimationFrame(() => {
      boxes.style.transform = "translateY(0)";
    });
  };

  const startLoop = (doorEl) => {
    const cycle = () => {
      const n = 6;
      const arr = Array.from({ length: n }, () => {
        const i = Math.floor(Math.random() * SPIN_POOL.length);
        return SPIN_POOL[i];
      });
      const boxes = setBoxes(doorEl, [PLACEHOLDER, ...arr]);
      forceReflow(boxes);
      const dur = 650 + Math.floor(Math.random() * 150);
      oneCycleSpin(doorEl, dur);
    };

    cycle();
    const id = setInterval(cycle, 800);
    return id;
  };

  const stopLoop = (idx) => {
    if (loopsRef.current[idx]) {
      clearInterval(loopsRef.current[idx]);
      loopsRef.current[idx] = null;
    }
  };

  const clearAllTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  useEffect(() => {
    initStatic();
    return () => clearAllTimers();
  }, []);

  useEffect(() => {
    if (!spinTrigger || spinTrigger <= 0) return;

    const app = appRef.current;
    if (!app) return;
    clearAllTimers();

    const doors = app.querySelectorAll(".door");
    loopsRef.current.forEach((id) => id && clearInterval(id));
    loopsRef.current = [];

    doors.forEach((door, i) => {
      const t = setTimeout(() => {
        loopsRef.current[i] = startLoop(door);
      }, i * 150);
      timersRef.current.push(t);
    });

    return () => {
      clearAllTimers();
      loopsRef.current.forEach((id) => id && clearInterval(id));
      loopsRef.current = [];
    };
  }, [spinTrigger]);

  useEffect(() => {
    const app = appRef.current;
    if (!app || !Array.isArray(result) || result.length !== 3) return;

    const doors = app.querySelectorAll(".door");

    result.forEach((symbol, i) => {
      const delay = i * 300;
      const t = setTimeout(() => {
        stopLoop(i);
        stopToSymbol(doors[i], symbol, 550);
      }, delay);
      timersRef.current.push(t);
    });

    const endT = setTimeout(() => {
      loopsRef.current.forEach((id) => id && clearInterval(id));
      loopsRef.current = [];
      onStop && onStop();
    }, 2000);
    timersRef.current.push(endT);

    return clearAllTimers;
  }, [result]);

  return (
    <div id="app" ref={appRef}>
      <div className="doors">
        <div className="door">
          <div className="boxes" />
        </div>
        <div className="door">
          <div className="boxes" />
        </div>
        <div className="door">
          <div className="boxes" />
        </div>
      </div>
    </div>
  );
}
