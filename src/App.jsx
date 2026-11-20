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
      className={`bg-white border border-slate-200 rounded-xl h-16 w-16 text-2xl font-bold text-shadow-slate-700 shadow-sm transition-all duration-200 hover:border-violet-400 hover:bg-violet-50 hover:text-violet-600 ${
        isWinning
          ? "bg-violet-100 border-violet-500 text-violet-600"
          : "border-slate-200 text-slate-700 hover:border-violet-400 hover:bg-violet-50"
      }`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const { winner, winningLine } = calculateWinner(squares);

  const isDraw = !winner && squares.every(Boolean);

  let status;

  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isDraw) {
    status = "Game Draw!";
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  function handleClick(i) {
    if (squares[i] || winner) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";

    onPlay(nextSquares);
  }

  return (
    <div className="p-4 space-y-2">
      <div>{status}</div>

      <div className="flex space-x-2">
        {squares.slice(0, 3).map((value, i) => (
          <Square
            key={i}
            value={value}
            isWinning={winningLine.includes(i)}
            onSquareClick={() => handleClick(i)}
          />
        ))}
      </div>

      <div className="flex space-x-2">
        {squares.slice(3, 6).map((value, i) => (
          <Square
            key={i + 3}
            value={value}
            isWinning={winningLine.includes(i + 3)}
            onSquareClick={() => handleClick(i + 3)}
          />
        ))}
      </div>

      <div className="flex space-x-2">
        {squares.slice(6, 9).map((value, i) => (
          <Square
            key={i + 6}
            value={value}
            isWinning={winningLine.includes(i + 6)}
            onSquareClick={() => handleClick(i + 6)}
          />
        ))}
      </div>
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

  const moves = history.map((squares, move) => {
    const description = move > 0 ? `Go to move #${move}` : "Game start";

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)} className="cursor-pointer">
          {description}
        </button>
      </li>
    );
  });

  function handleRestart() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  return (
    <>
      <div className="flex gap-4">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />

        <div>
          <ol>{moves}</ol>
        </div>
      </div>
      <button
        onClick={handleRestart}
        className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all duration-200"
      >
        Restart Game
      </button>
    </>
  );
}
