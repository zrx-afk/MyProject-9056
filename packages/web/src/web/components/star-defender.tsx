import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play, Shield, Zap } from "lucide-react";
import { Reset } from "./games";
import { useSaved } from "../lib/game-utils";
import { freshStar, stepStar } from "../lib/star-engine";

export function StarDefender() {
  const [s, set] = useState(freshStar),
    [running, run] = useState(false);
  const [best, setBest] = useSaved("star-best", () => 0);
  const state = useRef(s),
    keys = useRef(new Set<string>()),
    field = useRef<HTMLCanvasElement>(null);
  state.current = s;
  const pause = useCallback(() => {
    run(false);
    keys.current.clear();
  }, []);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        (e.target as HTMLElement)?.matches("input,textarea") ||
        document.querySelector("dialog[open]")
      )
        return;
      const key = e.key.toLowerCase();
      if (["arrowleft", "arrowright", "a", "d", " "].includes(key)) {
        e.preventDefault();
        keys.current.add(key);
        if (key === " " && !e.repeat && !state.current.over) run((v) => !v);
      }
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    const hide = () => {
      if (document.hidden) pause();
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", pause);
    document.addEventListener("visibilitychange", hide);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", pause);
      document.removeEventListener("visibilitychange", hide);
    };
  }, [pause]);
  useEffect(() => {
    if (!running || s.over) return;
    let frame = 0,
      last = 0;
    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.04) : 1 / 60;
      last = now;
      const k = keys.current;
      const steer =
        Number(k.has("arrowright") || k.has("d")) - Number(k.has("arrowleft") || k.has("a"));
      const next = stepStar(state.current, dt, steer);
      state.current = next;
      set(next);
      if (next.over) {
        run(false);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, s.over]);
  useEffect(() => {
    setBest((b) => Math.max(b, s.score));
  }, [s.score, setBest]);
  useEffect(() => {
    const canvas = field.current,
      c = canvas?.getContext("2d");
    if (!canvas || !c) return;
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = 300 * scale;
    canvas.height = 410 * scale;
    c.scale(scale, scale);
    c.fillStyle = "#0e1424";
    c.fillRect(0, 0, 300, 410);
    for (let i = 0; i < 50; i++) {
      c.fillStyle = i % 3 === 0 ? "#b2b8d9" : "#434d70";
      c.fillRect((i * 73) % 300, (i * 97) % 400, i % 3 === 0 ? 1.5 : 1, 1.5);
    }
    c.strokeStyle = "#273657";
    c.lineWidth = 1;
    c.beginPath();
    c.arc(270, 90, 38, 0, Math.PI * 2);
    c.stroke();
    c.beginPath();
    c.ellipse(270, 90, 55, 10, -0.4, 0, Math.PI * 2);
    c.stroke();
    for (const e of s.enemies) {
      c.fillStyle = e.hp > 1 ? "#ffab83" : s.wave % 2 ? "#a392ff" : "#6fe3e8";
      c.fillRect(e.x - 10, e.y - 8, 20, 15);
      c.fillRect(e.x - 14, e.y - 3, 5, 13);
      c.fillRect(e.x + 9, e.y - 3, 5, 13);
      c.fillRect(e.x - 7, e.y - 12, 4, 5);
      c.fillRect(e.x + 3, e.y - 12, 4, 5);
      c.fillStyle = "#12182a";
      c.fillRect(e.x - 6, e.y - 3, 4, 4);
      c.fillRect(e.x + 2, e.y - 3, 4, 4);
    }
    c.fillStyle = "#c3f75c";
    for (const p of s.shots) c.fillRect(p.x - 1.5, p.y - 8, 3, 12);
    c.fillStyle = "#ff808e";
    for (const p of s.danger) c.fillRect(p.x - 2, p.y - 6, 4, 10);
    for (const p of s.pickups) {
      c.fillStyle = "#6fe3e8";
      c.beginPath();
      c.moveTo(p.x, p.y - 10);
      c.lineTo(p.x + 9, p.y);
      c.lineTo(p.x, p.y + 10);
      c.lineTo(p.x - 9, p.y);
      c.closePath();
      c.fill();
      c.fillStyle = "#102331";
      c.font = "bold 13px monospace";
      c.textAlign = "center";
      c.fillText("P", p.x, p.y + 4);
    }
    c.save();
    c.globalAlpha = s.invulnerable > 0 ? 0.55 : 1;
    c.fillStyle = "#c3f75c";
    c.beginPath();
    c.moveTo(s.x, 353);
    c.lineTo(s.x + 17, 383);
    c.lineTo(s.x, 376);
    c.lineTo(s.x - 17, 383);
    c.closePath();
    c.fill();
    c.fillStyle = "#6fe3e8";
    c.fillRect(s.x - 3, 364, 6, 9);
    c.fillStyle = "#ffab83";
    if (running) {
      c.beginPath();
      c.moveTo(s.x - 5, 382);
      c.lineTo(s.x, 394);
      c.lineTo(s.x + 5, 382);
      c.fill();
    }
    c.restore();
    if (s.invulnerable > 0) {
      c.strokeStyle = "#6fe3e877";
      c.beginPath();
      c.arc(s.x, 372, 24, 0, Math.PI * 2);
      c.stroke();
    }
  }, [s, running]);
  const steerPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!running) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(18, Math.min(282, ((e.clientX - rect.left) / rect.width) * 300));
    set((v) => {
      const n = { ...v, x };
      state.current = n;
      return n;
    });
  };
  const reset = () => {
    pause();
    const next = freshStar();
    state.current = next;
    set(next);
  };
  return (
    <>
      <div className="game-toolbar star-toolbar">
        <span className="pill">
          {s.score} pts · Best {best}
        </span>
        <div className="toolbar-actions">
          <button
            className="reset-button"
            disabled={s.over}
            onClick={() => (running ? pause() : run(true))}
          >
            {running ? <Pause size={15} /> : <Play size={15} />} {running ? "Pause" : "Play"}
          </button>
          <Reset onClick={reset} />
        </div>
      </div>
      <div className="star-hud">
        <span>
          <Shield size={13} /> {s.lives} lives
        </span>
        <span>WAVE {s.wave} / 5</span>
        <span className={s.power > 0 ? "powered" : ""}>
          <Zap size={13} />
          {s.power > 0 ? `TRIPLE ${Math.ceil(s.power)}s` : "AUTO-FIRE"}
        </span>
      </div>
      <div className="star-field">
        <canvas
          ref={field}
          aria-label={`Star Defender battlefield, ship position ${Math.round(s.x)}, ${s.enemies.length} enemies remaining`}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            steerPointer(e);
          }}
          onPointerMove={steerPointer}
        />
        {!running && (
          <div className="field-overlay star-overlay">
            <div className="star-emblem">
              <Shield size={33} />
            </div>
            <strong>
              {s.over ? (s.won ? "Galaxy defended!" : "Mission ended") : "Star Defender"}
            </strong>
            <span>
              {s.over
                ? `${s.score} points · Wave ${s.wave}`
                : "Five waves. One ship. All you’ve got."}
            </span>
            <button
              onClick={() => {
                if (s.over) reset();
                run(true);
              }}
            >
              <Play size={16} />
              {s.over ? "Fly again" : s.score ? "Resume mission" : "Launch mission"}
            </button>
          </div>
        )}
      </div>
      <p className="game-status" aria-live="polite">
        {s.over
          ? s.won
            ? "All five waves cleared. You are the last star standing."
            : "Try again and beat your best."
          : s.power > 0
            ? "Triple-shot online! Make those eight seconds count."
            : "Move or drag to steer. Auto-fire handles the rest. Collect cyan power-ups."}
      </p>
      <div className="directions">
        {["arrowleft", "arrowright"].map((key, i) => (
          <button
            key={key}
            aria-label={i ? "Steer right" : "Steer left"}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              keys.current.add(key);
            }}
            onPointerUp={() => keys.current.delete(key)}
            onPointerCancel={() => keys.current.delete(key)}
            onClick={() =>
              set((v) => {
                const next = { ...v, x: Math.max(18, Math.min(282, v.x + (i ? 16 : -16))) };
                state.current = next;
                return next;
              })
            }
          >
            {i ? <ArrowRight size={19} /> : <ArrowLeft size={19} />}
          </button>
        ))}
      </div>
    </>
  );
}
