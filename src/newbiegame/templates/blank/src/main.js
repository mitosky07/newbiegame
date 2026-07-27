import { Game } from "./game.js";

window.addEventListener("DOMContentLoaded", () => {
  const game = new Game({ canvasId: "game", width: {{ canvas_width }}, height: {{ canvas_height }} });
  game.start();
  console.log("[GAME] Blank canvas engine initialized.");
});
