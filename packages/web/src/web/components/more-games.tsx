import { useEffect } from "react";
import { ArrowDown } from "lucide-react";
import { Reset } from "./games";
import { useSaved } from "../lib/game-utils";

export function connectWinner(board: number[]) {
  for (let r = 0; r < 6; r++)
    for (let c = 0; c < 7; c++)
      for (const [dr, dc] of [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, -1],
      ]) {
        const ids = Array.from({ length: 4 }, (_, i) => (r + dr * i) * 7 + c + dc * i);
        if (
          r + dr * 3 < 6 &&
          c + dc * 3 >= 0 &&
          c + dc * 3 < 7 &&
          board[r * 7 + c] &&
          ids.every((i) => board[i] === board[r * 7 + c])
        )
          return ids;
      }
  return null;
}
export function ConnectFour() {
  const [board, set] = useSaved<number[]>("connect", () => Array(42).fill(0));
  const win = connectWinner(board);
  const player = (board.filter(Boolean).length % 2) + 1;
  const over = !!win || board.every(Boolean);
  const drop = (c: number) => {
    if (over) return;
    for (let r = 5; r >= 0; r--) {
      if (!board[r * 7 + c]) {
        set((b) => b.map((v, i) => (i === r * 7 + c ? player : v)));
        break;
      }
    }
  };
  return (
    <>
      <div className="game-toolbar">
        <span className={`pill player-${player}`}>
          Two players · {player === 1 ? "Lime" : "Violet"} to drop
        </span>
        <Reset onClick={() => set(Array(42).fill(0))} />
      </div>
      <div className="connect-stage">
        <div className="connect-arrows">
          {Array.from({ length: 7 }, (_, c) => (
            <button
              key={c}
              aria-label={`Drop in column ${c + 1}`}
              disabled={over || !!board[c]}
              onClick={() => drop(c)}
            >
              <ArrowDown size={19} />
            </button>
          ))}
        </div>
        <div className="connect-board">
          {board.map((v, i) => (
            <div
              key={i}
              className={`connect-hole disc-${v} ${win?.includes(i) ? "win-disc" : ""}`}
              aria-label={`Row ${Math.floor(i / 7) + 1}, column ${(i % 7) + 1}, ${v === 1 ? "lime" : v === 2 ? "violet" : "empty"}`}
            />
          ))}
        </div>
        <div className="connect-foot" />
      </div>
      <p className="game-status" aria-live="polite">
        {win
          ? `${board[win[0]] === 1 ? "Lime" : "Violet"} wins! Four in a row.`
          : over
            ? "A draw. Rematch?"
            : "Drop a disc. Connect four horizontally, vertically, or diagonally."}
      </p>
    </>
  );
}
const hangWords = [
  { word: "GALAXY", clue: "A vast collection of stars" },
  { word: "JOYSTICK", clue: "An arcade controller" },
  { word: "PIXEL", clue: "The smallest piece of a digital image" },
  { word: "NEBULA", clue: "A colorful cloud in space" },
  { word: "ARCADE", clue: "Where high scores live" },
  { word: "ROCKET", clue: "A vehicle headed for the stars" },
  { word: "PORTAL", clue: "A gateway to somewhere else" },
  { word: "COMET", clue: "A cosmic visitor with a tail" },
];
const hangFresh = () => ({
  ...hangWords[Math.floor(Math.random() * hangWords.length)],
  guesses: [] as string[],
});
export function Hangman() {
  const [s, set] = useSaved("hangman", hangFresh);
  const wrong = s.guesses.filter((l) => !s.word.includes(l));
  const won = s.word.split("").every((l) => s.guesses.includes(l)),
    lost = wrong.length >= 6;
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (
        (e.target as HTMLElement)?.matches("input,textarea") ||
        document.querySelector("dialog[open]")
      )
        return;
      const l = e.key.toUpperCase();
      if (/^[A-Z]$/.test(l) && !won && !lost)
        set((v) => (v.guesses.includes(l) ? v : { ...v, guesses: [...v.guesses, l] }));
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [won, lost, set]);
  return (
    <>
      <div className="game-toolbar">
        <span className="pill">{6 - wrong.length} chances left</span>
        <Reset onClick={() => set(hangFresh())} />
      </div>
      <div className="hang-scene">
        <svg viewBox="0 0 220 155" aria-label={`${wrong.length} incorrect guesses`}>
          <path
            d="M30 140 H135 M65 140 V20 H140 V40"
            fill="none"
            stroke="#515769"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {wrong.length > 0 && (
            <circle cx="140" cy="55" r="15" fill="none" stroke="#a392ff" strokeWidth="4" />
          )}
          {wrong.length > 1 && <path d="M140 70 V105" stroke="#a392ff" strokeWidth="4" />}
          {wrong.length > 2 && <path d="M140 80 L120 94" stroke="#a392ff" strokeWidth="4" />}
          {wrong.length > 3 && <path d="M140 80 L160 94" stroke="#a392ff" strokeWidth="4" />}
          {wrong.length > 4 && <path d="M140 105 L122 128" stroke="#a392ff" strokeWidth="4" />}
          {wrong.length > 5 && <path d="M140 105 L158 128" stroke="#a392ff" strokeWidth="4" />}
        </svg>
      </div>
      <p className="hang-clue">HINT / {s.clue}</p>
      <div className="hang-word">
        {s.word.split("").map((l, i) => (
          <span key={i} className={lost && !s.guesses.includes(l) ? "missed" : ""}>
            {s.guesses.includes(l) || lost ? l : "_"}
          </span>
        ))}
      </div>
      <div className="letter-keyboard">
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l) => (
          <button
            key={l}
            className={
              s.guesses.includes(l) ? (s.word.includes(l) ? "right-key" : "wrong-key") : ""
            }
            disabled={s.guesses.includes(l) || won || lost}
            onClick={() => set((v) => ({ ...v, guesses: [...v.guesses, l] }))}
          >
            {l}
          </button>
        ))}
      </div>
      <p className="game-status" aria-live="polite">
        {won
          ? "Decoded. Perfect detective work."
          : lost
            ? `The word was ${s.word}. Try another.`
            : "Choose a letter or type on your keyboard."}
      </p>
    </>
  );
}
function puzzleFresh() {
  let board = Array.from({ length: 16 }, (_, i) => (i + 1) % 16),
    last = -1;
  for (let n = 0; n < 180; n++) {
    const blank = board.indexOf(0);
    const valid = board
      .map((_, i) => i)
      .filter(
        (i) =>
          Math.abs(Math.floor(i / 4) - Math.floor(blank / 4)) + Math.abs((i % 4) - (blank % 4)) ===
            1 && i !== last,
      );
    const i = valid[Math.floor(Math.random() * valid.length)];
    [board[i], board[blank]] = [board[blank], board[i]];
    last = blank;
  }
  return { board, moves: 0 };
}
export function SlidingPuzzle() {
  const [s, set] = useSaved("sliding", puzzleFresh);
  const won = s.board.every((v, i) => v === (i + 1) % 16);
  const tap = (i: number) => {
    const blank = s.board.indexOf(0);
    if (
      won ||
      Math.abs(Math.floor(i / 4) - Math.floor(blank / 4)) + Math.abs((i % 4) - (blank % 4)) !== 1
    )
      return;
    set((v) => {
      const board = [...v.board];
      [board[i], board[blank]] = [board[blank], board[i]];
      return { board, moves: v.moves + 1 };
    });
  };
  return (
    <>
      <div className="game-toolbar">
        <span className="pill">{s.moves} moves</span>
        <Reset onClick={() => set(puzzleFresh())} />
      </div>
      <div className="sliding-board">
        {s.board.map((v, i) => (
          <button
            key={i}
            className={!v ? "blank" : v === i + 1 ? "in-place" : ""}
            aria-label={v ? `Slide tile ${v}` : "Empty space"}
            disabled={!v || won}
            onClick={() => tap(i)}
          >
            {v || ""}
          </button>
        ))}
      </div>
      <p className="game-status" aria-live="polite">
        {won
          ? `All lined up in ${s.moves} moves. You solved it!`
          : "Slide a neighboring tile into the gap. Put 1–15 in order."}
      </p>
      <div className="puzzle-target">
        <span>TARGET</span>
        <div>
          1 2 3 4<br />5 6 7 8<br />9 10 11 12
          <br />
          13 14 15 □
        </div>
      </div>
    </>
  );
}
