import { useEffect, useRef, useState } from "react";
import { Grip, Trophy } from "lucide-react";
import { Reset } from "./games";
import { useSaved } from "../lib/game-utils";
import {
  blockFits,
  blockTray,
  canPlaceBlock,
  placeBlock,
  type BlockPiece,
} from "../lib/block-engine";

const fresh = () => ({
  board: Array(64).fill(0) as number[],
  tray: blockTray(),
  score: 0,
  totalLines: 0,
});
export function BlockBlast() {
  const [s, set] = useSaved("block-blast", fresh),
    [best, setBest] = useSaved("block-best", () => 0);
  const [selected, select] = useState<number | null>(null),
    [hover, preview] = useState<number | null>(null),
    [message, msg] = useState("Pick a shape, then tap its top-left position on the board."),
    [flash, flashing] = useState<number[]>([]);
  const skipClick = useRef(false);
  const boardRef = useRef<HTMLDivElement>(null),
    drag = useRef<{ slot: number; x: number; y: number; moved: boolean } | null>(null);
  const over = s.tray.some(Boolean) && s.tray.every((p) => !p || !blockFits(s.board, p));
  const piece = selected === null ? null : s.tray[selected];
  const valid =
    !!piece && hover !== null && canPlaceBlock(s.board, piece, hover % 8, Math.floor(hover / 8));
  const highlighted =
    piece && hover !== null
      ? piece.cells
          .map(([x, y]) => ({ x: (hover % 8) + x, y: Math.floor(hover / 8) + y }))
          .filter((p) => p.x < 8 && p.y < 8)
          .map((p) => p.y * 8 + p.x)
      : [];
  useEffect(() => {
    setBest((b) => Math.max(b, s.score));
  }, [s.score, setBest]);
  useEffect(() => {
    if (!flash.length) return;
    const t = setTimeout(() => flashing([]), 350);
    return () => clearTimeout(t);
  }, [flash]);
  const place = (slot: number, index: number) => {
    const p = s.tray[slot];
    if (!p || over) return;
    const result = placeBlock(s.board, p, index % 8, Math.floor(index / 8));
    if (!result) {
      msg("That shape won’t fit there. Try another position.");
      return;
    }
    const tray = s.tray.map((v, i) => (i === slot ? null : v));
    set({
      ...s,
      board: result.board,
      tray: tray.every((p) => !p) ? blockTray() : tray,
      score: s.score + result.points,
      totalLines: s.totalLines + result.lines,
    });
    flashing(result.cleared);
    select(null);
    preview(null);
    msg(
      result.lines
        ? `${result.lines} ${result.lines === 1 ? "line" : "lines"} blasted! +${result.points} points`
        : `Nice fit. +${result.points} points`,
    );
  };
  const atPoint = (x: number, y: number) => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect || x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) return null;
    const bx = Math.floor(((x - rect.left) / rect.width) * 8),
      by = Math.floor(((y - rect.top) / rect.height) * 8);
    return by * 8 + bx;
  };
  const moveDrag = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!drag.current) return;
    const d = drag.current;
    if (Math.hypot(e.clientX - d.x, e.clientY - d.y) > 8) d.moved = true;
    if (d.moved) preview(atPoint(e.clientX, e.clientY));
  };
  const endDrag = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    if (d.moved) {
      skipClick.current = true;
      const i = atPoint(e.clientX, e.clientY);
      if (i !== null) place(d.slot, i);
      else preview(null);
    }
  };
  return (
    <>
      <div className="game-toolbar">
        <div className="block-scores">
          <span className="pill">{s.score} points</span>
          <span>
            <Trophy size={12} /> Best {best}
          </span>
        </div>
        <Reset
          onClick={() => {
            set(fresh());
            select(null);
            preview(null);
            flashing([]);
            msg("Fresh board. Find your first fit.");
          }}
        />
      </div>
      <div className="blast-meta">
        <span>8 × 8 / NO TIMER</span>
        <span>{s.totalLines} lines cleared</span>
      </div>
      <div
        className="blast-board"
        ref={boardRef}
        onPointerLeave={() => {
          if (!drag.current) preview(null);
        }}
      >
        {s.board.map((v, i) => (
          <button
            key={i}
            className={`blast-cell block-color-${v} ${highlighted.includes(i) ? (valid ? "placement-valid" : "placement-invalid") : ""} ${flash.includes(i) ? "blast-flash" : ""}`}
            aria-label={`Row ${Math.floor(i / 8) + 1}, column ${(i % 8) + 1}, ${v ? "filled" : "empty"}`}
            disabled={over}
            onPointerEnter={() => {
              if (selected !== null) preview(i);
            }}
            onFocus={() => {
              if (selected !== null) preview(i);
            }}
            onClick={() => {
              if (selected === null) msg("Choose a shape from the tray first.");
              else place(selected, i);
            }}
          />
        ))}
      </div>
      <div className="blast-tray-label">
        <Grip size={14} /> THREE SHAPES. MAKE THEM COUNT.
      </div>
      <div className="blast-tray">
        {s.tray.map((p, i) => (
          <button
            key={i}
            className={`blast-piece ${selected === i ? "selected-piece" : ""} ${p && !blockFits(s.board, p) ? "no-fit" : ""}`}
            aria-label={
              p ? `Select shape ${i + 1}, ${p.cells.length} blocks` : `Shape ${i + 1} used`
            }
            aria-pressed={selected === i}
            disabled={!p || over}
            onPointerDown={(e) => {
              if (!p) return;
              select(i);
              preview(null);
              drag.current = { slot: i, x: e.clientX, y: e.clientY, moved: false };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={() => {
              drag.current = null;
              preview(null);
            }}
            onClick={() => {
              if (skipClick.current) {
                skipClick.current = false;
                return;
              }
              if (p) select(i);
            }}
          >
            {p ? <Shape piece={p} /> : <span className="used-shape">✓</span>}
          </button>
        ))}
      </div>
      <p className="game-status" aria-live="polite">
        {over ? "No shapes fit. Game over—start a fresh board!" : message}
      </p>
      <p className="block-hint">
        Fill a whole row or column to clear it. Use all three shapes for a new tray.
      </p>
    </>
  );
}
function Shape({ piece }: { piece: BlockPiece }) {
  const w = Math.max(...piece.cells.map((c) => c[0])) + 1,
    h = Math.max(...piece.cells.map((c) => c[1])) + 1;
  return (
    <span
      className="shape-grid"
      style={{
        gridTemplateColumns: `repeat(${w}, 1fr)`,
        gridTemplateRows: `repeat(${h}, 1fr)`,
        width: w * 19,
        height: h * 19,
      }}
    >
      {Array.from({ length: w * h }, (_, i) => (
        <span
          key={i}
          className={
            piece.cells.some(([x, y]) => x === i % w && y === Math.floor(i / w))
              ? `shape-block block-color-${piece.color}`
              : "shape-space"
          }
        />
      ))}
    </span>
  );
}
