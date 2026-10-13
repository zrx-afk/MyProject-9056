# Interlude / Arcade edition
Approved upgrade: 16 playable games, dark modern arcade, neon lime and electric violet/cyan accents, energetic but reduced-motion-aware animation. Responsive web only; managed template retained.

## Visual system
Background #0c0d12, panels #15161e, borders #2a2c38, text #f4f3f8, secondary #9a9dac. Primary acid lime #c3f75c. Accent violet #a392ff, cyan #6fe3e8, peach #ffab83. Poppins UI; bold tightly tracked display. Editorial asymmetry: strong hero with an oversized dimensional game-board illustration, featured play zone, searchable card collection. Self-contained CSS/SVG artwork, not stock images. Technical labels and crisp line icons. Restrained glow, crisp borders, staggered entrances, hover lift.

## Gameplay and UX
Existing eight retained plus Connect Four, Hangman, Simon Says, sliding 15-puzzle, Whack-a-mole, Reaction time, Pong, and Orbit Hopper (Flappy-style). Connect Four and Whack-a-mole have CSS dimensional 3D-style surfaces (not WebGL). Keyboard plus visible touch controls. Browser-local persistence for puzzle states, favorites, recently played and personal records. No accounts, new APIs, database tables, external services or spending. Manual game rotation only. Search, category filters, favorites, surprise-me picker, focus mode, native instructions dialog. Mobile layouts fit 320px and controls remain touch-friendly.

## Files
pages/home.tsx, lib/game-catalog.ts, components/game-art.tsx, components/more-games.tsx, components/reflex-games.tsx, components/motion-games.tsx, styles.css and arcade.css. Existing game components reskinned and keyboard handling guarded for focused input / dialogs.

## Expansion: Star Defender
Add a seventeenth game: neon space shooter, five escalating waves, auto-fire, triple-shot pickup, keyboard and touch steering, pause, three lives and persistent personal best. Preserve layout; derive all counts from catalog. New files: star-defender.tsx and star-engine.ts. No backend changes.

## Block puzzle expansion
Add Block Blast (independent 8x8 block-placement version) and Tetris (independent falling-block version): neon dimensional tiles, touch and keyboard controls, score/best, custom previews. Block Blast has three-piece trays, full-row/column clears, drag-or-tap placement, placement preview and local saved progress. Tetris has seven-piece bag, rotation/wall kicks, ghost, next preview, soft/hard drop, escalating speed, pause and saved best. No backend changes. Total 19; new block-engine.ts, tetris-engine.ts, block-blast.tsx, tetris.tsx.
