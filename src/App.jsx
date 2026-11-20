import { useEffect, useState } from "react";

// =====================================
// GAME LOGIC
// =====================================

function calculateWinner(squares) {
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

  for (const line of lines) {
    const [a, b, c] = line;

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningLine: line };
    }
  }

  return { winner: null, winningLine: [] };
}

// =====================================
// THEME TOGGLE
// =====================================

function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      title="Toggle theme"
      className={`fixed bottom-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border shadow-md transition hover:scale-105 ${
        isDark
          ? "border-white/10 bg-[#385a71] text-[#f6b26b]"
          : "border-[#385a71]/10 bg-white text-[#385a71]"
      }`}
    >
      {isDark ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-[18px] w-[18px]"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-[18px] w-[18px]"
        >
          <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
        </svg>
      )}
    </button>
  );
}

// =====================================
// PLAYER INDICATOR
// =====================================

function PlayerIndicator({ player, isActive, isDark }) {
  const isX = player === "X";

  return (
    <div
      className={`flex min-w-0 flex-1 items-center gap-2 rounded-lg border px-2.5 py-2 transition ${
        isActive
          ? isDark
            ? "border-[#5080a1]/60 bg-[#5080a1]/15"
            : "border-[#5080a1]/50 bg-[#5080a1]/10"
          : isDark
            ? "border-white/[0.06] bg-white/[0.025]"
            : "border-[#385a71]/10 bg-white"
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-lg font-bold ${
          isX
            ? "bg-[#f6b26b]/15 text-[#f6b26b]"
            : "bg-[#93c47d]/15 text-[#93c47d]"
        }`}
      >
        {player}
      </span>

      <div className="min-w-0">
        <p
          className={`text-xs font-semibold ${
            isDark ? "text-white" : "text-[#385a71]"
          }`}
        >
          Player {player}
        </p>
        <p className="text-[10px] text-[#aaaaaa]">
          {isActive ? "Playing" : "Waiting"}
        </p>
      </div>

      {isActive && (
        <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-[#93c47d]" />
      )}
    </div>
  );
}

// =====================================
// SQUARE
// =====================================

function Square({ value, onClick, isWinning, isDark }) {
  const markColor = value === "X" ? "text-[#f6b26b]" : "text-[#93c47d]";

  return (
    <button
      onClick={onClick}
      disabled={Boolean(value)}
      aria-label={value ? `Square ${value}` : "Empty square"}
      className={`flex h-[66px] w-[66px] items-center justify-center rounded-xl border text-[32px] font-bold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5080a1] sm:h-[70px] sm:w-[70px] ${
        isWinning
          ? "border-[#93c47d] bg-[#93c47d]/15 shadow-[0_0_16px_rgba(147,196,125,0.12)]"
          : isDark
            ? "border-white/[0.07] bg-white/[0.035] hover:border-[#5080a1]/60 hover:bg-[#5080a1]/10"
            : "border-[#385a71]/10 bg-[#f5f8fa] hover:border-[#5080a1]/50 hover:bg-[#5080a1]/[0.06]"
      } ${value ? markColor : ""}`}
    >
      {value}
    </button>
  );
}

// =====================================
// BOARD
// =====================================

function Board({ squares, xIsNext, onPlay, isDark }) {
  const { winner, winningLine } = calculateWinner(squares);
  const isDraw = !winner && squares.every(Boolean);
  const finished = Boolean(winner || isDraw);

  const status = winner
    ? `${winner} wins!`
    : isDraw
      ? "It's a draw!"
      : `${xIsNext ? "Player X" : "Player O"}'s turn`;

  function handleClick(index) {
    if (squares[index] || finished) return;

    const nextSquares = [...squares];
    nextSquares[index] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  return (
    <div className="flex flex-col items-center">
      {/* GAME STATUS */}
      <div
        className={`mb-4 flex items-center gap-2 rounded-full px-3.5 py-1.5 ${
          isDark ? "bg-white/[0.05]" : "bg-[#385a71]/[0.05]"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            finished
              ? "bg-[#93c47d]"
              : xIsNext
                ? "bg-[#f6b26b]"
                : "bg-[#93c47d]"
          }`}
        />
        <span
          className={`text-xs font-semibold ${
            isDark ? "text-white" : "text-[#385a71]"
          }`}
        >
          {status}
        </span>
      </div>

      {/* GAME GRID */}
      <div className="grid grid-cols-3 gap-2">
        {squares.map((value, index) => (
          <Square
            key={index}
            value={value}
            onClick={() => handleClick(index)}
            isWinning={winningLine.includes(index)}
            isDark={isDark}
          />
        ))}
      </div>

      <p
        className={`mt-4 text-[11px] ${
          isDark ? "text-[#aaaaaa]" : "text-[#385a71]/55"
        }`}
      >
        {winner
          ? "Congratulations! Well played."
          : isDraw
            ? "A perfect match. Try again!"
            : "Get three in a row to win"}
      </p>
    </div>
  );
}

// =====================================
// GAME HISTORY
// =====================================

function GameHistory({ history, currentMove, onJump, isDark }) {
  const heading = isDark ? "text-white" : "text-[#385a71]";
  const muted = isDark ? "text-[#aaaaaa]" : "text-[#385a71]/55";

  return (
    <aside
      className={`rounded-xl border p-3.5 ${
        isDark
          ? "border-white/[0.07] bg-[#1d3442]"
          : "border-[#385a71]/10 bg-white"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className={`text-xs font-semibold ${heading}`}>Game History</h3>
          <p className={`mt-0.5 text-[10px] ${muted}`}>Previous moves</p>
        </div>

        <span
          className={`rounded-md px-2 py-1 text-[10px] font-semibold ${
            isDark
              ? "bg-white/[0.06] text-[#aaaaaa]"
              : "bg-[#385a71]/[0.06] text-[#385a71]/70"
          }`}
        >
          {history.length - 1} moves
        </span>
      </div>

      {/* PROGRESS */}
      <div
        className={`mb-3 h-1 overflow-hidden rounded-full ${
          isDark ? "bg-white/10" : "bg-[#385a71]/10"
        }`}
      >
        <div
          className="h-full rounded-full bg-[#5080a1] transition-all duration-300"
          style={{
            width: `${
              history.length > 1
                ? (currentMove / (history.length - 1)) * 100
                : 0
            }%`,
          }}
        />
      </div>

      {/* MOVE LIST */}
      <div className="max-h-[245px] space-y-1 overflow-y-auto">
        {history.map((_, move) => {
          const isCurrent = move === currentMove;
          const player = move === 0 ? null : move % 2 === 1 ? "X" : "O";

          return (
            <button
              key={move}
              onClick={() => onJump(move)}
              aria-current={isCurrent ? "step" : undefined}
              className={`flex w-full items-center justify-between rounded-md px-2 py-2 text-left transition ${
                isCurrent
                  ? isDark
                    ? "bg-[#5080a1]/20"
                    : "bg-[#5080a1]/10"
                  : isDark
                    ? "hover:bg-white/[0.04]"
                    : "hover:bg-[#385a71]/[0.04]"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded text-[10px] font-bold ${
                    player === "X"
                      ? "bg-[#f6b26b]/15 text-[#f6b26b]"
                      : player === "O"
                        ? "bg-[#93c47d]/15 text-[#93c47d]"
                        : isDark
                          ? "bg-white/[0.07] text-[#aaaaaa]"
                          : "bg-[#385a71]/[0.07] text-[#aaaaaa]"
                  }`}
                >
                  {player || "•"}
                </span>

                <span className={`text-[11px] ${isCurrent ? heading : muted}`}>
                  {move === 0 ? "Game start" : `Move ${move}`}
                </span>
              </div>

              {isCurrent && (
                <span className="text-[9px] font-semibold text-[#5080a1]">
                  CURRENT
                </span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}

// =====================================
// MAIN APP
// =====================================

export default function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("tic-tac-toe-theme");

    if (saved) return saved === "dark";

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  const { winner } = calculateWinner(currentSquares);
  const isDraw = !winner && currentSquares.every(Boolean);

  useEffect(() => {
    localStorage.setItem("tic-tac-toe-theme", isDark ? "dark" : "light");
  }, [isDark]);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];

    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  function handleRestart() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const pageBg = isDark ? "bg-[#172b37]" : "bg-[#f4f7f9]";

  return (
    <main className={`min-h-screen transition-colors duration-300 ${pageBg}`}>
      <div className="mx-auto flex min-h-screen max-w-[760px] flex-col px-4 py-5 sm:px-6">
        {/* HEADER */}
        <header
          className={`mb-6 flex items-center justify-between border-b pb-4 ${
            isDark ? "border-white/[0.08]" : "border-[#385a71]/10"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div>
              <img
                src="./favicon.png"
                className="h-10 w-10"
                alt="application icon"
              />
            </div>

            <div>
              <h1
                className={`text-sm font-bold ${
                  isDark ? "text-white" : "text-[#385a71]"
                }`}
              >
                Tic Tac Toe
              </h1>
              <p className="text-[10px] text-[#aaaaaa]">
                Classic strategy game
              </p>
            </div>
          </div>

          <span
            className={`rounded-full border px-2.5 py-1 text-[10px] font-medium ${
              isDark
                ? "border-white/10 text-[#aaaaaa]"
                : "border-[#385a71]/10 text-[#385a71]/60"
            }`}
          >
            2 Players
          </span>
        </header>

        {/* GAME LAYOUT */}
        <section className="grid flex-1 content-center items-start gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
          {/* GAME PANEL */}
          <div
            className={`rounded-xl border p-4 sm:p-5 ${
              isDark
                ? "border-white/[0.07] bg-[#1d3442]"
                : "border-[#385a71]/10 bg-white shadow-sm shadow-[#385a71]/[0.03]"
            }`}
          >
            {/* TITLE */}
            <div className="mb-5 text-center">
              <h2
                className={`text-lg font-bold tracking-tight ${
                  isDark ? "text-white" : "text-[#385a71]"
                }`}
              >
                Let's Play!
              </h2>
              <p className="mt-1 text-[11px] text-[#aaaaaa]">
                Three in a row to win.
              </p>
            </div>

            {/* PLAYERS */}
            <div className="mx-auto mb-5 grid max-w-[300px] grid-cols-2 gap-2">
              <PlayerIndicator
                player="X"
                isActive={!winner && !isDraw && xIsNext}
                isDark={isDark}
              />

              <PlayerIndicator
                player="O"
                isActive={!winner && !isDraw && !xIsNext}
                isDark={isDark}
              />
            </div>

            {/* BOARD */}
            <Board
              squares={currentSquares}
              xIsNext={xIsNext}
              onPlay={handlePlay}
              isDark={isDark}
            />

            {/* RESTART */}
            <div
              className={`mt-5 flex justify-center border-t pt-4 ${
                isDark ? "border-white/[0.07]" : "border-[#385a71]/10"
              }`}
            >
              <button
                onClick={handleRestart}
                className="rounded-lg bg-[#5080a1] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#385a71] active:scale-[0.98]"
              >
                ↻ &nbsp; New Game
              </button>
            </div>
          </div>

          {/* HISTORY */}
          <GameHistory
            history={history}
            currentMove={currentMove}
            onJump={jumpTo}
            isDark={isDark}
          />
        </section>

        {/* FOOTER */}
        <footer
          className={`mt-6 flex flex-col items-center justify-between gap-2 border-t pt-4 text-center sm:flex-row ${
            isDark ? "border-white/[0.08]" : "border-[#385a71]/10"
          }`}
        >
          <p className="text-[10px] text-[#aaaaaa]">
            Made for fun. Built for everyone.
          </p>

          <p className="text-[10px] text-[#aaaaaa]">
            Developer:{" "}
            <a
              href="https://www.linkedin.com/in/arasruislam"
              target="_blank"
              rel="noopener noreferrer"
              className={`font-semibold transition hover:underline ${
                isDark
                  ? "text-white hover:text-[#f6b26b]"
                  : "text-[#385a71] hover:text-[#5080a1]"
              }`}
            >
              Ashraful Islam
            </a>
          </p>
        </footer>
      </div>

      {/* THEME */}
      <ThemeToggle
        isDark={isDark}
        onToggle={() => setIsDark((prev) => !prev)}
      />
    </main>
  );
}
