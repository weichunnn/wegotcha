'use client';
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from '../../components/ui/alert-dialog';

const findImmediateWin = (board, player) => {
  // Try each empty spot
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      const testBoard = [...board];
      testBoard[i] = player;
      if (checkWinner(testBoard) === player) {
        return i;
      }
    }
  }
  return -1;
};

const checkWinner = (boardState) => {
  const lines = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15], // rows
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15], // columns
    [0, 5, 10, 15],
    [3, 6, 9, 12], // diagonals
  ];

  for (const [a, b, c, d] of lines) {
    if (
      boardState[a] &&
      boardState[a] === boardState[b] &&
      boardState[a] === boardState[c] &&
      boardState[a] === boardState[d]
    ) {
      return boardState[a];
    }
  }
  return null;
};

const checkDraw = (boardState) => {
  return boardState.every((cell) => cell !== null);
};

const calculateBestMove = (board, isMaximizing) => {
  const currentPlayer = isMaximizing ? 'O' : 'X';
  const opponent = isMaximizing ? 'X' : 'O';

  // First check if we can win
  const winningMove = findImmediateWin(board, currentPlayer);
  if (winningMove !== -1) return winningMove;

  // Then check if we need to block opponent
  const blockingMove = findImmediateWin(board, opponent);
  if (blockingMove !== -1) return blockingMove;

  // Otherwise, just pick the first available space
  const available = board
    .map((cell, idx) => (cell === null ? idx : null))
    .filter((idx) => idx !== null);
  return available[0];
};

const Cell = ({ value, onClick }) => (
  <button
    onClick={onClick}
    className="w-20 h-20 border-2 border-gray-300 flex items-center justify-center text-2xl font-bold bg-white"
  >
    {value}
  </button>
);

const TicTacToeThree = () => {
  const [board, setBoard] = useState(Array(16).fill(null)); // Changed to 16 cells

  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
  const [showVerification, setShowVerification] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [lastMoveOptimal, setLastMoveOptimal] = useState(true);

  const isOptimalFirstMove = (index) => {
    // First move: corners (0,3,12,15) and center squares (5,6,9,10) are optimal
    const optimalFirstMoves = [0, 3, 5, 6, 9, 10, 12, 15];
    return optimalFirstMoves.includes(index);
  };

  const handleClick = (index) => {
    if (winner || board[index]) return;

    // Player's move
    const newBoard = [...board];
    newBoard[index] = currentPlayer;

    // Check if move was optimal (only for winning/blocking moves)
    const optimalMove = calculateBestMove(board, false);
    const wasOptimal = index === optimalMove;

    // Only fail verification if there was a winning/blocking move available
    const hasWinningMove = findImmediateWin(board, 'X') !== -1;
    const hasBlockingMove = findImmediateWin(board, 'O') !== -1;

    if ((hasWinningMove || hasBlockingMove) && !wasOptimal) {
      setWinner('failed');
      setIsVerified(false);
      setBoard(newBoard);
      return;
    }

    setBoard(newBoard);

    // Check for winner or draw after player's move
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setIsVerified(true);
      return;
    }
    if (checkDraw(newBoard)) {
      setWinner('draw');
      setIsVerified(true);
      return;
    }

    // AI's move
    const aiMove = calculateBestMove(newBoard, true);
    if (aiMove !== -1) {
      setTimeout(() => {
        const finalBoard = [...newBoard];
        finalBoard[aiMove] = 'O';
        setBoard(finalBoard);

        const finalWinner = checkWinner(finalBoard);
        if (finalWinner) {
          setWinner(finalWinner);
          setIsVerified(false);
        } else if (checkDraw(finalBoard)) {
          setWinner('draw');
          setIsVerified(true);
        }

        setCurrentPlayer('X');
      }, 500);
      setCurrentPlayer('O');
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-2xl font-bold mb-4">a fun game</h1>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {' '}
        {/* Changed to grid-cols-4 */}
        {board.map((cell, index) => (
          <Cell
            key={index}
            value={cell}
            onClick={() => handleClick(index)}
            className="w-16 h-16" // Adjusted size for 4x4 grid
          />
        ))}
      </div>
      <div className="text-center">
        <p className="mb-2 text-xl">
          {winner === 'failed'
            ? 'Non-optimal move detected! You must be an LLM!'
            : winner === 'draw'
            ? "It's a draw! You played optimally!"
            : winner
            ? `Player ${winner} wins!`
            : `Current Turn: Player ${currentPlayer}`}
        </p>
        {(winner || winner === 'draw' || winner === 'failed') && (
          <p className="text-lg font-semibold text-blue-600">
            {winner === 'failed'
              ? '❌ Verification failed! You chose a non-optimal move!'
              : isVerified
              ? '✅ Verification successful! You played optimally!'
              : '❌ Verification failed!'}
          </p>
        )}
      </div>
      <AlertDialog open={showVerification} onOpenChange={setShowVerification}>
      <AlertDialogContent className="bg-white"> {/* Ensure a solid background */}
      <AlertDialogHeader>
            <AlertDialogTitle>play the game</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <span className="block text-sm text-muted-foreground">
                  To verify you're real, please play a game of Tic-tac-toe.
                </span>
                <span className="block text-sm text-muted-foreground">
                  Player X goes first, followed by Player O.
                </span>
                <button
                  onClick={() => setShowVerification(false)}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Start Game
                </button>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>{' '}
    </div>
  );
};

export default TicTacToeThree;