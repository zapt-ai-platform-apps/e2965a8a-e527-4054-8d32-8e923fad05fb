import React, { useState } from 'react';
import * as Sentry from '@sentry/browser';
import { calculateWinner } from './gameUtils';

function TicTacToeGame() {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const handleCellClick = (index: number) => {
    try {
      if (board[index] || winner) return;
      const newBoard = board.slice();
      newBoard[index] = currentPlayer;
      console.log(`Player ${currentPlayer} marked cell ${index}`);
      setBoard(newBoard);
      const gameWinner = calculateWinner(newBoard);
      if (gameWinner) {
        console.log(`Winner is ${gameWinner}`);
        setWinner(gameWinner);
        setIsGameOver(true);
      } else if (!newBoard.includes(null)) {
        console.log('Game ended in a draw');
        setWinner('Draw');
        setIsGameOver(true);
      } else {
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
      }
    } catch (error) {
      console.error('Error handling cell click:', error);
      Sentry.captureException(error);
    }
  };

  const handleRestart = () => {
    console.log('Restarting Tic Tac Toe game');
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setIsGameOver(false);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 text-black h-full p-4">
      <h2 className="text-2xl font-bold mb-4">Tic Tac Toe</h2>
      {winner ? (
        <div className="mb-4">
          {winner === 'Draw' ? "It's a Draw!" : `Player ${winner} Wins!`}
        </div>
      ) : (
        <div className="mb-4">Current Turn: Player {currentPlayer}</div>
      )}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            className="cursor-pointer w-20 h-20 border border-gray-700 text-xl font-bold flex items-center justify-center"
            disabled={!!cell || isGameOver}
          >
            {cell}
          </button>
        ))}
      </div>
      <button onClick={handleRestart} className="cursor-pointer bg-blue-600 text-white px-4 py-2">
        Restart Game
      </button>
    </div>
  );
}

export default TicTacToeGame;