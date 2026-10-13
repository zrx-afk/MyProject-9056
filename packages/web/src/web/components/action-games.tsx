import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { Directions, Reset } from "./games";

type Point = { x: number; y: number };
function foodFor(snake: Point[]): Point {
  const empty = Array.from({ length: 256 }, (_, i) => ({
    x: i % 16,
    y: Math.floor(i / 16),
  })).filter((p) => !snake.some((s) => s.x === p.x && s.y === p.y));
  return empty[Math.floor(Math.random() * empty.length)] || { x: -1, y: -1 };
}
export function Snake() {
  const initial = () => ({
    snake: [
      { x: 7, y: 8 },
      { x: 6, y: 8 },
      { x: 5, y: 8 },
    ],
    food: { x: 11, y: 8 },
    score: 0,
    over: false,
  });
  const [s, set] = useState(initial);
  const [running, run] = useState(false);
  const dir = useRef(1),
    queued = useRef(1);
  const move = (d: number) => {
    if (
      (d === 0 && dir.current === 1) ||
      (d === 1 && dir.current === 0) ||
      (d === 2 && dir.current === 3) ||
      (d === 3 && dir.current === 2)
    )
      return;
    queued.current = d;
  };
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.matches("input,textarea") || document.querySelector("dialog[open]")) return;
      const d = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].indexOf(e.key);
      if (d >= 0) {
        e.preventDefault();
        move(d);
      }
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        run((v) => !v);
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);
  useEffect(() => {
    if (!running || s.over) return;
    const timer = setInterval(
      () =>
        set((v) => {
          dir.current = queued.current;
          const d = dir.current;
          const head = {
            x: v.snake[0].x + (d === 0 ? -1 : d === 1 ? 1 : 0),
            y: v.snake[0].y + (d === 2 ? -1 : d === 3 ? 1 : 0),
          };
          const eat = head.x === v.food.x && head.y === v.food.y;
          const body = eat ? v.snake : v.snake.slice(0, -1);
          if (
            head.x < 0 ||
            head.x > 15 ||
            head.y < 0 ||
            head.y > 15 ||
            body.some((p) => p.x === head.x && p.y === head.y)
          ) {
            run(false);
            return { ...v, over: true };
          }
          const snake = [head, ...v.snake];
          if (!eat) snake.pop();
          if (snake.length === 256) {
            run(false);
            return { ...v, snake, score: v.score + 10, over: true };
          }
          return {
            ...v,
            snake,
            food: eat ? foodFor(snake) : v.food,
            score: v.score + (eat ? 10 : 0),
          };
        }),
      150,
    );
    return () => clearInterval(timer);
  }, [running, s.over]);
  useEffect(() => {
    const hide = () => {
      if (document.hidden) run(false);
    };
    document.addEventListener("visibilitychange", hide);
    return () => document.removeEventListener("visibilitychange", hide);
  }, []);
  return (
    <>
      <div className="game-toolbar">
        <span className="pill">Score {s.score}</span>
        <div className="toolbar-actions">
          <button className="reset-button" disabled={s.over} onClick={() => run(!running)}>
            {running ? <Pause size={15} /> : <Play size={15} />} {running ? "Pause" : "Play"}
          </button>
          <Reset
            onClick={() => {
              set(initial());
              run(false);
              dir.current = 1;
              queued.current = 1;
            }}
          />
        </div>
      </div>
      <div className="action-board">
        <svg viewBox="0 0 320 320" aria-label="Snake game field">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#314253" strokeWidth=".5" />
            </pattern>
          </defs>
          <rect width="320" height="320" fill="url(#grid)" />
          <circle cx={s.food.x * 20 + 10} cy={s.food.y * 20 + 10} r="7" fill="#ffab83" />
          {s.snake.map((p, i) => (
            <rect
              key={i}
              x={p.x * 20 + 1}
              y={p.y * 20 + 1}
              width="18"
              height="18"
              rx="5"
              fill={i ? "#a0c855" : "#c3f75c"}
            />
          ))}
        </svg>
        {!running && (
          <div className="field-overlay">
            <span>{s.over ? "A little detour. Try again." : "Ready when you are."}</span>
            {!s.over && (
              <button onClick={() => run(true)}>
                <Play size={16} /> {s.score ? "Resume" : "Start playing"}
              </button>
            )}
          </div>
        )}
      </div>
      <p className="game-status">Collect the peach dots. Leave yourself room to grow.</p>
      <Directions move={move} />
    </>
  );
}
type BreakState = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  paddle: number;
  bricks: boolean[];
  score: number;
  lives: number;
  over: boolean;
};
const freshBreak = (): BreakState => ({
  x: 200,
  y: 260,
  vx: 2.8,
  vy: -3.5,
  paddle: 200,
  bricks: Array(32).fill(true),
  score: 0,
  lives: 3,
  over: false,
});
export function Breakout() {
  const [s, set] = useState(freshBreak);
  const [running, run] = useState(false);
  const state = useRef(s);
  const keys = useRef(new Set<string>());

  state.current = s;

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.matches("input,textarea") || document.querySelector("dialog[open]")) return;
      if (["ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
        keys.current.add(e.key);
        if (e.key === " " && !e.repeat) run((v) => !v);
      }
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    const blur = () => {
      keys.current.clear();
      run(false);
    };
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, []);
  useEffect(() => {
    if (!running || s.over) return;
    const timer = setInterval(() => {
      let v = { ...state.current, bricks: [...state.current.bricks] };
      if (keys.current.has("ArrowLeft")) v.paddle = Math.max(38, v.paddle - 6);
      if (keys.current.has("ArrowRight")) v.paddle = Math.min(362, v.paddle + 6);
      v.x += v.vx;
      v.y += v.vy;
      if (v.x < 7) {
        v.x = 7;
        v.vx = Math.abs(v.vx);
      }
      if (v.x > 393) {
        v.x = 393;
        v.vx = -Math.abs(v.vx);
      }
      if (v.y < 7) {
        v.y = 7;
        v.vy = Math.abs(v.vy);
      }
      for (let i = 0; i < 32; i++) {
        const x = 16 + (i % 8) * 46,
          y = 35 + Math.floor(i / 8) * 24;
        if (v.bricks[i] && v.x + 6 > x && v.x - 6 < x + 42 && v.y + 6 > y && v.y - 6 < y + 18) {
          v.bricks[i] = false;
          v.score += 10;
          v.vy *= -1;
          break;
        }
      }
      if (v.vy > 0 && v.y >= 294 && v.y <= 305 && Math.abs(v.x - v.paddle) < 44) {
        v.y = 294;
        v.vy = -Math.abs(v.vy);
        v.vx = (v.x - v.paddle) / 12;
      }
      if (v.y > 328) {
        v.lives--;
        v.x = v.paddle;
        v.y = 260;
        v.vy = -3.5;
        v.vx = 2.8;
        run(false);
        if (!v.lives) v.over = true;
      }
      if (v.bricks.every((b) => !b)) {
        v.over = true;
        run(false);
      }
      state.current = v;
      set(v);
    }, 16);
    return () => clearInterval(timer);
  }, [running, s.over]);
  const paddle = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const p = Math.max(38, Math.min(362, ((e.clientX - rect.left) / rect.width) * 400));
    set((v) => ({ ...v, paddle: p }));
  };
  return (
    <>
      <div className="game-toolbar">
        <span className="pill">
          {s.score} points · {s.lives} lives
        </span>
        <div className="toolbar-actions">
          <button className="reset-button" disabled={s.over} onClick={() => run(!running)}>
            {running ? <Pause size={15} /> : <Play size={15} />} {running ? "Pause" : "Play"}
          </button>
          <Reset
            onClick={() => {
              set(freshBreak());
              state.current = freshBreak();
              run(false);
            }}
          />
        </div>
      </div>
      <div className="action-board breakout-board">
        <svg
          viewBox="0 0 400 330"
          onPointerMove={paddle}
          onPointerDown={(e) => {
            paddle(e);
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
         
          aria-label="Breakout game field"
        >
          {s.bricks.map(
            (b, i) =>
              b && (
                <rect
                  key={i}
                  x={16 + (i % 8) * 46}
                  y={35 + Math.floor(i / 8) * 24}
                  width="42"
                  height="18"
                  rx="4"
                  fill={["#a392ff", "#8aa0dd", "#6fe3e8", "#ffab83"][Math.floor(i / 8)]}
                />
              ),
          )}
          <circle cx={s.x} cy={s.y} r="6" fill="#c3f75c" />
          <rect x={s.paddle - 38} y="300" width="76" height="9" rx="4.5" fill="#c3f75c" />
        </svg>
        {!running && (
          <div className="field-overlay">
            <span>
              {s.over
                ? s.lives
                  ? "A clean sweep. Well played!"
                  : "Out of lives. Try a fresh game."
                : "A satisfying little clear-out."}
            </span>
            {!s.over && (
              <button onClick={() => run(true)}>
                <Play size={16} /> {s.score ? "Continue" : "Start playing"}
              </button>
            )}
          </div>
        )}
      </div>
      <p className="game-status">Move your pointer, drag, or use the arrows to guide the paddle.</p>
      <div className="directions">
        <button
          aria-label="Paddle left"
          onPointerDown={() => keys.current.add("ArrowLeft")}
          onPointerUp={() => keys.current.delete("ArrowLeft")}
          onPointerLeave={() => keys.current.delete("ArrowLeft")}
          onClick={() => set((v) => ({ ...v, paddle: Math.max(38, v.paddle - 22) }))}
        >
          ←
        </button>
        <button
          aria-label="Paddle right"
          onPointerDown={() => keys.current.add("ArrowRight")}
          onPointerUp={() => keys.current.delete("ArrowRight")}
          onPointerLeave={() => keys.current.delete("ArrowRight")}
          onClick={() => set((v) => ({ ...v, paddle: Math.min(362, v.paddle + 22) }))}
        >
          →
        </button>
      </div>
    </>
  );
}
