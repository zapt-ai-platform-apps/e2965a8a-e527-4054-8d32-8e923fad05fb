import React, { useState } from 'react';
import Game from './Game';
import TicTacToeGame from './tictactoe';
import './index.css';

function App() {
  const [selectedGame, setSelectedGame] = useState<'flappy' | 'ticTacToe'>('flappy');

  const handleGameChange = (game: 'flappy' | 'ticTacToe') => {
    console.log(`Switching game to: ${game}`);
    setSelectedGame(game);
  };

  return (
    <div className="min-h-screen h-full flex flex-col">
      <nav className="bg-gray-900 p-4 flex justify-center gap-4">
        <button 
          onClick={() => handleGameChange('flappy')} 
          className={`cursor-pointer px-4 py-2 text-white ${selectedGame === 'flappy' ? 'bg-blue-600' : 'bg-gray-700'}`}>
          Flappy Bird
        </button>
        <button 
          onClick={() => handleGameChange('ticTacToe')} 
          className={`cursor-pointer px-4 py-2 text-white ${selectedGame === 'ticTacToe' ? 'bg-blue-600' : 'bg-gray-700'}`}>
          Tic Tac Toe
        </button>
      </nav>
      <div className="flex-grow h-full">
        {selectedGame === 'flappy' ? <Game /> : <TicTacToeGame />}
      </div>
      <footer className="p-4 text-center bg-gray-800 text-white">
        <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
          Made on ZAPT
        </a>
      </footer>
    </div>
  );
}

export default App;