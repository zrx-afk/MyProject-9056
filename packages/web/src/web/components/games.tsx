import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, RotateCcw } from "lucide-react";
import { shuffle, slide, spawn, useSaved } from "../lib/game-utils";

export function Reset({ onClick }: { onClick: () => void }) {
  return (
    <button className="reset-button" onClick={onClick}>
      <RotateCcw size={15} /> New game
    </button>
  );
}
export function Directions({ move }: { move: (d: number) => void }) {
  return (
    <div className="directions">
      {[ArrowLeft, ArrowUp, ArrowDown, ArrowRight].map((Icon, i) => (
        <button
          key={i}
          aria-label={["Move left", "Move up", "Move down", "Move right"][i]}
          onClick={() => move([0, 2, 3, 1][i])}
        >
          <Icon size={18} />
        </button>
      ))}
    </div>
  );
}
export function Game2048() {
  const fresh = () => ({ board: spawn(spawn(Array(16).fill(0))), score: 0 });
  const [state, set] = useSaved("2048", fresh);
  const [best, setBest] = useSaved("best", () => 0);
  const start = useRef<[number, number] | null>(null);
  const move = useCallback((d: number) =>
    set((s) => {
      const n = slide(s.board, d);
      if (!n.changed) return s;
      const score = s.score + n.score;
      setBest((b) => Math.max(b, score));
      return { board: spawn(n.board), score };
    }), [set, setBest]);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.matches("input,textarea") || document.querySelector("dialog[open]")) return;
      const d = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].indexOf(e.key);
      if (d >= 0) {
        e.preventDefault();
        move(d);
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [move]);
  const over = [0, 1, 2, 3].every((d) => !slide(state.board, d).changed);
  return (
    <>
      <div className="game-toolbar">
        <div className="scores">
          <div>
            <span>SCORE</span>
            <strong>{state.score}</strong>
          </div>
          <div>
            <span>BEST</span>
            <strong>{best}</strong>
          </div>
        </div>
        <Reset onClick={() => set(fresh())} />
      </div>
      <div
        className="board2048"
        aria-label="2048 game board"
        onPointerDown={(e) => (start.current = [e.clientX, e.clientY])}
        onPointerUp={(e) => {
          if (!start.current) return;
          const dx = e.clientX - start.current[0],
            dy = e.clientY - start.current[1];
          if (Math.max(Math.abs(dx), Math.abs(dy)) > 20)
            move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 1 : 0) : dy > 0 ? 3 : 2);
          start.current = null;
        }}
      >
        {state.board.map((v, i) => (
          <div className={`tile tile-${v}`} key={i}>
            {v || ""}
          </div>
        ))}
      </div>
      <div className="game-status">
        {over
          ? "No moves left. Start a fresh game."
          : state.board.includes(2048)
            ? "You reached 2048! Keep going."
            : "A little focus. A little forward motion."}
      </div>
      <Directions move={move} />
    </>
  );
}
export function TicTacToe() {
  const [board, set] = useSaved<(string | null)[]>("tic", () => Array(9).fill(null));
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  const line = lines.find(
    (l) => board[l[0]] && board[l[0]] === board[l[1]] && board[l[0]] === board[l[2]],
  );
  const player = board.filter(Boolean).length % 2 ? "O" : "X";
  return (
    <>
      <div className="game-toolbar">
        <span className="pill">Two players · same device</span>
        <Reset onClick={() => set(Array(9).fill(null))} />
      </div>
      <div className="tic-board">
        {board.map((v, i) => (
          <button
            className={line?.includes(i) ? "winning" : ""}
            key={i}
            aria-label={`Cell ${i + 1}, ${v || "empty"}`}
            onClick={() => {
              if (!v && !line) set((b) => b.map((x, j) => (i === j ? player : x)));
            }}
          >
            {v}
          </button>
        ))}
      </div>
      <p className="game-status">
        {line
          ? `${board[line[0]]} wins. Nicely played!`
          : board.every(Boolean)
            ? "A draw. Another round?"
            : `${player}’s turn — choose an empty square.`}
      </p>
    </>
  );
}
const symbols = ["✦", "●", "▲", "◆", "☀", "♥", "☾", "✿"];
export function Memory() {
  const fresh = () => ({
    cards: shuffle([...symbols, ...symbols]),
    matched: [] as number[],
    moves: 0,
  });
  const [s, set] = useSaved("memory", fresh);
  const [open, show] = useState<number[]>([]);
  useEffect(() => {
    if (open.length !== 2) return;
    const [a, b] = open;
    const timer = setTimeout(() => {
      if (s.cards[a] === s.cards[b]) set((v) => ({ ...v, matched: [...v.matched, a, b] }));
      show([]);
    }, 650);
    return () => clearTimeout(timer);
  }, [open, s.cards, set]);
  return (
    <>
      <div className="game-toolbar">
        <span className="pill">
          {s.moves} moves · {s.matched.length / 2}/8 pairs
        </span>
        <Reset
          onClick={() => {
            set(fresh());
            show([]);
          }}
        />
      </div>
      <div className="memory-board">
        {s.cards.map((v, i) => (
          <button
            key={i}
            aria-label={
              s.matched.includes(i) || open.includes(i)
                ? `Card ${i + 1}: ${v}`
                : `Reveal card ${i + 1}`
            }
            className={s.matched.includes(i) ? "matched" : open.includes(i) ? "revealed" : ""}
            onClick={() => {
              if (open.length < 2 && !open.includes(i) && !s.matched.includes(i)) {
                show([...open, i]);
                if (open.length === 1) set((v) => ({ ...v, moves: v.moves + 1 }));
              }
            }}
          >
            {s.matched.includes(i) || open.includes(i) ? v : <span className="card-back">✦</span>}
          </button>
        ))}
      </div>
      <p className="game-status">
        {s.matched.length === 16
          ? "All paired up. Beautifully remembered."
          : "Turn over two cards. Find their match."}
      </p>
    </>
  );
}
function mineFresh() {
  return {
    mines: shuffle(Array.from({ length: 64 }, (_, i) => i)).slice(0, 10),
    open: [] as number[],
    flags: [] as number[],
    lost: false,
    started: false,
  };
}
const neighbors = (i: number) =>
  Array.from({ length: 64 }, (_, j) => j).filter(
    (j) =>
      j !== i &&
      Math.abs(Math.floor(j / 8) - Math.floor(i / 8)) <= 1 &&
      Math.abs((j % 8) - (i % 8)) <= 1,
  );
export function Minesweeper() {
  const [s, set] = useSaved("mines", mineFresh);
  const [flag, setFlag] = useState(false);
  const won = s.open.length === 54 && !s.lost;
  const tap = (i: number, mark = false) => {
    if (s.lost || won || s.open.includes(i)) return;
    if (mark) {
      set((v) => ({
        ...v,
        flags: v.flags.includes(i) ? v.flags.filter((x) => x !== i) : [...v.flags, i],
      }));
      return;
    }
    if (s.flags.includes(i)) return;
    set((v) => {
      let mines = [...v.mines];
      if (!v.started && mines.includes(i)) {
        mines = mines.filter((x) => x !== i);
        mines.push(
          Array.from({ length: 64 }, (_, j) => j).find((j) => j !== i && !mines.includes(j))!,
        );
      }
      if (mines.includes(i)) return { ...v, mines, lost: true, started: true };
      const seen = new Set(v.open),
        queue = [i];
      while (queue.length) {
        const n = queue.pop()!;
        if (seen.has(n) || v.flags.includes(n)) continue;
        seen.add(n);
        if (!neighbors(n).some((x) => mines.includes(x)))
          queue.push(...neighbors(n).filter((x) => !mines.includes(x) && !seen.has(x)));
      }
      return { ...v, mines, open: [...seen], started: true };
    });
  };
  return (
    <>
      <div className="game-toolbar">
        <button className={`reset-button ${flag ? "active" : ""}`} onClick={() => setFlag(!flag)}>
          {flag ? "Flag mode on" : "Flag mode off"} · {10 - s.flags.length}
        </button>
        <Reset onClick={() => set(mineFresh())} />
      </div>
      <div className="mine-board">
        {Array.from({ length: 64 }, (_, i) => {
          const count = neighbors(i).filter((x) => s.mines.includes(x)).length;
          return (
            <button
              key={i}
              className={`${s.open.includes(i) ? "opened" : ""} number-${count}`}
              aria-label={`Square ${i + 1}${s.flags.includes(i) ? ", flagged" : ""}`}
              onContextMenu={(e) => {
                e.preventDefault();
                tap(i, true);
              }}
              onClick={() => tap(i, flag)}
            >
              {s.lost && s.mines.includes(i)
                ? "✹"
                : s.flags.includes(i)
                  ? "⚑"
                  : s.open.includes(i)
                    ? count || ""
                    : ""}
            </button>
          );
        })}
      </div>
      <p className="game-status">
        {s.lost
          ? "Found a mine. A fresh field awaits."
          : won
            ? "Field cleared. Excellent detective work."
            : "Clear the field. Toggle flag mode to mark a mine."}
      </p>
    </>
  );
}
const solved = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";
const puzzle = "530070000600195000098000060800060003400803001700020006060000280000419005000080079";
export function Sudoku() {
  const [board, set] = useSaved("sudoku", () => puzzle.split("").map(Number));
  const [selected, select] = useState<number | null>(null);
  const [check, checking] = useState(false);
  const enter = useCallback((n: number) => {
    if (selected !== null && !Number(puzzle[selected]))
      set((b) => b.map((v, i) => (i === selected ? n : v)));
  }, [selected, set]);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.matches("input,textarea") || document.querySelector("dialog[open]")) return;
      if (/^[1-9]$/.test(e.key)) enter(Number(e.key));
      else if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        enter(0);
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [enter]);
  const won = board.join("") === solved;
  return (
    <>
      <div className="game-toolbar">
        <button className="reset-button" onClick={() => checking(!check)}>
          {check ? "Hide check" : "Check entries"}
        </button>
        <Reset
          onClick={() => {
            set(puzzle.split("").map(Number));
            checking(false);
            select(null);
          }}
        />
      </div>
      <div className="sudoku-board">
        {board.map((v, i) => (
          <button
            key={i}
            aria-label={`Row ${Math.floor(i / 9) + 1}, column ${(i % 9) + 1}, ${v || "empty"}`}
            className={`${puzzle[i] !== "0" ? "given" : ""} ${selected === i ? "selected" : ""} ${check && v && v !== Number(solved[i]) ? "incorrect" : ""}`}
            onClick={() => select(i)}
          >
            {v || ""}
          </button>
        ))}
      </div>
      <div className="number-pad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => (
          <button aria-label={n ? `Enter ${n}` : "Erase cell"} onClick={() => enter(n)} key={n}>
            {n || "×"}
          </button>
        ))}
      </div>
      <p className="game-status">
        {won
          ? "Every number in its place. You solved it!"
          : "Select a cell, then a number. Fill each row, column & box."}
      </p>
    </>
  );
}
const words = [
  "PEACE",
  "PAUSE",
  "GREEN",
  "LIGHT",
  "BLOOM",
  "QUIET",
  "CLOUD",
  "FRESH",
  "EARTH",
  "OCEAN",
  "PLANT",
  "DREAM",
];
export function WordPuzzle() {
  const fresh = () => ({
    answer: words[Math.floor(Math.random() * words.length)],
    guesses: [] as string[],
  });
  const [s, set] = useSaved("word", fresh);
  const [entry, input] = useState("");
  const [message, msg] = useState("");
  const won = s.guesses.includes(s.answer),
    over = won || s.guesses.length >= 6;
  const submit = () => {
    if (over) return;
    if (!/^[A-Z]{5}$/.test(entry)) {
      msg("Enter five letters.");
      return;
    }
    set((v) => ({ ...v, guesses: [...v.guesses, entry] }));
    input("");
    msg("");
  };
  const colors = (guess: string) => {
    const c = Array(5).fill("absent"),
      a = s.answer.split("");
    guess.split("").forEach((v, i) => {
      if (v === a[i]) {
        c[i] = "correct";
        a[i] = "";
      }
    });
    guess.split("").forEach((v, i) => {
      if (c[i] === "correct") return;
      const j = a.indexOf(v);
      if (j >= 0) {
        c[i] = "present";
        a[j] = "";
      }
    });
    return c;
  };
  return (
    <>
      <div className="game-toolbar">
        <span className="pill">Five letters · six chances</span>
        <Reset
          onClick={() => {
            set(fresh());
            input("");
            msg("");
          }}
        />
      </div>
      <div className="word-board">
        {Array.from({ length: 6 }, (_, r) =>
          Array.from({ length: 5 }, (_, c) => (
            <div key={`${r}-${c}`} className={s.guesses[r] ? colors(s.guesses[r])[c] : ""}>
              {s.guesses[r]?.[c] || (r === s.guesses.length ? entry[c] : "")}
            </div>
          )),
        )}
      </div>
      <form
        className="word-form"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <input
          aria-label="Five-letter guess"
          placeholder="Your five-letter guess"
          maxLength={5}
          value={entry}
          disabled={over}
          autoComplete="off"
          onChange={(e) => input(e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))}
        />
        <button disabled={over} type="submit">
          Guess
        </button>
      </form>
      <p className="game-status">
        {won
          ? "You found it. A lovely little victory."
          : over
            ? `The word was ${s.answer}. Try a new one.`
            : message || "A calming word. Green: right spot. Gold: wrong spot."}
      </p>
    </>
  );
}
