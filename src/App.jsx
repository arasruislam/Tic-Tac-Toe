import { useState } from "react";

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

function Square({ value, onSquareClick, isWinning }) {
  return (
    <button
      onClick={onSquareClick}
      aria-label={value ? `Square ${value}` : "Empty square"}
      className={`
        h-16 w-16 sm:h-[72px] sm:w-[72px]
        rounded-xl flex items-center justify-center
        text-3xl sm:text-4xl font-bold
        border transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300
        ${
          isWinning
            ? "bg-violet-100 border-violet-400 shadow-inner scale-[0.97]"
            : value
              ? "bg-white border-slate-200 shadow-sm"
              : "bg-slate-50 border-slate-200 hover:bg-violet-50 hover:border-violet-300 active:scale-95"
        }
        ${!value && !isWinning ? "cursor-pointer" : "cursor-default"}
        ${value === "X" ? "text-violet-600" : "text-sky-500"}
      `}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
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

  return (
    <div className="w-full">
      {/* Status */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
            Game Status
          </p>

          <h2 className="text-lg font-bold text-slate-800">{status}</h2>
        </div>

        <span
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
            gameOver
              ? "bg-violet-100 text-violet-700"
              : "bg-emerald-50 text-emerald-600"
          }`}
        >
          {gameOver ? "Finished" : "● Playing"}
        </span>
      </div>

      {/* Players */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div
          className={`flex items-center gap-2 rounded-xl border p-2 ${
            !gameOver && xIsNext
              ? "bg-violet-50 border-violet-300"
              : "bg-white border-slate-200"
          }`}
        >
          <div className="h-8 w-8 rounded-lg bg-violet-100 flex items-center justify-center text-lg font-bold text-violet-600">
            X
          </div>

          <div>
            <p className="text-xs font-bold text-slate-800">Player X</p>
            <p className="text-[10px] text-slate-400">
              {winner === "X"
                ? "Winner"
                : !gameOver && xIsNext
                  ? "Your turn"
                  : "Waiting"}
            </p>
          </div>
        </div>

        <div
          className={`flex items-center gap-2 rounded-xl border p-2 ${
            !gameOver && !xIsNext
              ? "bg-sky-50 border-sky-300"
              : "bg-white border-slate-200"
          }`}
        >
          <div className="h-8 w-8 rounded-lg bg-sky-100 flex items-center justify-center text-lg font-bold text-sky-600">
            O
          </div>

          <div>
            <p className="text-xs font-bold text-slate-800">Player O</p>
            <p className="text-[10px] text-slate-400">
              {winner === "O"
                ? "Winner"
                : !gameOver && !xIsNext
                  ? "Your turn"
                  : "Waiting"}
            </p>
          </div>
        </div>
      </div>

      {/* Compact Board */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm flex justify-center">
        <div className="grid grid-cols-3 gap-2">
          {squares.map((value, i) => (
            <Square
              key={i}
              value={value}
              isWinning={winningLine.includes(i)}
              onSquareClick={() => handleClick(i)}
            />
          ))}
        </div>
      </div>

      {/* Result */}
      {gameOver && (
        <div className="mt-3 rounded-xl bg-violet-50 border border-violet-100 p-3 text-center">
          <p className="text-xs font-semibold text-violet-700">
            {winner
              ? `Congratulations! Player ${winner} won!`
              : "Great game! It's a draw."}
          </p>
        </div>
      )}

      <p className="mt-3 text-center text-[11px] text-slate-400">
        Take your time. Make your move.
      </p>
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);

  const [currentMove, setCurrentMove] = useState(0);

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
          className={`w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-all ${
            isCurrentMove
              ? "bg-violet-50 text-violet-700 font-semibold"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
          }`}
        >
          <span className="flex items-center gap-2">
            <span
              className={`h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-bold ${
                isCurrentMove
                  ? "bg-violet-600 text-white"
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
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-violet-200">
              XO
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-900">Tic Tac Toe</h1>

              <p className="text-[11px] text-slate-400">
                Classic game, modern experience
              </p>
            </div>
          </div>

          <span className="hidden sm:block text-[10px] font-semibold tracking-widest text-slate-400">
            TWO PLAYER GAME
          </span>
        </header>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-4 items-start">
          {/* Game */}
          <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
            <div className="mb-5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-violet-500 mb-1.5">
                Let's Play
              </p>

              <h2 className="text-xl font-bold text-slate-900">
                Ready to challenge?
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Get three marks in a row to win the game.
              </p>
            </div>

            <Board
              xIsNext={xIsNext}
              squares={currentSquares}
              onPlay={handlePlay}
            />

            {/* Restart */}
            <button
              onClick={handleRestart}
              className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all hover:bg-violet-700 active:scale-[0.98]"
            >
              <span className="text-lg">↻</span>
              Restart Game
            </button>
          </section>

          {/* History */}
          <aside className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Game History
                </h3>

                <p className="text-[11px] text-slate-400 mt-0.5">
                  Track your moves
                </p>
              </div>

              <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-sm">
                ↗
              </div>
            </div>

            <ol className="space-y-1">{moves}</ol>

            {/* Progress */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Total moves</span>

                <span className="font-bold text-slate-700">
                  {currentMove} / 9
                </span>
              </div>

              <div className="mt-2 h-1 rounded-full bg-slate-100 overflow-hidden">
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
        <footer className="mt-7 border-t border-slate-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-slate-400">
            Made for fun. Built for everyone.
          </p>

          <p className="text-[11px] text-slate-500">
            Developer:{" "}
            <span className="font-semibold text-slate-700">Ashraful Islam</span>
          </p>
        </footer>
      </div>
    </main>
  );
}
