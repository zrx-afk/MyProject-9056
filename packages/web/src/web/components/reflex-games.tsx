import { useEffect, useRef, useState } from "react";
import { Play, Zap } from "lucide-react";
import { Reset } from "./games";
import { useSaved } from "../lib/game-utils";

const simonNames = ["Lime", "Violet", "Cyan", "Coral"];
export function Simon() {
  const [seq, sequence] = useState<number[]>([]),
    [phase, setPhase] = useState<"idle" | "show" | "input" | "lost">("idle"),
    [lit, light] = useState(-1),
    [index, setIndex] = useState(0);
  const [best, setBest] = useSaved("simon-best", () => 0);
  useEffect(() => {
    if (phase !== "show") return;
    let step = 0;
    const timer = setInterval(() => {
      if (step % 2 === 0) {
        if (step / 2 >= seq.length) {
          clearInterval(timer);
          light(-1);
          setIndex(0);
          setPhase("input");
          return;
        }
        light(seq[step / 2]);
      } else light(-1);
      step++;
    }, 380);
    return () => clearInterval(timer);
  }, [phase, seq]);
  useEffect(() => {
    if (phase !== "input" || lit < 0) return;
    const t = setTimeout(() => light(-1), 170);
    return () => clearTimeout(t);
  }, [lit, phase]);
  const start = () => {
    sequence([Math.floor(Math.random() * 4)]);
    setPhase("show");
    light(-1);
    setIndex(0);
  };
  const press = (n: number) => {
    if (phase !== "input") return;
    light(n);
    if (seq[index] !== n) {
      setPhase("lost");
      return;
    }
    if (index + 1 === seq.length) {
      setBest((b) => Math.max(b, seq.length));
      sequence((v) => [...v, Math.floor(Math.random() * 4)]);
      light(-1);
      setPhase("show");
    } else setIndex(index + 1);
  };
  return (
    <>
      <div className="game-toolbar">
        <span className="pill">
          Round {seq.length || "—"} · Best {best}
        </span>
        <Reset onClick={start} />
      </div>
      <div className="simon-board">
        {simonNames.map((name, i) => (
          <button
            key={name}
            className={`simon-pad pad-${i} ${lit === i ? "lit" : ""}`}
            aria-label={`${name} pad`}
            disabled={phase !== "input"}
            onClick={() => press(i)}
          >
            <span>{i + 1}</span>
          </button>
        ))}
        <div className="simon-core">
          <Zap size={27} />
          <small>{phase === "show" ? "WATCH" : phase === "input" ? "REPEAT" : "SIMON"}</small>
        </div>
      </div>
      <p className="game-status" aria-live="polite">
        {phase === "idle"
          ? "Watch the pattern. Repeat it. How far can you go?"
          : phase === "show"
            ? "Watch closely…"
            : phase === "input"
              ? `Your turn: ${index}/${seq.length} steps`
              : `Pattern broken. You completed ${Math.max(0, seq.length - 1)} rounds.`}
      </p>
      {(phase === "idle" || phase === "lost") && (
        <button className="center-start" onClick={start}>
          <Play size={16} /> {phase === "lost" ? "Try again" : "Start sequence"}
        </button>
      )}
    </>
  );
}
export function Whack() {
  const [running, run] = useState(false),
    [left, time] = useState(30),
    [score, points] = useState(0),
    [mole, show] = useState(-1),
    [hit, setHit] = useState(-1);
  const [best, setBest] = useSaved("whack-best", () => 0);
  const start = () => {
    time(30);
    points(0);
    show(Math.floor(Math.random() * 9));
    setHit(-1);
    run(true);
  };
  useEffect(() => {
    if (!running) return;
    const tick = setInterval(() => time((v) => Math.max(0, v - 1)), 1000);
    const pop = setInterval(
      () =>
        show((v) => {
          const n = Math.floor(Math.random() * 8);
          return n >= v ? n + 1 : n;
        }),
      780,
    );
    return () => {
      clearInterval(tick);
      clearInterval(pop);
    };
  }, [running]);
  useEffect(() => {
    if (left === 0) {
      run(false);
      show(-1);
    }
  }, [left]);
  useEffect(() => {
    if (hit < 0) return;
    const t = setTimeout(() => setHit(-1), 220);
    return () => clearTimeout(t);
  }, [hit]);
  return (
    <>
      <div className="game-toolbar">
        <span className="pill">
          {score} hits · {left}s · Best {best}
        </span>
        <Reset
          onClick={() => {
            run(false);
            time(30);
            points(0);
            show(-1);
          }}
        />
      </div>
      <div className="whack-stage">
        <div className="whack-board">
          {Array.from({ length: 9 }, (_, i) => (
            <button
              key={i}
              aria-label={`Hole ${i + 1}${mole === i ? ", mole visible" : ""}`}
              className={`mole-hole ${mole === i ? "up" : ""} ${hit === i ? "bonked" : ""}`}
              disabled={!running}
              onClick={() => {
                if (mole === i) {
                  const n = score + 1;
                  points(n);
                  setBest((v) => Math.max(v, n));
                  setHit(i);
                  show(-1);
                }
              }}
            >
              <span className="mole">
                <i />
                <b />
                <em />
              </span>
              <span className="hit-pop">+1</span>
            </button>
          ))}
        </div>
      </div>
      <p className="game-status" aria-live="polite">
        {running
          ? "Quick! Tap the little intruder before it ducks."
          : left === 0
            ? `Time! You landed ${score} hits.`
            : "30 seconds. Nine holes. One very sneaky mole."}
      </p>
      {!running && (
        <button className="center-start" onClick={start}>
          <Play size={16} /> {left === 0 ? "Play again" : "Start whacking"}
        </button>
      )}
    </>
  );
}
export function Reaction() {
  const [phase, change] = useState<"idle" | "wait" | "go" | "early" | "result">("idle"),
    [result, setResult] = useState(0);
  const [best, setBest] = useSaved("reaction-best", () => 0);
  const began = useRef(0);
  useEffect(() => {
    if (phase !== "wait") return;
    const t = setTimeout(
      () => {
        began.current = performance.now();
        change("go");
      },
      1500 + Math.random() * 3000,
    );
    return () => clearTimeout(t);
  }, [phase]);
  const tap = () => {
    if (phase === "wait") {
      change("early");
      return;
    }
    if (phase === "go") {
      const n = Math.round(performance.now() - began.current);
      setResult(n);
      setBest((b) => (!b ? n : Math.min(b, n)));
      change("result");
      return;
    }
    change("wait");
  };
  return (
    <>
      <div className="game-toolbar">
        <span className="pill">Personal best {best ? `${best} ms` : "—"}</span>
        <Reset onClick={() => change("idle")} />
      </div>
      <button className={`reaction-zone reaction-${phase}`} onClick={tap}>
        <Zap size={48} />
        <strong>
          {phase === "idle"
            ? "How fast are you?"
            : phase === "wait"
              ? "Wait for green…"
              : phase === "go"
                ? "TAP NOW!"
                : phase === "early"
                  ? "Too soon!"
                  : `${result} ms`}
        </strong>
        <span>
          {phase === "idle"
            ? "Tap to start"
            : phase === "wait"
              ? "Hold your nerve."
              : phase === "go"
                ? "Go, go, go!"
                : phase === "early"
                  ? "Tap to try again"
                  : "Tap for another round"}
        </span>
      </button>
      <p className="game-status">Wait for the panel to turn green. Then tap as fast as you can.</p>
    </>
  );
}
