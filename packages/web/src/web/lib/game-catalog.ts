import { BlockBlast } from "../components/block-blast";
import { Tetris } from "../components/tetris";
import { StarDefender } from "../components/star-defender";
import { Game2048, Memory, Minesweeper, Sudoku, TicTacToe, WordPuzzle } from "../components/games";
import { Breakout, Snake } from "../components/action-games";
import { ConnectFour, Hangman, SlidingPuzzle } from "../components/more-games";
import { Simon, Whack, Reaction } from "../components/reflex-games";
import { Pong, Flyer } from "../components/motion-games";
export const games = [
  {
    id: "2048",
    name: "2048",
    tag: "A numbers kind of zen",
    type: "Logic",
    time: "5–10 min",
    color: "sage",
    description: "Slide. Combine. Find your flow.",
    instructions:
      "Use the arrow keys, swipe the board, or tap the directional buttons. Matching tiles merge into one. Reach 2048, and keep playing for a new best score.",
    component: Game2048,
  },
  {
    id: "snake",
    name: "Snake",
    tag: "Just one more dot",
    type: "Arcade",
    time: "2–5 min",
    color: "lime",
    description: "Find your rhythm. Keep growing.",
    instructions:
      "Press Play. Use arrow keys or the on-screen directional buttons to steer. Eat peach dots, avoid the walls and your own tail. Space pauses the game.",
    component: Snake,
  },
  {
    id: "memory",
    name: "Memory match",
    tag: "A moment to remember",
    type: "Memory",
    time: "3–5 min",
    color: "peach",
    description: "Little pairs. Lovely discoveries.",
    instructions:
      "Tap any two cards to reveal their symbols. Matching pairs stay face up. Find all eight pairs in as few moves as possible.",
    component: Memory,
  },
  {
    id: "tic",
    name: "Tic-Tac-Toe",
    tag: "Better with a friend",
    type: "Two players",
    time: "1–2 min",
    color: "lavender",
    description: "A small square. A friendly rivalry.",
    instructions:
      "Two players take turns on the same device. X goes first. Tap an empty square. Get three in a row, column, or diagonal to win.",
    component: TicTacToe,
  },
  {
    id: "word",
    name: "Word puzzle",
    tag: "Five letters, endless possibility",
    type: "Words",
    time: "3–5 min",
    color: "butter",
    description: "A few letters. A little lightbulb moment.",
    instructions:
      "Guess a calming five-letter word in six tries. Any five-letter guess is accepted. Green means the correct letter in the correct place; gold means the letter is elsewhere. Gray means absent.",
    component: WordPuzzle,
  },
  {
    id: "mines",
    name: "Minesweeper",
    tag: "Follow your intuition",
    type: "Logic",
    time: "5–10 min",
    color: "blue",
    description: "A little curiosity. A careful next step.",
    instructions:
      "Reveal every safe square on this 8 × 8 field. Numbers show neighboring mines. Toggle Flag mode or right-click to mark suspected mines. Your first revealed square is always safe.",
    component: Minesweeper,
  },
  {
    id: "sudoku",
    name: "Sudoku",
    tag: "Everything in its place",
    type: "Logic",
    time: "10–20 min",
    color: "sand",
    description: "Clear your mind. Fill the possibilities.",
    instructions:
      "Complete this classic starter puzzle. Each row, column, and 3 × 3 box must contain 1–9 exactly once. Select an empty cell, then use the number pad or keyboard. Check entries highlights mistakes.",
    component: Sudoku,
  },
  {
    id: "breakout",
    name: "Breakout",
    tag: "A satisfying little clear-out",
    type: "Arcade",
    time: "3–5 min",
    color: "pink",
    description: "Bounce a little. Let everything go.",
    instructions:
      "Press Play, then move your pointer or drag across the board to guide the paddle. Keyboard arrows and on-screen buttons work too. Clear all 32 bricks before losing three lives. Space pauses.",
    component: Breakout,
  },

  {
    id: "connect",
    name: "Connect Four",
    tag: "Think one move ahead",
    type: "Two players",
    time: "3–5 min",
    color: "violet",
    description: "Four discs. One perfect connection.",
    instructions:
      "Two players share one device. Use the arrow above a column to drop a disc. The first to connect four horizontally, vertically or diagonally wins. The dimensional board is a lightweight 3D-style surface.",
    component: ConnectFour,
  },
  {
    id: "hangman",
    name: "Hangman",
    tag: "Decode the mystery",
    type: "Words",
    time: "2–4 min",
    color: "peach",
    description: "Find the word before your chances run out.",
    instructions:
      "Use the hint and select letters on the on-screen keyboard or type them. You have six incorrect guesses. Reveal every letter to win.",
    component: Hangman,
  },
  {
    id: "simon",
    name: "Simon Says",
    tag: "Your memory, remixed",
    type: "Memory",
    time: "2–5 min",
    color: "violet",
    description: "Watch. Repeat. Level up.",
    instructions:
      "Start a sequence. Watch the glowing pads, then tap them in the same order. Each successful round adds one step. One wrong pad ends the run.",
    component: Simon,
  },
  {
    id: "sliding",
    name: "Sliding puzzle",
    tag: "Every move matters",
    type: "Logic",
    time: "5–15 min",
    color: "blue",
    description: "Fifteen tiles. One satisfying solution.",
    instructions:
      "Tap a tile next to the empty space to slide it. Arrange 1 through 15 left to right, top to bottom, leaving the bottom-right corner empty. Every shuffled board is solvable.",
    component: SlidingPuzzle,
  },
  {
    id: "whack",
    name: "Whack-a-mole",
    tag: "Fast hands. Sneaky moles.",
    type: "Reflex",
    time: "30 sec",
    color: "lime",
    description: "A dimensional playground for your reflexes.",
    instructions:
      "Press Start whacking. Tap a visible mole to score a hit before it disappears. The round lasts thirty seconds. Your personal best is saved in this browser.",
    component: Whack,
  },
  {
    id: "reaction",
    name: "Reaction time",
    tag: "Hold your nerve",
    type: "Reflex",
    time: "10 sec",
    color: "pink",
    description: "Milliseconds make the difference.",
    instructions:
      "Tap the panel to start. Wait until it turns green, then tap immediately. Tapping too soon cancels the attempt. Your lowest time is your personal best.",
    component: Reaction,
  },
  {
    id: "pong",
    name: "Pong",
    tag: "The original rivalry",
    type: "Arcade",
    time: "3–5 min",
    color: "blue",
    description: "You vs. the machine. First to five.",
    instructions:
      "Press Start match. Move or drag vertically to control the left paddle. Up/down arrows or the visible buttons work too. Beat the CPU to five points. Space toggles pause; after each point press Next serve.",
    component: Pong,
  },
  {
    id: "flyer",
    name: "Orbit Hopper",
    tag: "One tap. Infinite altitude.",
    type: "Arcade",
    time: "1–3 min",
    color: "violet",
    description: "Find the gap. Defy gravity.",
    instructions:
      "Tap the flight field, Boost button, or press space/up to flap. Coast through gaps without hitting the gates or screen edges. Each gate earns a point. New game restarts after a crash.",
    component: Flyer,
  },
  {
    id: "star",
    name: "Star Defender",
    tag: "The galaxy needs your reflexes",
    type: "Arcade",
    time: "3–6 min",
    color: "blue",
    description: "Five waves. One ship. A galaxy worth saving.",
    instructions:
      "Launch the mission. Your ship fires automatically. Move the pointer, drag on the battlefield, use Left/Right or A/D, or hold the on-screen arrow buttons to steer. Space toggles pause. Dodge coral enemy shots and collect cyan P power-ups for eight seconds of triple-shot. Clear five waves with three lives. Enemies reaching the bottom end the mission. Best score is saved in this browser.",
    component: StarDefender,
  },
  {
    id: "blast",
    name: "Block Blast",
    tag: "Place it. Clear it. Keep going.",
    type: "Logic",
    time: "5–15 min",
    color: "violet",
    description: "Three shapes. Endless possibilities.",
    instructions:
      "Select a shape from the tray and tap the board cell where its top-left corner should go, or drag the shape onto the board. Pieces cannot overlap or rotate. Fill any complete row or column to clear it. Use all three pieces to get a new tray. The game ends when none of your remaining pieces fits. Multiple line clears earn bonus points. Progress and best score stay in this browser. This is an independent block-placement version.",
    component: BlockBlast,
  },
  {
    id: "tetris",
    name: "Tetris",
    tag: "The ultimate one-more-line game",
    type: "Arcade",
    time: "5–15 min",
    color: "blue",
    description: "Stack smart. Clear lines. Find your rhythm.",
    instructions:
      "Press Start stacking. Left/Right move, Up or X rotates, Down soft-drops, Space instantly drops, and P pauses. Use the visible touch buttons, or tap the board to rotate and swipe sideways to move. Fill a whole row to clear it. The ghost marks your landing position and the Next box previews the next piece. Speed increases every ten lines. The game ends when a new piece cannot spawn. Best score is saved; a new session starts when switching games. This is an independent falling-block version.",
    component: Tetris,
  },
];
