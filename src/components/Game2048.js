import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

const Game2048 = () => {
  const [board, setBoard] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const addNewTile = useCallback((board) => {
    const newBoard = JSON.parse(JSON.stringify(board));
    const emptyTiles = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (newBoard[i][j] === 0) {
          emptyTiles.push({ i, j });
        }
      }
    }
    if (emptyTiles.length > 0) {
      const { i, j } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      newBoard[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
    return newBoard;
  }, []);

  const initializeBoard = useCallback(() => {
    let newBoard = Array(4).fill().map(() => Array(4).fill(0));
    newBoard = addNewTile(newBoard);
    newBoard = addNewTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
  }, [addNewTile]);

  const isGameOver = useCallback((board) => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) return false;
        if (i < 3 && board[i][j] === board[i + 1][j]) return false;
        if (j < 3 && board[i][j] === board[i][j + 1]) return false;
      }
    }
    return true;
  }, []);

  const move = useCallback((direction) => {
    let newBoard = JSON.parse(JSON.stringify(board));
    let moved = false;
    let newScore = score;

    const moveAndMerge = (line) => {
      let newLine = line.filter(tile => tile !== 0);
      for (let i = 0; i < newLine.length - 1; i++) {
        if (newLine[i] === newLine[i + 1]) {
          newLine[i] *= 2;
          newScore += newLine[i];
          newLine.splice(i + 1, 1);
          moved = true;
          i--;
        }
      }
      while (newLine.length < 4) {
        newLine.push(0);
      }
      return newLine;
    };

    if (direction === 'left' || direction === 'right') {
      for (let i = 0; i < 4; i++) {
        const row = newBoard[i];
        const newRow = moveAndMerge(direction === 'left' ? row : row.reverse());
        newBoard[i] = direction === 'left' ? newRow : newRow.reverse();
        if (!moved && JSON.stringify(row) !== JSON.stringify(newBoard[i])) {
          moved = true;
        }
      }
    } else {
      for (let j = 0; j < 4; j++) {
        const column = [newBoard[0][j], newBoard[1][j], newBoard[2][j], newBoard[3][j]];
        const newColumn = moveAndMerge(direction === 'up' ? column : column.reverse());
        for (let i = 0; i < 4; i++) {
          newBoard[i][j] = direction === 'up' ? newColumn[i] : newColumn[3 - i];
        }
        if (!moved && JSON.stringify(column) !== JSON.stringify(newColumn)) {
          moved = true;
        }
      }
    }

    if (moved) {
      newBoard = addNewTile(newBoard);
      setBoard(newBoard);
      setScore(newScore);
      if (newScore > bestScore) {
        setBestScore(newScore);
      }
      if (isGameOver(newBoard)) {
        setGameOver(true);
      }
    }
  }, [board, score, bestScore, addNewTile, isGameOver]);

  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return;
      const directions = {
        ArrowLeft: 'left',
        ArrowRight: 'right',
        ArrowUp: 'up',
        ArrowDown: 'down',
      };
      const direction = directions[e.key];
      if (direction) {
        e.preventDefault();
        move(direction);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameOver, move]);

  const getTileColor = (value) => {
    const colors = {
      2: 'bg-[#eee4da] text-[#776e65]',
      4: 'bg-[#ede0c8] text-[#776e65]',
      8: 'bg-[#f2b179] text-white',
      16: 'bg-[#f59563] text-white',
      32: 'bg-[#f67c5f] text-white',
      64: 'bg-[#f65e3b] text-white',
      128: 'bg-[#edcf72] text-white',
      256: 'bg-[#edcc61] text-white',
      512: 'bg-[#edc850] text-white',
      1024: 'bg-[#edc53f] text-white',
      2048: 'bg-[#edc22e] text-white',
    };
    return colors[value] || 'bg-[#3c3a32] text-white';
  };

  return (
    <div className="flex flex-col h-full bg-[#faf8ef] p-6 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-5xl font-bold text-[#776e65]">2048</h2>
        <div className="flex space-x-4">
          <div className="bg-[#bbada0] rounded-md p-2 text-white min-w-[80px] text-center">
            <p className="text-sm font-semibold">SCORE</p>
            <p className="font-bold text-xl">{score}</p>
          </div>
          <div className="bg-[#bbada0] rounded-md p-2 text-white min-w-[80px] text-center">
            <p className="text-sm font-semibold">BEST</p>
            <p className="font-bold text-xl">{bestScore}</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <button
          onClick={initializeBoard}
          className="bg-[#8f7a66] text-white px-4 py-2 rounded-md font-bold hover:bg-[#a08a76] transition-colors duration-200"
        >
          New Game
        </button>
      </div>

      <div className="bg-[#bbada0] p-3 rounded-lg">
        {board.map((row, i) => (
          <div key={i} className="flex">
            {row.map((cell, j) => (
              <motion.div
                key={`${i}-${j}`}
                className={`w-20 h-20 m-1 flex items-center justify-center rounded-md text-2xl font-bold ${
                  cell === 0 ? 'bg-[#cdc1b4]' : getTileColor(cell)
                }`}
                initial={{ scale: cell === 0 ? 1 : 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.1 }}
              >
                {cell !== 0 && cell}
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg text-center">
            <h3 className="text-3xl font-bold mb-4 text-[#776e65]">Game Over!</h3>
            <p className="text-xl mb-4">Your score: {score}</p>
            <button
              onClick={initializeBoard}
              className="bg-[#8f7a66] text-white px-6 py-3 rounded-md font-bold hover:bg-[#a08a76] transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 text-[#776e65] text-sm">
        <p>Use arrow keys to move the tiles. When two tiles with the same number touch, they merge into one!</p>
      </div>
    </div>
  );
};

export default Game2048;