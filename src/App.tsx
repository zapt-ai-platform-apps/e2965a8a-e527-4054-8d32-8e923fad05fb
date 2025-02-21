import React from 'react';
import Game from './Game';
import './index.css';

function App() {
  return (
    <div className="min-h-screen h-full flex flex-col">
      <div className="flex-grow h-full">
        <Game />
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