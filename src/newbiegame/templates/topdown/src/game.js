import { GameLoop } from "./core/GameLoop.js";
import { Input } from "./core/Input.js";
import { MainScene } from "./scenes/MainScene.js";

export class Game {
  constructor(options) {
    this.canvas = document.getElementById(options.canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.width = options.width || 800;
    this.height = options.height || 450;

    this.input = new Input();
    this.scene = new MainScene(this.width, this.height);

    this.loop = new GameLoop(
      (dt) => this.scene.update(dt, this.input),
      () => this.scene.draw(this.ctx)
    );
  }

  start() {
    this.loop.start();
  }
}
