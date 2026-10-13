export type BlockPiece = { cells: [number, number][]; color: number };
export const blockShapes: [number, number][][] = [
  [[0, 0]],
  [
    [0, 0],
    [1, 0],
  ],
  [
    [0, 0],
    [1, 0],
    [2, 0],
  ],
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ],
  [
    [0, 0],
    [0, 1],
    [0, 2],
  ],
  [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
  ],
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [0, 1],
    [1, 1],
    [2, 1],
  ],
  [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 2],
    [2, 2],
  ],
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [1, 1],
  ],
  [
    [0, 0],
    [0, 1],
    [1, 1],
  ],
  [
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 1],
  ],
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [0, 1],
    [1, 1],
    [2, 1],
    [0, 2],
    [1, 2],
    [2, 2],
  ],
];
export function blockTray(random = Math.random): (BlockPiece | null)[] {
  return Array.from({ length: 3 }, () => {
    const i = Math.floor(random() * blockShapes.length);
    return { cells: blockShapes[i], color: (i % 7) + 1 };
  });
}
export function canPlaceBlock(board: number[], piece: BlockPiece, x: number, y: number) {
  return piece.cells.every(
    ([dx, dy]) =>
      x + dx >= 0 && x + dx < 8 && y + dy >= 0 && y + dy < 8 && !board[(y + dy) * 8 + x + dx],
  );
}
export function blockFits(board: number[], piece: BlockPiece) {
  return board.some((_, i) => canPlaceBlock(board, piece, i % 8, Math.floor(i / 8)));
}
export function placeBlock(board: number[], piece: BlockPiece, x: number, y: number) {
  if (!canPlaceBlock(board, piece, x, y)) return null;
  const next = [...board];
  for (const [dx, dy] of piece.cells) next[(y + dy) * 8 + x + dx] = piece.color;
  const rows = Array.from({ length: 8 }, (_, r) => r).filter((r) =>
    next.slice(r * 8, r * 8 + 8).every(Boolean),
  );
  const cols = Array.from({ length: 8 }, (_, c) => c).filter((c) =>
    Array.from({ length: 8 }, (_, r) => next[r * 8 + c]).every(Boolean),
  );
  const cleared: number[] = [];
  for (let i = 0; i < 64; i++)
    if (rows.includes(Math.floor(i / 8)) || cols.includes(i % 8)) {
      next[i] = 0;
      cleared.push(i);
    }
  const lines = rows.length + cols.length;
  return {
    board: next,
    cleared,
    lines,
    points: piece.cells.length * 10 + lines * 100 + Math.max(0, lines - 1) * 50,
  };
}
