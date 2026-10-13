import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  Pause,
  Play,
  RotateCw,
  Trophy,
} from "lucide-react";
import { Reset } from "./games";
import { useSaved } from "../lib/game-utils";
import {
  actTetris,
  freshTetris,
  ghostY,
  tetrominoes,
  type TetrisAction,
} from "../lib/tetris-engine";

export function Tetris() {
  const [s, set] = useState(freshTetris),
    [running, run] = useState(false),
    [best, setBest] = useSaved("tetris-best", () => 0);
  const state = useRef(s),
    active = useRef(running),
    touch = useRef<{ x: number; y: number } | null>(null);
  state.current = s;
  active.current = running;
  const level = Math.floor(s.lines / 10) + 1;
  const act = useCallback((a: TetrisAction) => {
    if (!active.current || state.current.over) return;
    set((v) => actTetris(v, a));
  }, []);
  const pause = useCallback(() => run(false), []);
  useEffect(() => {
    setBest((v) => Math.max(v, s.score));
  }, [s.score, setBest]);
  useEffect(() => {
    if (!running || s.over) return;
    const t = setInterval(
      () => set((v) => actTetris(v, "tick")),
      Math.max(90, 800 * Math.pow(0.82, level - 1)),
    );
    return () => clearInterval(t);
  }, [running, s.over, level]);
  useEffect(() => {
    if (s.over) run(false);
  }, [s.over]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (
        (e.target as HTMLElement)?.matches("input,textarea") ||
        document.querySelector("dialog[open]")
      )
        return;
      const map: Record<string, TetrisAction> = {
        ArrowLeft: "left",
        ArrowRight: "right",
        ArrowUp: "rotate",
        ArrowDown: "down",
        " ": "drop",
        x: "rotate",
        X: "rotate",
      };
      if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        if (!e.repeat && !state.current.over) run((v) => !v);
        return;
      }
      if (map[e.key]) {
        e.preventDefault();
        if ((e.key === " " || e.key === "ArrowUp") && e.repeat) return;
        act(map[e.key]);
      }
    };
    const hide = () => {
      if (document.hidden) pause();
    };
    window.addEventListener("keydown", key);
    window.addEventListener("blur", pause);
    document.addEventListener("visibilitychange", hide);
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("blur", pause);
      document.removeEventListener("visibilitychange", hide);
    };
  }, [act, pause]);
  const visible = [...s.board],
    ghost = new Set<number>();
  const gy = ghostY(s.board, s.piece);
  s.piece.matrix.forEach((row, dy) =>
    row.forEach((v, dx) => {
      if (v) {
        ghost.add((gy + dy) * 10 + s.piece.x + dx);
        visible[(s.piece.y + dy) * 10 + s.piece.x + dx] = v;
      }
    }),
  );
  const next = tetrominoes[s.queue[0]];
  const reset = () => {
    run(false);
    set(freshTetris());
  };
  const controls: [TetrisAction, string, typeof ArrowLeft][] = [
    ["left", "Move piece left", ArrowLeft],
    ["rotate", "Rotate piece", RotateCw],
    ["right", "Move piece right", ArrowRight],
    ["down", "Soft drop", ArrowDown],
    ["drop", "Hard drop", ArrowDownToLine],
  ];
  return (
    <>
      <div className="game-toolbar">
        <div className="block-scores">
          <span className="pill">{s.score} points</span>
          <span>
            <Trophy size={12} /> Best {best}
          </span>
        </div>
        <div className="toolbar-actions">
          <button className="reset-button" disabled={s.over} onClick={() => run(!running)}>
            {running ? <Pause size={15} /> : <Play size={15} />} {running ? "Pause" : "Play"}
          </button>
          <Reset onClick={reset} />
        </div>
      </div>
      <div className="tetris-layout">
        <div className="tetris-field">
          <div
            className="tetris-board"
            aria-label="Tetris playfield, 10 columns and 20 rows"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              touch.current = { x: e.clientX, y: e.clientY };
            }}
            onPointerUp={(e) => {
              if (!touch.current) return;
              const dx = e.clientX - touch.current.x,
                dy = e.clientY - touch.current.y;
              touch.current = null;
              if (Math.max(Math.abs(dx), Math.abs(dy)) < 15) act("rotate");
              else if (Math.abs(dx) > Math.abs(dy)) act(dx < 0 ? "left" : "right");
              else if (dy > 0) act("down");
            }}
            onPointerCancel={() => (touch.current = null)}
          >
            {visible.map((v, i) => (
              <div
                key={i}
                className={`tetris-cell block-color-${v} ${!v && ghost.has(i) ? "ghost-cell" : ""}`}
                data-value={v}
              />
            ))}
          </div>
          {!running && (
            <div className="field-overlay tetris-overlay">
              <strong>{s.over ? "Stack topped out" : "Tetris"}</strong>
              <span>
                {s.over ? `${s.score} points · ${s.lines} lines` : "Build. Clear. Chase your best."}
              </span>
              <button
                onClick={() => {
                  if (s.over) reset();
                  run(true);
                }}
              >
                <Play size={16} />
                {s.over ? "Play again" : s.score || s.lines ? "Resume game" : "Start stacking"}
              </button>
            </div>
          )}
        </div>
        <aside className="tetris-stats">
          <div className="next-piece-box">
            <span>NEXT</span>
            <div
              className="next-grid"
              style={{ gridTemplateColumns: `repeat(${next[0].length}, 1fr)` }}
            >
              {next.flat().map((v, i) => (
                <i key={i} className={v ? `shape-block block-color-${v}` : "shape-space"} />
              ))}
            </div>
          </div>
          <div>
            <span>LEVEL</span>
            <strong>{level}</strong>
          </div>
          <div>
            <span>LINES</span>
            <strong>{s.lines}</strong>
          </div>
          <div className="tetris-tip">
            <ArrowDownToLine size={17} />
            <small>
              SPACE
              <br />
              Hard drop
            </small>
          </div>
        </aside>
      </div>
      <div className="tetris-controls">
        {controls.map(([a, label, Icon]) => (
          <button key={a} aria-label={label} disabled={!running || s.over} onClick={() => act(a)}>
            <Icon size={19} />
            <span>
              {a === "rotate"
                ? "Rotate"
                : a === "drop"
                  ? "Drop"
                  : a === "down"
                    ? "Down"
                    : a === "left"
                      ? "Left"
                      : "Right"}
            </span>
          </button>
        ))}
      </div>
      <p className="game-status" aria-live="polite">
        {s.over
          ? "Game over. Start again to beat your best."
          : s.cleared
            ? `${s.cleared} ${s.cleared === 1 ? "line" : "lines"} cleared!`
            : "Arrows: move / rotate. Space: hard drop. P: pause."}
      </p>
      <p className="block-hint">
        Ghost shows the landing spot. Clear rows to score. Speed increases every 10 lines.
      </p>
    </>
  );
}
