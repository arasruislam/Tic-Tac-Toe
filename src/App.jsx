import { useEffect, useState } from "react";

// Theme initialization
function getInitialTheme() {
  const savedTheme = localStorage.getItem("tic-tac-toe-theme");

  if (savedTheme) {
    return savedTheme === "dark";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

// Winner Calculation
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
      return {
        winner: squares[a],
        winningLine: line,
      };
    }
  }

  return {
    winner: null,
    winningLine: [],
  };
}

// Theme Toggle
function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`
        fixed bottom-5 right-5 z-50
        h-12 w-12 rounded-full
        flex items-center justify-center
        border shadow-lg
        transition-all duration-300
        hover:scale-110 active:scale-95
        focus:outline-none focus-visible:ring-2
        focus-visible:ring-violet-500
        ${
          isDark
            ? "bg-slate-800 border-slate-700 text-amber-300 shadow-black/30"
            : "bg-white border-slate-200 text-violet-600 shadow-slate-300/50"
        }
      `}
    >
      {isDark ? (
        // Sun Icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="21"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.42 1.42" />
          <path d="m17.65 17.65 1.42 1.42" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.35 17.65-1.42 1.42" />
          <path d="m19.07 4.93-1.42 1.42" />
        </svg>
      ) : (
        // Moon Icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="21"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.463.402.807a6.5 6.5 0 0 0 8.268 8.268c.344-.215.829-.003.803.397Z" />
        </svg>
      )}
    </button>
  );
}

// Square Component
function Square({ value, onSquareClick, isWinning, isDark }) {
  return (
    <button
      onClick={onSquareClick}
      aria-label={value ? `Square ${value}` : "Empty square"}
      className={`
        h-16 w-16 sm:h-[72px] sm:w-[72px]
        rounded-xl flex items-center justify-center
        text-3xl sm:text-4xl font-bold
        border transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400
        ${
          isWinning
            ? isDark
              ? "bg-violet-950 border-violet-500 shadow-inner"
              : "bg-violet-100 border-violet-400 shadow-inner"
            : value
              ? isDark
                ? "bg-slate-800 border-slate-700 shadow-sm"
                : "bg-white border-slate-200 shadow-sm"
              : isDark
                ? "bg-slate-800/70 border-slate-700 hover:bg-violet-950 hover:border-violet-500 active:scale-95"
                : "bg-slate-50 border-slate-200 hover:bg-violet-50 hover:border-violet-300 active:scale-95"
        }
        ${!value && !isWinning ? "cursor-pointer" : "cursor-default"}
        ${value === "X" ? "text-violet-500" : "text-sky-500"}
      `}
    >
      {value}
    </button>
  );
}

// Game Board
function Board({ xIsNext, squares, onPlay, isDark }) {
  const { winner, winningLine } = calculateWinner(squares);

  const isDraw = !winner && squares.every(Boolean);
  const gameOver = winner || isDraw;

  let status;

  if (winner) {
    status = `Player ${winner} wins!`;
  } else if (isDraw) {
    status = "It's a draw!";
  } else {
    status = `Player ${xIsNext ? "X" : "O"}'s turn`;
  }

  function handleClick(i) {
    if (squares[i] || winner) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";

    onPlay(nextSquares);
  }

  const mutedText = isDark ? "text-slate-400" : "text-slate-400";
  const headingText = isDark ? "text-slate-100" : "text-slate-800";

  return (
    <div className="w-full">
      {/* Status */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p
            className={`text-[10px] font-semibold uppercase tracking-widest ${mutedText} mb-1`}
          >
            Game Status
          </p>

          <h2 className={`text-lg font-bold ${headingText}`}>{status}</h2>
        </div>

        <span
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
            gameOver
              ? isDark
                ? "bg-violet-950 text-violet-300"
                : "bg-violet-100 text-violet-700"
              : isDark
                ? "bg-emerald-950 text-emerald-400"
                : "bg-emerald-50 text-emerald-600"
          }`}
        >
          {gameOver ? "Finished" : "● Playing"}
        </span>
      </div>

      {/* Players */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {["X", "O"].map((player) => {
          const isActive = !gameOver && (player === "X" ? xIsNext : !xIsNext);

          const playerWon = winner === player;
          const isX = player === "X";

          return (
            <div
              key={player}
              className={`
                flex items-center gap-2 rounded-xl border p-2 transition-colors
                ${
                  isActive
                    ? isX
                      ? isDark
                        ? "bg-violet-950/60 border-violet-700"
                        : "bg-violet-50 border-violet-300"
                      : isDark
                        ? "bg-sky-950/50 border-sky-700"
                        : "bg-sky-50 border-sky-300"
                    : isDark
                      ? "bg-slate-800 border-slate-700"
                      : "bg-white border-slate-200"
                }
              `}
            >
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center text-lg font-bold ${
                  isX
                    ? isDark
                      ? "bg-violet-950 text-violet-400"
                      : "bg-violet-100 text-violet-600"
                    : isDark
                      ? "bg-sky-950 text-sky-400"
                      : "bg-sky-100 text-sky-600"
                }`}
              >
                {player}
              </div>

              <div>
                <p
                  className={`text-xs font-bold ${
                    isDark ? "text-slate-100" : "text-slate-800"
                  }`}
                >
                  Player {player}
                </p>

                <p
                  className={`text-[10px] ${
                    isDark ? "text-slate-400" : "text-slate-400"
                  }`}
                >
                  {playerWon ? "Winner" : isActive ? "Your turn" : "Waiting"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Board */}
      <div
        className={`rounded-2xl border p-3 flex justify-center shadow-sm ${
          isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"
        }`}
      >
        <div className="grid grid-cols-3 gap-2">
          {squares.map((value, i) => (
            <Square
              key={i}
              value={value}
              isWinning={winningLine.includes(i)}
              isDark={isDark}
              onSquareClick={() => handleClick(i)}
            />
          ))}
        </div>
      </div>

      {/* Result */}
      {gameOver && (
        <div
          className={`mt-3 rounded-xl border p-3 text-center ${
            isDark
              ? "bg-violet-950/50 border-violet-900"
              : "bg-violet-50 border-violet-100"
          }`}
        >
          <p
            className={`text-xs font-semibold ${
              isDark ? "text-violet-300" : "text-violet-700"
            }`}
          >
            {winner
              ? `Congratulations! Player ${winner} won!`
              : "Great game! It's a draw."}
          </p>
        </div>
      )}

      <p className={`mt-3 text-center text-[11px] ${mutedText}`}>
        Take your time. Make your move.
      </p>
    </div>
  );
}

// Main Game
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);

  const [currentMove, setCurrentMove] = useState(0);

  const [isDark, setIsDark] = useState(getInitialTheme);

  // Save selected theme
  useEffect(() => {
    localStorage.setItem("tic-tac-toe-theme", isDark ? "dark" : "light");
  }, [isDark]);

  function toggleTheme() {
    setIsDark((prev) => !prev);
  }

  const currentSquares = history[currentMove];

  const xIsNext = currentMove % 2 === 0;

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

  const moves = history.map((squares, move) => {
    const isCurrentMove = currentMove === move;

    return (
      <li key={move}>
        <button
          onClick={() => jumpTo(move)}
          className={`
            w-full flex items-center justify-between
            rounded-lg px-2.5 py-2 text-xs transition-all
            ${
              isCurrentMove
                ? isDark
                  ? "bg-violet-950 text-violet-300 font-semibold"
                  : "bg-violet-50 text-violet-700 font-semibold"
                : isDark
                  ? "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }
          `}
        >
          <span className="flex items-center gap-2">
            <span
              className={`h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-bold ${
                isCurrentMove
                  ? "bg-violet-600 text-white"
                  : isDark
                    ? "bg-slate-700 text-slate-300"
                    : "bg-slate-100 text-slate-500"
              }`}
            >
              {move}
            </span>

            {move === 0 ? "Game Start" : `Move #${move}`}
          </span>

          {isCurrentMove && <span className="text-[10px]">Current</span>}
        </button>
      </li>
    );
  });

  return (
    <main
      className={`min-h-screen px-4 py-6 sm:py-8 transition-colors duration-300 ${
        isDark ? "bg-slate-950" : "bg-slate-50"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-violet-500/20">
              XO
            </div>

            <div>
              <h1
                className={`text-lg font-bold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Tic Tac Toe
              </h1>

              <p
                className={`text-[11px] ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Classic game, modern experience
              </p>
            </div>
          </div>

          <span
            className={`hidden sm:block text-[10px] font-semibold tracking-widest ${
              isDark ? "text-slate-500" : "text-slate-400"
            }`}
          >
            TWO PLAYER GAME
          </span>
        </header>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-4 items-start">
          {/* Game Panel */}
          <section
            className={`rounded-2xl border p-4 sm:p-5 shadow-sm transition-colors duration-300 ${
              isDark
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="mb-5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-violet-500 mb-1.5">
                Let's Play
              </p>

              <h2
                className={`text-xl font-bold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Ready to challenge?
              </h2>

              <p
                className={`text-xs mt-1 ${
                  isDark ? "text-slate-400" : "text-slate-400"
                }`}
              >
                Get three marks in a row to win the game.
              </p>
            </div>

            <Board
              xIsNext={xIsNext}
              squares={currentSquares}
              onPlay={handlePlay}
              isDark={isDark}
            />

            {/* Restart */}
            <button
              onClick={handleRestart}
              className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-violet-500/20 transition-all hover:bg-violet-700 active:scale-[0.98]"
            >
              <span className="text-lg">↻</span>
              Restart Game
            </button>
          </section>

          {/* History Panel */}
          <aside
            className={`rounded-2xl border p-4 shadow-sm transition-colors duration-300 ${
              isDark
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3
                  className={`text-sm font-bold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Game History
                </h3>

                <p
                  className={`text-[11px] mt-0.5 ${
                    isDark ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Track your moves
                </p>
              </div>

              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center text-sm ${
                  isDark
                    ? "bg-slate-800 text-slate-400"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                ↗
              </div>
            </div>

            <ol className="space-y-1">{moves}</ol>

            {/* Progress */}
            <div
              className={`mt-4 pt-3 border-t ${
                isDark ? "border-slate-800" : "border-slate-100"
              }`}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className={isDark ? "text-slate-500" : "text-slate-400"}>
                  Total moves
                </span>

                <span
                  className={`font-bold ${
                    isDark ? "text-slate-200" : "text-slate-700"
                  }`}
                >
                  {currentMove} / 9
                </span>
              </div>

              <div
                className={`mt-2 h-1 rounded-full overflow-hidden ${
                  isDark ? "bg-slate-800" : "bg-slate-100"
                }`}
              >
                <div
                  className="h-full rounded-full bg-violet-500 transition-all duration-300"
                  style={{
                    width: `${(currentMove / 9) * 100}%`,
                  }}
                />
              </div>
            </div>
          </aside>
        </div>

        {/* Footer */}
        <footer
          className={`mt-7 border-t pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 ${
            isDark ? "border-slate-800" : "border-slate-200"
          }`}
        >
          <p
            className={`text-[11px] ${
              isDark ? "text-slate-500" : "text-slate-400"
            }`}
          >
            Made for fun. Built for everyone.
          </p>

          <p
            className={`text-[11px] ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Developer:{" "}
            <span
              className={`font-semibold ${
                isDark ? "text-slate-200" : "text-slate-700"
              }`}
            >
              Ashraful Islam
            </span>
          </p>
        </footer>
      </div>

      {/* Floating Theme Toggle */}
      <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
    </main>
  );
}
