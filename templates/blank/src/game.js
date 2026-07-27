import { GameLoop } from "./core/GameLoop.js";
import { Input } from "./core/Input.js";

export class Game {
  constructor(options) {
    this.canvas = document.getElementById(options.canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.width = options.width || 800;
    this.height = options.height || 450;
    this.input = new Input(this.canvas);
    this.x = 375;
    this.y = 200;
    this.particles = [];
    this.showInspector = false;
    this.fps = 60;

    this.loop = new GameLoop(
      (dt) => this.update(dt),
      () => this.draw()
    );
  }

  start() {
    this.loop.start();
  }

  update(dt) {
    if (dt > 0) this.fps = Math.round(1 / dt);

    if (this.input.isJustPressed("Tab")) {
      this.showInspector = !this.showInspector;
    }

    if (this.input.isDown("ArrowRight") || this.input.isDown("KeyD")) {
      this.x += 240 * dt;
    }
    if (this.input.isDown("ArrowLeft") || this.input.isDown("KeyA")) {
      this.x -= 240 * dt;
    }

    // Keep square bounded
    this.x = Math.max(0, Math.min(this.x, this.width - 50));

    // Emit particles on mouse movement
    if (this.input.mouse.x > 0 && this.input.mouse.y > 0) {
      this.particles.push({
        x: this.input.mouse.x,
        y: this.input.mouse.y,
        vx: (Math.random() - 0.5) * 60,
        vy: (Math.random() - 0.5) * 60,
        size: 2 + Math.random() * 4,
        color: "#38bdf8",
        life: 0.5,
        maxLife: 0.5
      });
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    this.input.clearJustPressed();
  }

  draw() {
    this.ctx.fillStyle = "#0f172a";
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw mouse particles
    this.particles.forEach((p) => {
      this.ctx.save();
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });

    // Draw square
    this.ctx.fillStyle = "#38bdf8";
    this.ctx.fillRect(this.x, this.y, 50, 50);

    this.ctx.fillStyle = "#f8fafc";
    this.ctx.font = "16px sans-serif";
    this.ctx.fillText("Blank Canvas Starter - Custom rendering ready", 20, 30);

    if (this.showInspector) {
      this.drawInspector();
    }
  }

  drawInspector() {
    this.ctx.save();
    this.ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
    this.ctx.strokeStyle = "#38bdf8";
    this.ctx.lineWidth = 1;
    this.ctx.fillRect(10, 50, 260, 140);
    this.ctx.strokeRect(10, 50, 260, 140);

    this.ctx.fillStyle = "#38bdf8";
    this.ctx.font = "bold 13px monospace";
    this.ctx.fillText("[ LIVE DEV INSPECTOR ]", 20, 72);

    this.ctx.fillStyle = "#f8fafc";
    this.ctx.font = "12px monospace";
    this.ctx.fillText(`Square Pos: X:${Math.round(this.x)} Y:${Math.round(this.y)}`, 20, 95);
    this.ctx.fillText(`FPS: ${this.fps}`, 20, 115);
    this.ctx.fillText(`Mouse: X:${Math.round(this.input.mouse.x)} Y:${Math.round(this.input.mouse.y)}`, 20, 135);
    this.ctx.fillText(`Active Particles: ${this.particles.length}`, 20, 155);
    this.ctx.restore();
  }
}
