import "../arcade.css";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Heart,
  HelpCircle,
  Maximize2,
  Minimize2,
  Search,
  Shuffle,
  Sparkles,
  X,
  Zap,
  Clock,
  Keyboard,
  Trophy,
  Layers,
} from "lucide-react";
import { games } from "../lib/game-catalog";
import { useSaved } from "../lib/game-utils";
import { GameArt } from "../components/game-art";

export default function Home() {
  const [active, choose] = useState(games.length - 1),
    [help, showHelp] = useState(false),
    [focus, setFocus] = useState(false),
    [query, search] = useState(""),
    [category, filter] = useState("All games");
  const [favoriteIds, favorite] = useSaved<string[]>("favorites", () => []),
    [recent, setRecent] = useSaved<string[]>("recent", () => []);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (help) dialog.current?.showModal();
  }, [help]);
  const game = games[active],
    Game = game.component;
  const isFavorite = favoriteIds.includes(game.id);
  const select = (n: number, scroll = false) => {
    const index = (n + games.length) % games.length;
    choose(index);
    showHelp(false);
    setRecent((v) => [games[index].id, ...v.filter((id) => id !== games[index].id)].slice(0, 5));
    if (scroll)
      requestAnimationFrame(() =>
        document.getElementById("play")?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
  };
  const surprise = () =>
    select((active + 1 + Math.floor(Math.random() * (games.length - 1))) % games.length, true);
  const visible = games.filter(
    (g) =>
      (category === "All games" ||
        (category === "Favorites" && favoriteIds.includes(g.id)) ||
        category === g.type) &&
      `${g.name} ${g.type} ${g.tag}`.toLowerCase().includes(query.toLowerCase()),
  );
  const toggle = (id: string) =>
    favorite((v) => (v.includes(id) ? v.filter((x) => x !== id) : [...v, id]));
  return (
    <div className={`arcade-site ${focus ? "arcade-focus" : ""}`}>
      <header className="arcade-header">
        <a href="/" className="arcade-brand">
          <span>
            <Gamepad2 size={22} />
          </span>
          interlude<span className="edition">ARCADE</span>
        </a>
        <nav>
          <a href="#play" className="active-nav">
            Play now
          </a>
          <a href="#collection">
            All games <small>{games.length}</small>
          </a>
        </nav>
        <button className="header-shuffle" onClick={surprise}>
          <Shuffle size={15} /> Surprise me
        </button>
      </header>
      <main>
        <section className="arcade-hero">
          <div className="hero-copy">
            <p className="arcade-eyebrow">
              <span className="pulse-dot" /> SMALL GAMES. BIG MAIN-CHARACTER ENERGY.
            </p>
            <h1>
              Less scrolling.
              <br />
              More{" "}
              <span>
                playing<span className="headline-star">✳</span>
              </span>
              .
            </h1>
            <p>
              Your favorite classics. A few new obsessions.
              <br />
              {games.length} instant escapes, one very good arcade.
            </p>
            <div className="hero-buttons">
              <a href="#play" className="lime-button">
                <PlayMark /> Let’s play <ArrowUpRight size={18} />
              </a>
              <button className="outline-button" onClick={surprise}>
                <Shuffle size={16} /> Pick for me
              </button>
            </div>
            <div className="hero-facts">
              <span>
                <Zap size={13} /> Instant play
              </span>
              <span>
                <Keyboard size={13} /> Any screen
              </span>
              <span>
                <Heart size={13} /> Zero downloads
              </span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="floating-chip chip-top">
              <span /> LEVEL UP YOUR DOWNTIME
            </div>
            <div className="hero-game-slab">
              <div className="slab-top">
                <span>THE CLASSICS, REIMAGINED</span>
                <span>01 / {games.length}</span>
              </div>
              <GameArt id="2048" hero />
              <div className="slab-bottom">
                <span>
                  2048<span className="slab-sub">ONE MORE MOVE.</span>
                </span>
                <span className="slab-play">
                  <ArrowUpRight size={24} />
                </span>
              </div>
            </div>
            <div className="floating-chip chip-bottom">
              <Trophy size={16} />
              <span>
                YOUR NEXT PERSONAL BEST
                <br />
                <strong>is one play away.</strong>
              </span>
            </div>
            <span className="hero-cross cross-one">+</span>
            <span className="hero-cross cross-two">+</span>
          </div>
        </section>
        <div className="arcade-marquee">
          <span>
            <Sparkles size={14} /> BUILT FOR YOUR BREAK
          </span>
          <span>{games.length} FREE GAMES</span>
          <span>NO SIGN-UP</span>
          <span>JUST ONE MORE ROUND</span>
          <span>
            <Layers size={14} /> NOW WITH 3D-STYLE BOARDS
          </span>
        </div>
        <section className="featured-section" id="play">
          <div className="section-title">
            <div>
              <p className="arcade-eyebrow">READY, PLAYER YOU</p>
              <h2>Your next obsession.</h2>
            </div>
            <span className="live-label">
              <span /> PLAYABLE RIGHT HERE
            </span>
          </div>
          <div className="featured-layout">
            <article className="arcade-player">
              <div className="player-heading">
                <div>
                  <div className="game-category">
                    <span>{game.type}</span>
                    <span>·</span>
                    <Clock size={12} />
                    {game.time}
                    {["connect", "whack"].includes(game.id) && (
                      <span className="dimension-tag">3D STYLE</span>
                    )}
                  </div>
                  <h2>{game.name}</h2>
                  <p>{game.description}</p>
                </div>
                <div className="player-actions">
                  <button
                    aria-label={isFavorite ? "Remove favorite" : "Favorite this game"}
                    className={isFavorite ? "is-favorite" : ""}
                    onClick={() => toggle(game.id)}
                  >
                    <Heart size={19} fill={isFavorite ? "currentColor" : "none"} />
                  </button>
                  <button
                    aria-label={focus ? "Exit focus mode" : "Enter focus mode"}
                    onClick={() => setFocus(!focus)}
                  >
                    {focus ? <Minimize2 size={19} /> : <Maximize2 size={19} />}
                  </button>
                </div>
              </div>
              <div className={`game-surface theme-${game.id}`} key={game.id}>
                <Game />
              </div>
              <div className="player-bottom">
                <button onClick={() => showHelp(true)}>
                  <HelpCircle size={16} /> How to play
                </button>
                <span>
                  <Keyboard size={14} /> Keyboard + touch
                </span>
                <div className="rotation">
                  <button aria-label="Previous game" onClick={() => select(active - 1)}>
                    <ChevronLeft size={17} />
                  </button>
                  <span>
                    {String(active + 1).padStart(2, "0")} / {games.length}
                  </span>
                  <button aria-label="Next game" onClick={() => select(active + 1)}>
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>
            </article>
            <aside className="up-next">
              <div className="queue-title">
                <h3>Keep the good times going</h3>
                <Shuffle size={16} />
              </div>
              <p>Different mood? Different game.</p>
              {[13, 15, 10, 14]
                .filter((i) => i !== active)
                .slice(0, 3)
                .map((i) => (
                  <button className="queue-game" key={games[i].id} onClick={() => select(i)}>
                    <GameArt id={games[i].id} />
                    <div>
                      <span>
                        {games[i].type}
                        {["connect", "whack"].includes(games[i].id) ? " / 3D STYLE" : ""}
                      </span>
                      <strong>{games[i].name}</strong>
                      <small>{games[i].tag}</small>
                    </div>
                    <span className="queue-arrow">
                      <ArrowUpRight size={18} />
                    </span>
                  </button>
                ))}
              <button className="random-card" onClick={surprise}>
                <span className="random-icon">
                  <Shuffle size={25} />
                </span>
                <strong>Feeling lucky?</strong>
                <span>Let the arcade decide.</span>
                <ArrowRight size={18} />
              </button>
            </aside>
          </div>
        </section>
        <section className="library-section" id="collection">
          <div className="section-title">
            <div>
              <p className="arcade-eyebrow">PICK YOUR NEXT RABBIT HOLE</p>
              <h2>
                All play. No filler<span className="lime-text">.</span>
              </h2>
            </div>
            <label className="game-search">
              <Search size={17} />
              <input
                aria-label="Search games"
                placeholder="Find your game…"
                value={query}
                onChange={(e) => search(e.target.value)}
              />
              {query && (
                <button aria-label="Clear search" onClick={() => search("")}>
                  <X size={15} />
                </button>
              )}
            </label>
          </div>
          <div className="library-tools">
            <div className="category-tabs">
              {[
                "All games",
                "Arcade",
                "Logic",
                "Words",
                "Memory",
                "Reflex",
                "Two players",
                "Favorites",
              ].map((c) => (
                <button
                  key={c}
                  className={category === c ? "selected-tab" : ""}
                  onClick={() => filter(c)}
                >
                  {c === "Favorites" && <Heart size={13} />} {c}
                </button>
              ))}
            </div>
            <span>{visible.length} games</span>
          </div>
          <div className="library-grid">
            {visible.map((g) => (
              <article
                className={`library-card ${game.id === g.id ? "currently-playing" : ""}`}
                key={g.id}
              >
                <button
                  className="card-play"
                  onClick={() => select(games.indexOf(g), true)}
                  aria-label={`Play ${g.name}`}
                >
                  <GameArt id={g.id} />
                  <span className="card-badge">
                    {["connect", "whack"].includes(g.id)
                      ? "3D STYLE"
                      : games.indexOf(g) >= 8
                        ? "NEW"
                        : "CLASSIC"}
                  </span>
                  <span className="card-play-icon">
                    <ArrowUpRight size={21} />
                  </span>
                </button>
                <div className="card-info">
                  <div>
                    <span className="card-category">
                      {g.type} <span>· {g.time}</span>
                    </span>
                    <button onClick={() => select(games.indexOf(g), true)}>
                      <h3>{g.name}</h3>
                    </button>
                    <p>{g.tag}</p>
                  </div>
                  <button
                    className={`card-favorite ${favoriteIds.includes(g.id) ? "is-favorite" : ""}`}
                    aria-label={`${favoriteIds.includes(g.id) ? "Unfavorite" : "Favorite"} ${g.name}`}
                    onClick={() => toggle(g.id)}
                  >
                    <Heart size={17} fill={favoriteIds.includes(g.id) ? "currentColor" : "none"} />
                  </button>
                </div>
              </article>
            ))}
          </div>
          {!visible.length && (
            <div className="empty-library">
              <Search size={28} />
              <h3>{category === "Favorites" ? "Your favorites start here." : "No games found."}</h3>
              <p>
                {category === "Favorites"
                  ? "Tap a heart on any game to save it."
                  : "Try a different search or category."}
              </p>
              <button
                className="outline-button"
                onClick={() => {
                  search("");
                  filter("All games");
                }}
              >
                Show all games
              </button>
            </div>
          )}
          {recent.length > 0 && (
            <div className="recent-row">
              <span>RECENTLY PLAYED</span>
              {recent.map((id) => {
                const g = games.find((x) => x.id === id);
                return g ? (
                  <button key={id} onClick={() => select(games.indexOf(g), true)}>
                    {g.name}
                    <ArrowUpRight size={12} />
                  </button>
                ) : null;
              })}
            </div>
          )}
        </section>
        <section className="arcade-banner">
          <div className="banner-symbol">
            <Zap size={34} />
          </div>
          <div>
            <p className="arcade-eyebrow">YOUR BREAK DESERVES BETTER</p>
            <h2>Go on. One more round.</h2>
            <p>No feeds. No accounts. Just you versus your last best.</p>
          </div>
          <button className="lime-button" onClick={surprise}>
            Find my next game <ArrowUpRight size={17} />
          </button>
        </section>
      </main>
      <footer className="arcade-footer">
        <a href="/" className="arcade-brand">
          <Gamepad2 size={20} /> interlude<span className="edition">ARCADE</span>
        </a>
        <span>Little games. Legendary breaks.</span>
        <a href="#play">
          Back to play <ArrowUpRight size={15} />
        </a>
      </footer>
      {help && (
        <dialog
          ref={dialog}
          className="arcade-dialog"
          onCancel={() => showHelp(false)}
          aria-labelledby="help-title"
        >
          <button
            className="dialog-close"
            aria-label="Close instructions"
            onClick={() => showHelp(false)}
          >
            <X size={20} />
          </button>
          <p className="arcade-eyebrow">QUICK START</p>
          <h2 id="help-title">How to play {game.name}</h2>
          <p>{game.instructions}</p>
          <div className="dialog-note">
            Puzzle progress and personal records stay in this browser. Action games restart when you
            switch games. 3D-style boards use visual depth, not a movable 3D camera.
          </div>
          <button className="lime-button" onClick={() => showHelp(false)}>
            Got it. Let’s play <ArrowRight size={17} />
          </button>
        </dialog>
      )}
    </div>
  );
}
function PlayMark() {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden="true">
      <path d="M2 1L13 8L2 15Z" fill="currentColor" />
    </svg>
  );
}
