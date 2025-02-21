import React from "react";

export interface Pipe {
  x: number;
  gapY: number;
  width: number;
  gapHeight: number;
}

export interface Bird {
  x: number;
  y: number;
  width: number;
  height: number;
  velocity: number;
}

export type GameState = "start" | "playing" | "gameover";

// Game physics constants modified for easier gameplay
export const gravity = 0.5;
export const flap = -10; // Increased upward force for easier control
export const pipeSpeed = 1.5; // Slower pipes for easier reaction time
export const pipeInterval = 1500;
export const pipeWidth = 60;
export const gapHeight = 200; // Larger gap for easier navigation