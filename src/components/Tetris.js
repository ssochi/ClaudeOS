import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 25;

const createEmptyBoard = () => {
  return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));
};

const PIECES = [
  { shape: [[1, 1, 1, 1]], color: '#f2b179' },
  { shape: [[1, 1], [1, 1]], color: '#edc22e' },
  { shape: [[1, 1, 1], [0, 1, 0]], color: '#f67c5f' },
  { shape: [[1, 1, 1], [1, 0, 0]], color: '#f65e3b' },
  { shape: [[1, 1, 1], [0, 0, 1]], color: '#edcf72' },
  { shape: [[1, 1, 0], [0, 1, 1]], color: '#edcc61' },
  { shape: [[0, 1, 1], [1, 1, 0]], color: '#edc850' }
];

const Tetris = () => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState(null);
  const [nextPiece, setNextPiece] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [bestScore, setBestScore] = useState(0);

  const generateNewPiece = useCallback(() => {
    return {
      ...PIECES[Math.floor(Math.random() * PIECES.length)],
      position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 }
    };
  }, []);

  const isValidMove = useCallback((shape, position) => {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const boardX = position.x + x;
          const boardY = position.y + y;
          if (
            boardX < 0 || boardX >= BOARD_WIDTH ||
            boardY >= BOARD_HEIGHT ||
            (boardY >= 0 && board[boardY][boardX])
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }, [board]);

  const placePiece = useCallback(() => {
    if (!currentPiece) return;
    const newBoard = board.map(row => [...row]);
    currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          const boardY = currentPiece.position.y + y;
          const boardX = currentPiece.position.x + x;
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            newBoard[boardY][boardX] = currentPiece.color;
          }
        }
      });
    });
    setBoard(newBoard);
    clearLines(newBoard);
    setCurrentPiece(nextPiece);
    setNextPiece(generateNewPiece());
  }, [board, currentPiece, nextPiece, generateNewPiece]);

  const clearLines = useCallback((newBoard) => {
    let linesCleared = 0;
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (newBoard[y].every(cell => cell !== 0)) {
        newBoard.splice(y, 1);
        newBoard.unshift(Array(BOARD_WIDTH).fill(0));
        linesCleared++;
        y++;
      }
    }
    if (linesCleared > 0) {
      const points = [40, 100, 300, 1200][linesCleared - 1] * level;
      setScore(prevScore => {
        const newScore = prevScore + points;
        setLevel(Math.floor(newScore / 1000) + 1);
        return newScore;
      });
    }
  }, [level]);

  const moveDown = useCallback(() => {
    if (!currentPiece || gameOver) return;
    const newPosition = { ...currentPiece.position, y: currentPiece.position.y + 1 };
    if (isValidMove(currentPiece.shape, newPosition)) {
      setCurrentPiece({ ...currentPiece, position: newPosition });
    } else {
      placePiece();
      if (currentPiece.position.y <= 0) {
        setGameOver(true);
      }
    }
  }, [currentPiece, gameOver, isValidMove, placePiece]);

  const moveHorizontal = useCallback((direction) => {
    if (!currentPiece || gameOver) return;
    const newPosition = { ...currentPiece.position, x: currentPiece.position.x + direction };
    if (isValidMove(currentPiece.shape, newPosition)) {
      setCurrentPiece({ ...currentPiece, position: newPosition });
    }
  }, [currentPiece, gameOver, isValidMove]);

  const rotate = useCallback(() => {
    if (!currentPiece || gameOver) return;
    const rotatedShape = currentPiece.shape[0].map((_, index) =>
      currentPiece.shape.map(row => row[index]).reverse()
    );
    if (isValidMove(rotatedShape, currentPiece.position)) {
      setCurrentPiece({ ...currentPiece, shape: rotatedShape });
    }
  }, [currentPiece, gameOver, isValidMove]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (gameOver) return;
      switch (event.key) {
        case 'ArrowLeft':
          moveHorizontal(-1);
          break;
        case 'ArrowRight':
          moveHorizontal(1);
          break;
        case 'ArrowDown':
          moveDown();
          break;
        case 'ArrowUp':
          rotate();
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameOver, moveDown, moveHorizontal, rotate]);

  useEffect(() => {
    if (gameOver) return;
    const gameLoop = setInterval(moveDown, 1000 - (level - 1) * 50);
    return () => {
      clearInterval(gameLoop);
    };
  }, [gameOver, moveDown, level]);

  useEffect(() => {
    if (!currentPiece && !gameOver) {
      const newPiece = nextPiece || generateNewPiece();
      const nextNewPiece = generateNewPiece();
      if (isValidMove(newPiece.shape, newPiece.position)) {
        setCurrentPiece(newPiece);
        setNextPiece(nextNewPiece);
      } else {
        setGameOver(true);
      }
    }
  }, [currentPiece, gameOver, generateNewPiece, isValidMove, nextPiece]);

  useEffect(() => {
    const storedBestScore = localStorage.getItem('tetrisBestScore');
    if (storedBestScore) {
      setBestScore(parseInt(storedBestScore, 10));
    }
  }, []);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('tetrisBestScore', score.toString());
    }
  }, [score, bestScore]);

  const restartGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setCurrentPiece(null);
    setNextPiece(null);
    setGameOver(false);
    setScore(0);
    setLevel(1);
  }, []);

  const renderBlock = (color, index) => (
    <motion.div
      key={index}
      className="rounded-sm"
      style={{
        width: BLOCK_SIZE,
        height: BLOCK_SIZE,
        backgroundColor: color || '#bbada0',
        margin: '1px',
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    />
  );

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#faf8ef] p-4 rounded-lg shadow-lg font-sans">
      <h1 className="text-5xl font-bold text-[#776e65] mb-8">Tetris</h1>
      <div className="flex">
        <div className="border-4 border-[#bbada0] bg-[#bbada0] p-2 rounded-md shadow-inner" style={{ width: BLOCK_SIZE * BOARD_WIDTH + 20 }}>
          {board.map((row, y) => (
            <div key={y} className="flex">
              {row.map((cell, x) => renderBlock(
                cell || (currentPiece?.shape[y - currentPiece.position.y]?.[x - currentPiece.position.x] ? currentPiece.color : null),
                `${x}-${y}`
              ))}
            </div>
          ))}
        </div>
        <div className="ml-4 w-32 flex flex-col">
          <div className="bg-[#bbada0] rounded-md p-2 text-white mb-4">
            <div className="text-sm mb-2 text-center font-bold">NEXT</div>
            <div className="bg-[#cdc1b4] p-1 rounded-sm h-24 w-24 flex items-center justify-center mx-auto">
              {nextPiece && (
                <div style={{ transform: 'scale(0.8)' }}>
                  {nextPiece.shape.map((row, y) => (
                    <div key={y} className="flex">
                      {row.map((cell, x) => renderBlock(cell ? nextPiece.color : null, `next-${x}-${y}`))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="bg-[#bbada0] rounded-md p-2 text-white mb-2 text-center">
            <div className="text-sm font-bold">SCORE</div>
            <div className="text-2xl font-bold">{score}</div>
          </div>
          <div className="bg-[#bbada0] rounded-md p-2 text-white mb-2 text-center">
            <div className="text-sm font-bold">BEST</div>
            <div className="text-2xl font-bold">{bestScore}</div>
          </div>
          <div className="bg-[#bbada0] rounded-md p-2 text-white text-center">
            <div className="text-sm font-bold">LEVEL</div>
            <div className="text-2xl font-bold">{level}</div>
          </div>
        </div>
      </div>
      {gameOver && (
        <div className="mt-4 text-xl font-bold text-[#776e65]">
          Game Over!
        </div>
      )}
      <button
        className="mt-4 px-6 py-2 bg-[#8f7a66] text-white text-lg rounded-md hover:bg-[#9f8b77] transition duration-200"
        onClick={restartGame}
      >
        New Game
      </button>
      <p className="mt-4 text-sm text-[#776e65]">
        Use arrow keys to move and rotate pieces.
      </p>
    </div>
  );
};

export default Tetris;