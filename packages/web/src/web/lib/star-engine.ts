export type Dot = { x: number; y: number };
export type Enemy = Dot & { id: number; hp: number };
export type StarState = {
  x: number;
  enemies: Enemy[];
  shots: Dot[];
  danger: Dot[];
  pickups: Dot[];
  wave: number;
  score: number;
  lives: number;
  direction: number;
  fire: number;
  enemyFire: number;
  power: number;
  invulnerable: number;
  kills: number;
  over: boolean;
  won: boolean;
};
export function enemyWave(wave: number): Enemy[] {
  return Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: 45 + (i % 6) * 42,
    y: 48 + Math.floor(i / 6) * 34,
    hp: wave >= 4 && i < 6 ? 2 : 1,
  }));
}
export function freshStar(): StarState {
  return {
    x: 150,
    enemies: enemyWave(1),
    shots: [],
    danger: [],
    pickups: [],
    wave: 1,
    score: 0,
    lives: 3,
    direction: 1,
    fire: 0,
    enemyFire: 0.8,
    power: 0,
    invulnerable: 0,
    kills: 0,
    over: false,
    won: false,
  };
}
export function stepStar(
  old: StarState,
  dt: number,
  steer: number,
  random = Math.random,
): StarState {
  if (old.over) return old;
  const s = {
    ...old,
    enemies: old.enemies.map((e) => ({ ...e })),
    shots: old.shots.map((p) => ({ ...p })),
    danger: old.danger.map((p) => ({ ...p })),
    pickups: old.pickups.map((p) => ({ ...p })),
  };
  s.x = Math.max(18, Math.min(282, s.x + steer * 210 * dt));
  s.fire -= dt;
  s.enemyFire -= dt;
  s.power = Math.max(0, s.power - dt);
  s.invulnerable = Math.max(0, s.invulnerable - dt);
  if (s.fire <= 0) {
    s.shots.push({ x: s.x, y: 353 });
    if (s.power > 0) s.shots.push({ x: s.x - 12, y: 359 }, { x: s.x + 12, y: 359 });
    s.fire = 0.23;
  }
  for (const p of s.shots) p.y -= 340 * dt;
  for (const p of s.danger) p.y += (120 + s.wave * 14) * dt;
  for (const p of s.pickups) p.y += 75 * dt;
  for (const e of s.enemies) e.x += s.direction * (14 + s.wave * 5) * dt;
  if (s.enemies.some((e) => e.x < 18 || e.x > 282)) {
    s.direction *= -1;
    for (const e of s.enemies) {
      e.x = Math.max(18, Math.min(282, e.x));
      e.y += 14;
    }
  }
  if (s.enemyFire <= 0 && s.enemies.length) {
    const e = s.enemies[Math.floor(random() * s.enemies.length)];
    s.danger.push({ x: e.x, y: e.y + 14 });
    s.enemyFire = Math.max(0.22, 0.95 - s.wave * 0.12);
  }
  for (const shot of s.shots) {
    const e = s.enemies.find(
      (e) => e.hp > 0 && Math.abs(e.x - shot.x) < 15 && Math.abs(e.y - shot.y) < 14,
    );
    if (e) {
      shot.y = -99;
      e.hp--;
      if (!e.hp) {
        s.score += 100;
        s.kills++;
        if (s.kills % 7 === 0) s.pickups.push({ x: e.x, y: e.y });
      }
    }
  }
  s.enemies = s.enemies.filter((e) => e.hp > 0);
  s.shots = s.shots.filter((p) => p.y > 0);
  s.danger = s.danger.filter((p) => p.y < 410);
  for (const p of s.pickups) {
    if (Math.abs(p.x - s.x) < 24 && Math.abs(p.y - 370) < 23) {
      s.power = 8;
      p.y = 999;
      s.score += 50;
    }
  }
  s.pickups = s.pickups.filter((p) => p.y < 410);
  if (s.invulnerable <= 0) {
    const shot = s.danger.find((p) => Math.abs(p.x - s.x) < 17 && Math.abs(p.y - 370) < 17);
    if (shot) {
      shot.y = 999;
      s.lives--;
      s.invulnerable = 1.6;
    }
  }
  if (s.enemies.some((e) => e.y > 332)) {
    s.lives = 0;
  }
  if (s.lives <= 0) {
    s.over = true;
    return s;
  }
  if (!s.enemies.length) {
    s.score += s.wave * 250;
    if (s.wave === 5) {
      s.over = true;
      s.won = true;
    } else {
      s.wave++;
      s.enemies = enemyWave(s.wave);
      s.danger = [];
      s.pickups = [];
      s.shots = [];
      s.direction = 1;
      s.invulnerable = 1.2;
    }
  }
  return s;
}
