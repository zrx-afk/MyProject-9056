import { useEffect, useState } from "react";

export function useSaved<T>(key: string, initial: () => T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(`interlude-${key}`);
      return stored ? JSON.parse(stored) : initial();
    } catch {
      return initial();
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(`interlude-${key}`, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue] as const;
}
export function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export function spawn(board: number[]) {
  const b = [...board];
  const empty = b.flatMap((v, i) => (v === 0 ? [i] : []));
  if (empty.length)
    b[empty[Math.floor(Math.random() * empty.length)]] = Math.random() < 0.9 ? 2 : 4;
  return b;
}
export function slide(board: number[], direction: number) {
  const out = [...board];
  let score = 0;
  for (let r = 0; r < 4; r++) {
    const ids = Array.from({ length: 4 }, (_, c) =>
      direction === 0
        ? r * 4 + c
        : direction === 1
          ? r * 4 + 3 - c
          : direction === 2
            ? c * 4 + r
            : (3 - c) * 4 + r,
    );
    const vals = ids.map((i) => board[i]).filter(Boolean),
      merged: number[] = [];
    for (let i = 0; i < vals.length; i++) {
      if (vals[i] === vals[i + 1]) {
        merged.push(vals[i] * 2);
        score += vals[i] * 2;
        i++;
      } else merged.push(vals[i]);
    }
    ids.forEach((id, c) => (out[id] = merged[c] || 0));
  }
  return { board: out, score, changed: out.some((v, i) => v !== board[i]) };
}
