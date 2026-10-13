const palettes: Record<string, string> = {
  blast: "#a392ff",
  tetris: "#6fe3e8",
  star: "#6fe3e8",
  snake: "#c3f75c",
  connect: "#a392ff",
  whack: "#c3f75c",
  flyer: "#a392ff",
  pong: "#6fe3e8",
  reaction: "#ffab83",
  memory: "#ffab83",
  word: "#c3f75c",
  simon: "#a392ff",
  sliding: "#6fe3e8",
  sudoku: "#6fe3e8",
  hangman: "#ffab83",
  mines: "#6fe3e8",
  tic: "#a392ff",
  breakout: "#ffab83",
  "2048": "#c3f75c",
};
export function GameArt({ id, hero = false }: { id: string; hero?: boolean }) {
  const accent = palettes[id] || "#c3f75c";
  return (
    <div
      className={`game-art game-art-${id} ${hero ? "hero-art" : ""}`}
      style={{ "--art-accent": accent } as React.CSSProperties}
      aria-hidden="true"
    >
      <svg viewBox="0 0 300 170">
        <defs>
          <radialGradient id={`glow-${id}`}>
            <stop stopColor={accent} stopOpacity=".14" />
            <stop offset="1" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="300" height="170" fill={`url(#glow-${id})`} />
        {id === "blast" || id === "tetris" ? (
          <g transform="translate(93 18) rotate(-7 60 65)">
            <rect x="-6" y="-5" width="126" height="145" rx="9" fill="#182335" stroke="#43526d" />
            {Array.from({ length: 42 }, (_, i) => {
              const colors = ["#293347", "#6fe3e8", "#a392ff", "#ffab83", "#c3f75c"];
              const v =
                id === "blast"
                  ? [
                      0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 1, 0, 0, 3, 3, 1, 0,
                      0, 4, 4, 3, 1, 1, 1, 4, 0, 3, 0, 2, 2, 4, 4, 4,
                    ][i]
                  : [
                      0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                      0, 1, 1, 0, 0, 3, 3, 1, 1, 4, 3, 3, 2, 2, 4, 4,
                    ][i];
              return (
                <rect
                  key={i}
                  x={(i % 6) * 19}
                  y={Math.floor(i / 6) * 19}
                  width="16"
                  height="16"
                  rx="2"
                  fill={colors[v]}
                  stroke={v ? "#ffffff44" : "#ffffff08"}
                />
              );
            })}
          </g>
        ) : id === "star" ? (
          <g>
            <path d="M150 103L169 140L150 131L131 140Z" fill="#c3f75c" />
            <path d="M143 141L150 157L157 141" fill="#ffab83" />
            <rect x="147" y="118" width="6" height="9" fill="#6fe3e8" />
            {[0, 1, 2].map((i) => (
              <g key={i} transform={`translate(${96 + i * 53} 46)`}>
                <path d="M-12 -6H12V8H-12ZM-17 0H-10V13H-17ZM10 0H17V13H10Z" fill="#a392ff" />
                <rect x="-7" y="-2" width="4" height="4" fill="#17182c" />
                <rect x="3" y="-2" width="4" height="4" fill="#17182c" />
              </g>
            ))}
            <path d="M150 75V91M129 86V100M172 85V99" stroke="#c3f75c" strokeWidth="3" />
            <path d="M96 72V84M202 74V86" stroke="#ff808e" strokeWidth="3" />
          </g>
        ) : ["2048", "sliding", "sudoku"].includes(id) ? (
          <g transform="translate(97 29) rotate(-8 55 55)">
            {Array.from({ length: 9 }, (_, i) => (
              <g key={i}>
                <rect
                  x={(i % 3) * 37}
                  y={Math.floor(i / 3) * 37 + 4}
                  width="32"
                  height="32"
                  rx="5"
                  fill="#090d12"
                />
                <rect
                  x={(i % 3) * 37}
                  y={Math.floor(i / 3) * 37}
                  width="32"
                  height="32"
                  rx="5"
                  fill={i === 4 ? accent : "#272c35"}
                  stroke={i === 4 ? accent : "#424951"}
                />
                <text
                  x={(i % 3) * 37 + 16}
                  y={Math.floor(i / 3) * 37 + 21}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="600"
                  fill={i === 4 ? "#17210f" : "#c1c6cc"}
                >
                  {id === "2048" ? [2, 4, 2, 8, 64, 4, 16, 2, 8][i] : i + 1}
                </text>
              </g>
            ))}
          </g>
        ) : id === "snake" ? (
          <g>
            <path
              d="M88 117H153V60H211"
              stroke="#556e30"
              strokeWidth="23"
              fill="none"
              strokeLinejoin="round"
            />
            <path
              d="M88 111H153V54H211"
              stroke={accent}
              strokeWidth="23"
              fill="none"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <circle cx="213" cy="52" r="2" fill="#12180b" />
            <circle cx="82" cy="57" r="9" fill="#ffab83" />
            <circle cx="82" cy="57" r="17" fill="none" stroke="#ffab83" opacity=".2" />
          </g>
        ) : id === "connect" ? (
          <g transform="translate(90 23) rotate(-8 60 60)">
            <rect width="130" height="130" y="8" rx="12" fill="#51427e" />
            <rect width="130" height="130" rx="12" fill="#8775c8" />
            {Array.from({ length: 16 }, (_, i) => (
              <circle
                key={i}
                cx={20 + (i % 4) * 30}
                cy={20 + Math.floor(i / 4) * 30}
                r="10"
                fill={[9, 10, 11, 12].includes(i) ? "#c3f75c" : i > 7 ? "#c4b7ff" : "#282439"}
                stroke="#65539f"
                strokeWidth="3"
              />
            ))}
          </g>
        ) : id === "whack" ? (
          <g>
            {[0, 1, 2].map((i) => (
              <ellipse
                key={i}
                cx={87 + i * 63}
                cy={115 - (i === 1 ? 0 : 8)}
                rx="29"
                ry="12"
                fill="#0a0e0b"
                stroke="#414d2e"
                strokeWidth="5"
              />
            ))}
            <path d="M125 113V77a26 26 0 0 1 52 0v36" fill="#b3de64" />
            <circle cx="141" cy="78" r="4" fill="#17230f" />
            <circle cx="161" cy="78" r="4" fill="#17230f" />
            <ellipse cx="151" cy="92" rx="10" ry="6" fill="#d3f590" />
            <path d="M228 42L204 72" stroke="#cfac75" strokeWidth="9" />
            <rect
              x="218"
              y="20"
              width="40"
              height="26"
              rx="6"
              transform="rotate(30 230 35)"
              fill="#a392ff"
            />
          </g>
        ) : id === "pong" ? (
          <g>
            <path d="M150 25V145" stroke="#424955" strokeDasharray="6 8" />
            <rect x="76" y="72" width="9" height="51" rx="4" fill={accent} />
            <rect x="215" y="41" width="9" height="51" rx="4" fill="#a392ff" />
            <path d="M145 104L173 82" stroke="#ffffff25" strokeWidth="7" />
            <circle cx="180" cy="75" r="7" fill="#fff" />
          </g>
        ) : id === "flyer" ? (
          <g>
            <rect x="208" width="33" height="52" rx="4" fill="#7760a5" />
            <rect x="208" y="112" width="33" height="58" rx="4" fill="#7760a5" />
            <rect x="204" y="46" width="41" height="9" rx="3" fill="#b7a1ec" />
            <rect x="204" y="108" width="41" height="9" rx="3" fill="#b7a1ec" />
            <path d="M95 89L68 82L95 77" fill="#ffab83" />
            <ellipse cx="112" cy="82" rx="23" ry="16" fill="#c3f75c" />
            <ellipse cx="124" cy="78" rx="10" ry="7" fill="#243640" />
            <circle cx="47" cy="37" r="2" fill="#a392ff" />
          </g>
        ) : id === "simon" ? (
          <g transform="translate(92 25)">
            {[0, 1, 2, 3].map((i) => (
              <rect
                key={i}
                x={(i % 2) * 62}
                y={Math.floor(i / 2) * 62}
                width="53"
                height="53"
                rx="17"
                fill={["#c3f75c", "#a392ff", "#6fe3e8", "#ffab83"][i]}
                opacity={i === 1 ? 1 : 0.4}
              />
            ))}
            <circle cx="57" cy="57" r="25" fill="#171822" />
            <path d="M60 42L48 58H60L54 72L68 53H57Z" fill="#eee" />
          </g>
        ) : id === "memory" ? (
          <g>
            {[0, 1, 2].map((i) => (
              <g
                key={i}
                transform={`translate(${86 + i * 40} ${38 + (i === 1 ? -6 : 5)}) rotate(${(i - 1) * 14} 25 42)`}
              >
                <rect y="5" width="50" height="82" rx="8" fill="#502f27" />
                <rect
                  width="50"
                  height="82"
                  rx="8"
                  fill={i === 1 ? accent : "#34303a"}
                  stroke="#76544b"
                />
                <text
                  x="25"
                  y="52"
                  textAnchor="middle"
                  fontSize="30"
                  fill={i === 1 ? "#382113" : accent}
                >
                  ✦
                </text>
              </g>
            ))}
          </g>
        ) : id === "breakout" ? (
          <g>
            {Array.from({ length: 18 }, (_, i) => (
              <rect
                key={i}
                x={57 + (i % 6) * 32}
                y={35 + Math.floor(i / 6) * 20}
                width="27"
                height="14"
                rx="3"
                fill={["#a392ff", "#6fe3e8", "#ffab83"][Math.floor(i / 6)]}
              />
            ))}
            <path d="M136 125L161 97" stroke="#ffffff25" strokeWidth="4" />
            <circle cx="167" cy="91" r="5" fill="#fff" />
            <rect x="110" y="139" width="59" height="7" rx="3" fill={accent} />
          </g>
        ) : id === "reaction" ? (
          <g>
            <circle cx="150" cy="85" r="53" fill="#ffab830b" stroke="#ffab8330" />
            <circle cx="150" cy="85" r="39" fill="#ffab8318" />
            <path d="M156 44L123 90H149L142 127L180 76H153Z" fill={accent} />
          </g>
        ) : id === "tic" ? (
          <g>
            <path
              d="M129 35V135M171 35V135M85 68H215M85 109H215"
              stroke="#555163"
              strokeWidth="3"
            />
            <path
              d="M94 43L115 59M115 43L94 59M137 78L158 99M158 78L137 99"
              stroke={accent}
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle cx="192" cy="90" r="12" fill="none" stroke="#c3f75c" strokeWidth="4" />
          </g>
        ) : id === "hangman" ? (
          <g>
            <path
              d="M80 133H158M104 133V32H173V48"
              stroke="#515769"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle cx="173" cy="65" r="16" fill="none" stroke={accent} strokeWidth="4" />
            <path d="M173 81V109M173 89L156 100M173 89L190 100" stroke={accent} strokeWidth="4" />
          </g>
        ) : id === "word" ? (
          <g transform="translate(68 48) rotate(-7 82 34)">
            {"LEVEL".split("").map((l, i) => (
              <g key={i}>
                <rect x={i * 34} width="29" height="40" rx="5" fill={i < 3 ? accent : "#4a4935"} />
                <text
                  x={i * 34 + 14.5}
                  y="27"
                  textAnchor="middle"
                  fontSize="19"
                  fontWeight="600"
                  fill={i < 3 ? "#263515" : "#d5c37d"}
                >
                  {l}
                </text>
              </g>
            ))}
            <text x="84" y="69" textAnchor="middle" fill="#7c8980" fontSize="10" letterSpacing="4">
              FIVE LETTERS
            </text>
          </g>
        ) : (
          <g transform="translate(98 27)">
            {Array.from({ length: 9 }, (_, i) => (
              <g key={i}>
                <rect
                  x={(i % 3) * 37}
                  y={Math.floor(i / 3) * 37}
                  width="32"
                  height="32"
                  rx="5"
                  fill={i < 3 ? "#24343b" : "#354a53"}
                  stroke="#52636b"
                />
                <text
                  x={(i % 3) * 37 + 16}
                  y={Math.floor(i / 3) * 37 + 22}
                  textAnchor="middle"
                  fill={accent}
                  fontSize="17"
                >
                  {i === 4 ? "✹" : i < 3 ? i + 1 : ""}
                </text>
              </g>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
