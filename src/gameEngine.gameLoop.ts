import * as Sentry from "@sentry/browser";
import React from "react";
import { Pipe, Bird, GameState, gravity, flap, pipeSpeed, pipeInterval, pipeWidth, gapHeight } from "./gameEngine.types";

export function onKeyDown(
  e: KeyboardEvent,
  bird: React.MutableRefObject<Bird>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  getGameState: () => GameState
) {
  if (getGameState() !== "playing") return;
  if (e.key === "ArrowUp") {
    bird.current.velocity = flap;
  } else if (e.key === "ArrowDown") {
    bird.current.velocity += 2;
  } else if (e.key === "ArrowLeft") {
    bird.current.x = Math.max(0, bird.current.x - 5);
  } else if (e.key === "ArrowRight") {
    bird.current.x = Math.min(
      (canvasRef.current?.width || 800) - bird.current.width,
      bird.current.x + 5
    );
  }
}

export function gameLoop(
  timestamp: number,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  pipesRef: React.MutableRefObject<Pipe[]>,
  lastPipeTimeRef: React.MutableRefObject<number>,
  bird: React.MutableRefObject<Bird>,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  getGameState: () => GameState,
  requestRef: React.MutableRefObject<number>
) {
  try {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#6dd5fa");
    gradient.addColorStop(1, "#ffffff");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    pipesRef.current.forEach((pipe) => {
      context.fillStyle = "#228B22";
      context.fillRect(pipe.x, 0, pipe.width, pipe.gapY);
      context.fillRect(
        pipe.x,
        pipe.gapY + pipe.gapHeight,
        pipe.width,
        canvas.height - (pipe.gapY + pipe.gapHeight)
      );
    });

    pipesRef.current.forEach((pipe) => {
      pipe.x -= pipeSpeed;
    });
    pipesRef.current = pipesRef.current.filter((pipe) => pipe.x + pipe.width > 0);

    if (timestamp - lastPipeTimeRef.current > pipeInterval) {
      const gapY = Math.random() * (canvas.height - gapHeight - 40) + 20;
      pipesRef.current.push({
        x: canvas.width,
        gapY,
        width: pipeWidth,
        gapHeight,
      });
      lastPipeTimeRef.current = timestamp;
    }

    bird.current.velocity += gravity;
    bird.current.y += bird.current.velocity;

    context.fillStyle = "#FFD700";
    context.fillRect(
      bird.current.x,
      bird.current.y,
      bird.current.width,
      bird.current.height
    );

    if (bird.current.y < 0 || bird.current.y + bird.current.height > canvas.height) {
      setGameState("gameover");
    }
    for (let pipe of pipesRef.current) {
      if (
        bird.current.x < pipe.x + pipe.width &&
        bird.current.x + bird.current.width > pipe.x &&
        (bird.current.y < pipe.gapY ||
          bird.current.y + bird.current.height > pipe.gapY + pipe.gapHeight)
      ) {
        setGameState("gameover");
      }
    }

    if (getGameState() === "playing") {
      requestRef.current = requestAnimationFrame((ts) =>
        gameLoop(ts, canvasRef, pipesRef, lastPipeTimeRef, bird, setGameState, getGameState, requestRef)
      );
    } else if (getGameState() === "gameover") {
      context.fillStyle = "black";
      context.font = "40px 'Press Start 2P'";
      context.textAlign = "center";
      context.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    }
  } catch (error) {
    console.error("Error in game loop:", error);
    Sentry.captureException(error);
  }
}

export function startGame(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  pipesRef: React.MutableRefObject<Pipe[]>,
  lastPipeTimeRef: React.MutableRefObject<number>,
  bird: React.MutableRefObject<Bird>,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  getGameState: () => GameState,
  requestRef: React.MutableRefObject<number>
) {
  console.log("Starting game...");
  setGameState("playing");
  bird.current = { x: 100, y: 300, width: 40, height: 30, velocity: 0 };
  pipesRef.current = [];
  lastPipeTimeRef.current = 0;
  requestRef.current = requestAnimationFrame((ts) =>
    gameLoop(ts, canvasRef, pipesRef, lastPipeTimeRef, bird, setGameState, getGameState, requestRef)
  );
}

export function restartGame(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  pipesRef: React.MutableRefObject<Pipe[]>,
  lastPipeTimeRef: React.MutableRefObject<number>,
  bird: React.MutableRefObject<Bird>,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  getGameState: () => GameState,
  requestRef: React.MutableRefObject<number>
) {
  console.log("Restarting game...");
  startGame(canvasRef, pipesRef, lastPipeTimeRef, bird, setGameState, getGameState, requestRef);
}

export function toggleFullScreen(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  setIsFullScreen: React.Dispatch<React.SetStateAction<boolean>>
) {
  const canvas = canvasRef.current;
  if (!canvas) return;
  if (!document.fullscreenElement) {
    canvas.requestFullscreen().catch((err) => {
      console.error("Full screen error:", err);
    });
    setIsFullScreen(true);
  } else {
    document.exitFullscreen();
    setIsFullScreen(false);
  }
}