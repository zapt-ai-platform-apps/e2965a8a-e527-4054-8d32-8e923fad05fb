import React, { useEffect, useRef, useState } from "react";
import {
  onKeyDown,
  gameLoop,
  startGame,
  restartGame,
  toggleFullScreen,
  Pipe,
  Bird,
  GameState,
} from "./gameEngine";

function Game() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<GameState>("start");
  const requestRef = useRef<number>(0);
  const pipesRef = useRef<Pipe[]>([]);
  const lastPipeTimeRef = useRef<number>(0);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const bird = useRef<Bird>({
    x: 100,
    y: 300,
    width: 40,
    height: 30,
    velocity: 0,
  });

  const gameStateRef = useRef<GameState>(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    if (gameState === "playing") {
      const handleKeyDown = (e: KeyboardEvent) => onKeyDown(e, bird, canvasRef, () => gameStateRef.current);
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        cancelAnimationFrame(requestRef.current);
      };
    }
  }, [gameState]);

  const handleStartGame = () => {
    startGame(canvasRef, pipesRef, lastPipeTimeRef, bird, setGameState, () => gameStateRef.current, requestRef);
  };

  const handleRestartGame = () => {
    restartGame(canvasRef, pipesRef, lastPipeTimeRef, bird, setGameState, () => gameStateRef.current, requestRef);
  };

  const handleToggleFullScreen = () => {
    toggleFullScreen(canvasRef, setIsFullScreen);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-black text-white">
      <canvas ref={canvasRef} width={800} height={600} className="border border-gray-800" />
      {gameState === "start" && (
        <div className="absolute flex flex-col items-center">
          <button onClick={handleStartGame} className="cursor-pointer bg-blue-600 text-white px-4 py-2 mt-4">
            Start
          </button>
        </div>
      )}
      {gameState === "gameover" && (
        <div className="absolute flex flex-col items-center">
          <button onClick={handleRestartGame} className="cursor-pointer bg-blue-600 text-white px-4 py-2 mt-4">
            Restart
          </button>
        </div>
      )}
      <button
        onClick={handleToggleFullScreen}
        className="absolute top-4 right-4 cursor-pointer bg-gray-700 text-white px-2 py-1"
      >
        Full Screen
      </button>
    </div>
  );
}

export default Game;