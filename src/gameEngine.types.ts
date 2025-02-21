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
export const gravity = 0.3; // Reduced gravity for gentler drops
export const flap = -10; // Maintained upward force for control
export const pipeSpeed = 1.0; // Reduced pipe speed for easier reaction
export const pipeInterval = 1500;
export const pipeWidth = 60;
export const gapHeight = 300; // Increased gap height for easier navigation