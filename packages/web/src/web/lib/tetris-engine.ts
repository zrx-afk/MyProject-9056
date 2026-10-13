import { shuffle } from "./game-utils";
export const tetrominoes = [
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [2, 2],
    [2, 2],
  ],
  [
    [0, 3, 0],
    [3, 3, 3],
    [0, 0, 0],
  ],
  [
    [0, 4, 4],
    [4, 4, 0],
    [0, 0, 0],
  ],
  [
    [5, 5, 0],
    [0, 5, 5],
    [0, 0, 0],
  ],
  [
    [6, 0, 0],
    [6, 6, 6],
    [0, 0, 0],
  ],
  [
    [0, 0, 7],
    [7, 7, 7],
    [0, 0, 0],
  ],
];
export type FallingPiece = { matrix: number[][]; x: number; y: number; kind: number };
export type TetrisState = {
  board: number[];
  piece: FallingPiece;
  queue: number[];
  score: number;
  lines: number;
  over: boolean;
  cleared: number;
};
export function newFalling(kind: number): FallingPiece {
  return {
    kind,
    matrix: tetrominoes[kind].map((r) => [...r]),
    x: Math.floor((10 - tetrominoes[kind][0].length) / 2),
    y: 0,
  };
}
export function freshTetris(): TetrisState {
  const bag = shuffle([0, 1, 2, 3, 4, 5, 6]);
  return {
    board: Array(200).fill(0),
    piece: newFalling(bag[0]),
    queue: bag.slice(1),
    score: 0,
    lines: 0,
    over: false,
    cleared: 0,
  };
}
export function fitsTetris(board: number[], p: FallingPiece) {
  return p.matrix.every((row, dy) =>
    row.every(
      (v, dx) =>
        !v ||
        (p.x + dx >= 0 &&
          p.x + dx < 10 &&
          p.y + dy >= 0 &&
          p.y + dy < 20 &&
          !board[(p.y + dy) * 10 + p.x + dx]),
    ),
  );
}
export function rotateTetris(board: number[], p: FallingPiece) {
  if (p.kind === 1) return p;
  const matrix = p.matrix[0].map((_, i) => p.matrix.map((row) => row[i]).reverse());
  for (const [dx, dy] of [
    [0, 0],
    [-1, 0],
    [1, 0],
    [-2, 0],
    [2, 0],
    [0, -1],
    [0, -2],
  ]) {
    const candidate = { ...p, matrix, x: p.x + dx, y: p.y + dy };
    if (fitsTetris(board, candidate)) return candidate;
  }
  return p;
}
export function ghostY(board: number[], p: FallingPiece) {
  let y = p.y;
  while (fitsTetris(board, { ...p, y: y + 1 })) y++;
  return y;
}
export function lockTetris(s: TetrisState): TetrisState {
  const board = [...s.board];
  for (let dy = 0; dy < s.piece.matrix.length; dy++)
    for (let dx = 0; dx < s.piece.matrix[dy].length; dx++) {
      const v = s.piece.matrix[dy][dx];
      if (v) board[(s.piece.y + dy) * 10 + s.piece.x + dx] = v;
    }
  const rows = Array.from({ length: 20 }, (_, r) => board.slice(r * 10, r * 10 + 10));
  const kept = rows.filter((row) => !row.every(Boolean));
  const cleared = 20 - kept.length;
  const nextBoard = [...Array(cleared * 10).fill(0), ...kept.flat()];
  const queue = [...s.queue];
  if (queue.length < 7) queue.push(...shuffle([0, 1, 2, 3, 4, 5, 6]));
  const piece = newFalling(queue.shift()!);
  const level = Math.floor(s.lines / 10) + 1;
  return {
    ...s,
    board: nextBoard,
    piece,
    queue,
    lines: s.lines + cleared,
    score: s.score + ([0, 100, 300, 500, 800][cleared] || 0) * level,
    cleared,
    over: !fitsTetris(nextBoard, piece),
  };
}
export type TetrisAction = "left" | "right" | "rotate" | "down" | "tick" | "drop";
export function actTetris(s: TetrisState, action: TetrisAction): TetrisState {
  if (s.over) return s;
  if (action === "rotate") return { ...s, piece: rotateTetris(s.board, s.piece), cleared: 0 };
  if (action === "drop") {
    const y = ghostY(s.board, s.piece);
    return lockTetris({ ...s, piece: { ...s.piece, y }, score: s.score + (y - s.piece.y) * 2 });
  }
  const piece = {
    ...s.piece,
    x: s.piece.x + (action === "left" ? -1 : action === "right" ? 1 : 0),
    y: s.piece.y + (action === "down" || action === "tick" ? 1 : 0),
  };
  if (fitsTetris(s.board, piece))
    return { ...s, piece, score: s.score + (action === "down" ? 1 : 0), cleared: 0 };
  return action === "tick" || action === "down" ? lockTetris(s) : s;
}
