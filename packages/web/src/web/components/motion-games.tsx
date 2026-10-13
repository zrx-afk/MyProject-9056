import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Pause, Play } from "lucide-react";
import { Reset } from "./games";
import { useSaved } from "../lib/game-utils";

type PongState = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  paddle: number;
  ai: number;
  you: number;
  cpu: number;
};
const pongFresh = (): PongState => ({
  x: 200,
  y: 150,
  vx: 3.2,
  vy: 2.1,
  paddle: 150,
  ai: 150,
  you: 0,
  cpu: 0,
});
export function Pong() {
  const [s, set] = useState(pongFresh),
    [running, run] = useState(false);
  const state = useRef(s),
    keys = useRef(new Set<string>());
  state.current = s;
  const over = s.you >= 5 || s.cpu >= 5;
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        (e.target as HTMLElement)?.matches("input,textarea") ||
        document.querySelector("dialog[open]")
      )
        return;
      if (["ArrowUp", "ArrowDown", " "].includes(e.key)) {
        e.preventDefault();
        keys.current.add(e.key);
        if (e.key === " " && !e.repeat) run((v) => !v);
      }
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key);
    const blur = () => {
      keys.current.clear();
      run(false);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, []);
  useEffect(() => {
    if (!running || over) return;
    let frame = 0,
      last = 0;
    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 16.667, 2) : 1;
      last = now;
      const v = { ...state.current };
      if (keys.current.has("ArrowUp")) v.paddle -= 5 * dt;
      if (keys.current.has("ArrowDown")) v.paddle += 5 * dt;
      v.paddle = Math.max(34, Math.min(266, v.paddle));
      v.ai += Math.sign(v.y - v.ai) * Math.min(Math.abs(v.y - v.ai), 2.4 * dt);
      v.ai = Math.max(34, Math.min(266, v.ai));
      v.x += v.vx * dt;
      v.y += v.vy * dt;
      if (v.y < 6) {
        v.y = 6;
        v.vy = Math.abs(v.vy);
      }
      if (v.y > 294) {
        v.y = 294;
        v.vy = -Math.abs(v.vy);
      }
      if (v.vx < 0 && v.x <= 26 && v.x >= 12 && Math.abs(v.y - v.paddle) < 38) {
        v.x = 26;
        v.vx = Math.min(7, Math.abs(v.vx) * 1.08);
        v.vy = (v.y - v.paddle) / 11;
      }
      if (v.vx > 0 && v.x >= 374 && v.x <= 388 && Math.abs(v.y - v.ai) < 38) {
        v.x = 374;
        v.vx = -Math.min(7, Math.abs(v.vx) * 1.08);
        v.vy = (v.y - v.ai) / 11;
      }
      if (v.x < 0 || v.x > 400) {
        if (v.x > 400) v.you++;
        else v.cpu++;
        v.x = 200;
        v.y = 150;
        v.vx = Math.random() > 0.5 ? 3.2 : -3.2;
        v.vy = (Math.random() > 0.5 ? 1 : -1) * 2.1;
        run(false);
      }
      state.current = v;
      set(v);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, over]);
  const position = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const p = Math.max(34, Math.min(266, ((e.clientY - r.top) / r.height) * 300));
    set((v) => ({ ...v, paddle: p }));
  };
  return (
    <>
      <div className="game-toolbar">
        <span className="pill">
          YOU {s.you} : {s.cpu} CPU · First to 5
        </span>
        <div className="toolbar-actions">
          <button className="reset-button" disabled={over} onClick={() => run(!running)}>
            {running ? <Pause size={15} /> : <Play size={15} />} {running ? "Pause" : "Play"}
          </button>
          <Reset
            onClick={() => {
              set(pongFresh());
              run(false);
            }}
          />
        </div>
      </div>
      <div className="action-board pong-board">
        <svg
          viewBox="0 0 400 300"
          aria-label="Pong court"
          onPointerMove={position}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            position(e);
          }}
        >
          <path d="M200 0V300" stroke="#363849" strokeWidth="2" strokeDasharray="8 9" />
          <text x="155" y="62" fill="#333745" fontSize="44" fontFamily="monospace">
            {s.you}
          </text>
          <text x="220" y="62" fill="#333745" fontSize="44" fontFamily="monospace">
            {s.cpu}
          </text>
          <rect x="14" y={s.paddle - 32} width="8" height="64" rx="4" fill="#c3f75c" />
          <rect x="378" y={s.ai - 32} width="8" height="64" rx="4" fill="#a392ff" />
          <circle cx={s.x} cy={s.y} r="6" fill="#fff" />
        </svg>
        {!running && (
          <div className="field-overlay">
            <span>
              {over
                ? s.you >= 5
                  ? "Victory! The court is yours."
                  : "CPU wins. Ready for a rematch?"
                : "Classic rivalry. Fresh reflexes."}
            </span>
            {!over && (
              <button onClick={() => run(true)}>
                <Play size={16} /> {s.you || s.cpu ? "Next serve" : "Start match"}
              </button>
            )}
          </div>
        )}
      </div>
      <p className="game-status">Move or drag vertically. You are the lime paddle on the left.</p>
      <div className="directions">
        {["ArrowUp", "ArrowDown"].map((key, i) => (
          <button
            key={key}
            aria-label={i ? "Paddle down" : "Paddle up"}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              keys.current.add(key);
            }}
            onPointerUp={() => keys.current.delete(key)}
            onPointerCancel={() => keys.current.delete(key)}
            onClick={() =>
              set((v) => ({ ...v, paddle: Math.max(34, Math.min(266, v.paddle + (i ? 20 : -20))) }))
            }
          >
            {i ? <ArrowDown size={18} /> : <ArrowUp size={18} />}
          </button>
        ))}
      </div>
    </>
  );
}
type Pipe = { x: number; gap: number; passed: boolean };
type FlyState = { y: number; vy: number; pipes: Pipe[]; score: number; over: boolean };
const flyFresh = (): FlyState => ({
  y: 180,
  vy: 0,
  pipes: [
    { x: 360, gap: 170, passed: false },
    { x: 570, gap: 220, passed: false },
  ],
  score: 0,
  over: false,
});
export function Flyer() {
  const [s, set] = useState(flyFresh),
    [running, run] = useState(false);
  const [best, setBest] = useSaved("flyer-best", () => 0);
  const state = useRef(s);
  state.current = s;
  const active = useRef(running);
  active.current = running;
  const flap = useCallback(() => {
    if (state.current.over) return;
    set((v) => ({ ...v, vy: -4.7 }));
    if (!active.current) run(true);
  }, []);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (
        (e.target as HTMLElement)?.matches("input,textarea") ||
        document.querySelector("dialog[open]")
      )
        return;
      if (e.code === "Space" || e.key === "ArrowUp") {
        e.preventDefault();
        if (!e.repeat) flap();
      }
    };
    const blur = () => run(false);
    window.addEventListener("keydown", key);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("blur", blur);
    };
  }, [flap]);
  useEffect(() => {
    if (!running || s.over) return;
    let frame = 0,
      last = 0;
    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 16.667, 2) : 1;
      last = now;
      const v = { ...state.current, pipes: state.current.pipes.map((p) => ({ ...p })) };
      v.vy += 0.24 * dt;
      v.y += v.vy * dt;
      for (const p of v.pipes) {
        p.x -= 2.05 * dt;
        if (!p.passed && p.x + 48 < 85) {
          p.passed = true;
          v.score++;
          setBest((b) => Math.max(b, v.score));
        }
        if (p.x + 48 < -10) {
          p.x = Math.max(...v.pipes.map((x) => x.x)) + 210;
          p.gap = 105 + Math.random() * 190;
          p.passed = false;
        }
        if (p.x < 98 && p.x + 48 > 72 && (v.y - 11 < p.gap - 62 || v.y + 11 > p.gap + 62))
          v.over = true;
      }
      if (v.y < 12 || v.y > 388) v.over = true;
      if (v.over) run(false);
      state.current = v;
      set(v);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, s.over, setBest]);
  return (
    <>
      <div className="game-toolbar">
        <span className="pill">
          Score {s.score} · Best {best}
        </span>
        <div className="toolbar-actions">
          <button className="reset-button" onClick={() => run(false)} disabled={!running}>
            <Pause size={15} /> Pause
          </button>
          <Reset
            onClick={() => {
              set(flyFresh());
              run(false);
            }}
          />
        </div>
      </div>
      <button className="fly-board" aria-label="Flap upward" disabled={s.over} onClick={flap}>
        <svg viewBox="0 0 320 400" aria-label="Orbit Hopper flight path">
          <defs>
            <linearGradient id="spacebg" x2="0" y2="1">
              <stop stopColor="#191728" />
              <stop offset="1" stopColor="#0b1420" />
            </linearGradient>
          </defs>
          <rect width="320" height="400" fill="url(#spacebg)" />
          {Array.from({ length: 30 }, (_, i) => (
            <circle
              key={i}
              cx={(i * 73) % 320}
              cy={(i * 113) % 400}
              r={i % 3 === 0 ? 1.5 : 0.7}
              fill="#8289af"
              opacity=".6"
            />
          ))}
          <circle cx="263" cy="74" r="29" fill="#302b50" />
          <ellipse
            cx="263"
            cy="74"
            rx="44"
            ry="10"
            transform="rotate(-25 263 74)"
            fill="none"
            stroke="#61508d"
            strokeWidth="3"
          />
          {s.pipes.map((p, i) => (
            <g key={i}>
              <rect x={p.x} width="48" y="0" height={p.gap - 62} rx="5" fill="#7760a5" />
              <rect x={p.x - 4} y={p.gap - 72} width="56" height="10" rx="3" fill="#b7a1ec" />
              <rect
                x={p.x}
                y={p.gap + 62}
                width="48"
                height={400 - p.gap - 62}
                rx="5"
                fill="#7760a5"
              />
              <rect x={p.x - 4} y={p.gap + 62} width="56" height="10" rx="3" fill="#b7a1ec" />
            </g>
          ))}
          <g transform={`translate(85 ${s.y}) rotate(${Math.max(-25, Math.min(55, s.vy * 7))})`}>
            <path d="M-15 4L-25 0L-15 -4" fill="#ffac75" />
            <ellipse rx="15" ry="11" fill="#c3f75c" />
            <ellipse cx="7" cy="-2" rx="7" ry="5" fill="#253340" />
            <circle cx="9" cy="-3" r="2" fill="#6fe3e8" />
          </g>
        </svg>
        {!running && (
          <div className="fly-message">
            <strong>{s.over ? "Flight ended" : "Orbit Hopper"}</strong>
            <span>
              {s.over
                ? `${s.score} gates cleared. Hit New game to retry.`
                : "Tap here or press space to fly"}
            </span>
          </div>
        )}
      </button>
      <p className="game-status">Tap to boost. Coast through the gates. Stay in orbit.</p>
      <button className="center-start" onClick={flap} disabled={s.over}>
        <ArrowUp size={16} /> Boost / flap
      </button>
    </>
  );
}
