import React, { useState } from 'react';

// Componenta pentru fiecare pătrat din joc
function Square({ value, onSquareClick, highlight }) {
  return (
    <button className={`square ${highlight ? 'highlight' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

// Componenta pentru tabla de joc
function Board({ xIsNext, squares, onPlay }) {
  // Funcție pentru gestionarea clicului pe pătrate
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  // Determinarea liniei câștigătoare sau a următorului jucător
  const winningLine = calculateWinner(squares);
  let status;
  if (winningLine) {
    status = 'Câștigător: ' + squares[winningLine[0]];
  } else if (!squares.includes(null)) {
    status = 'Egalitate!';
  } else {
    status = 'Urmează simbolul: ' + (xIsNext ? 'X' : 'O');
  }

  // Funcție pentru a afișa fiecare pătrat pe tabla de joc
  const renderSquare = (i, highlight) => {
    return (
      <Square
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        key={'square_' + i}
        highlight={highlight}
      />
    );
  };

  // Generarea rândurilor și coloanelor pentru tabla de joc
  const boardRows = [];
  for (let row = 0; row < 3; row++) {
    const squaresInRow = [];
    for (let col = 0; col < 3; col++) {
      const squareIndex = row * 3 + col;
      const highlight = winningLine && winningLine.includes(squareIndex);
      squaresInRow.push(renderSquare(squareIndex, highlight));
    }
    boardRows.push(
      <div className="board-row" key={'row_' + row}>
        {squaresInRow}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

// Componenta principală pentru joc
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true); // Ordinea de sortare
  const [playerNames, setPlayerNames] = useState({ player1: '', player2: '' }); // Stocarea numelor jucătorilor

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  // Funcție pentru a face următorul pas în joc
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  // Funcție pentru a naviga la un anumit pas în istoria jocului
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // Funcție pentru a sorta istoria jocului
  const sortedHistory = isAscending ? history.slice() : history.slice().reverse();

  // Generarea listei de mutări pentru afișare
  const moves = sortedHistory.map((squares, move) => {
    const moveNumber = isAscending ? move : history.length - 1 - move;

    let description;
    if (moveNumber > 0) {
      description =
        moveNumber === currentMove ? `Ești la mutarea #${moveNumber}` : `Mergi la mutarea #${moveNumber}`;
    } else {
      description = 'Mergi la începutul jocului';
    }

    return (
      <li key={moveNumber}>
        {moveNumber === currentMove ? (
          <span>{description}</span>
        ) : (
          <button onClick={() => jumpTo(moveNumber)}>{description}</button>
        )}
      </li>
    );
  });

  // Funcție pentru a schimba ordinea de sortare a listei de mutări
  const toggleSortOrder = () => {
    setIsAscending(!isAscending);
  };


  /// CAND SE SCHIMBA INPUTUL DE LA NUMELE PLAYERULUI
  // Funcție pentru gestionarea modificărilor în input-uri (numele jucătorilor)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlayerNames({ ...playerNames, [name]: value });
  };

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div>
          <button onClick={toggleSortOrder}>
            Schimbă ordinea: {isAscending ? 'Crescătoare' : 'Descrescătoare'}
          </button>
        </div>
        <div>
          <label>
            Nume jucător 1:
            <input type="text" name="player1" value={playerNames.player1} onChange={handleInputChange} />
          </label>
          <label>
            Nume jucător 2:
            <input type="text" name="player2" value={playerNames.player2} onChange={handleInputChange} />
          </label>
        </div>
        <div>
          Urmează jucătorul: {xIsNext ? playerNames.player1 || 'X' : playerNames.player2 || 'O'}
        </div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// Funcție pentru a calcula linia de câștig
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c]; // Returnează linia de câștig
    }
  }
  return null;
}
