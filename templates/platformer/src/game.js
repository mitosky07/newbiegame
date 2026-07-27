import { GameLoop } from "./core/GameLoop.js";
import { Input } from "./core/Input.js";

export class Game {
  constructor(options) {
    this.canvas = document.getElementById(options.canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.width = options.width || 800;
    this.height = options.height || 450;
    this.input = new Input();

    this.particles = [];
    this.showInspector = false;

    this.reset();

    this.loop = new GameLoop(
      (dt) => this.update(dt),
      () => this.draw()
    );
  }

  reset() {
    this.player = {
      x: 50,
      y: 300,
      vx: 0,
      vy: 0,
      w: 32,
      h: 32,
      grounded: false,
      coyoteTime: 0,
      squashX: 1,
      squashY: 1
    };
    this.gravity = 950;
    this.jumpForce = -440;
    this.speed = 240;
    this.particles = [];

    this.platforms = [
      { x: 0, y: 400, w: 800, h: 50 },
      { x: 160, y: 300, w: 140, h: 20 },
      { x: 360, y: 220, w: 160, h: 20 },
      { x: 580, y: 140, w: 140, h: 20 }
    ];
  }

  spawnDust(x, y, count = 6) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y,
        vx: (Math.random() - 0.5) * 80,
        vy: -Math.random() * 40,
        size: 3 + Math.random() * 3,
        life: 0.3,
        maxLife: 0.3
      });
    }
  }

  start() {
    this.loop.start();
  }

  update(dt) {
    if (this.input.isJustPressed("Tab")) {
      this.showInspector = !this.showInspector;
    }

    // Horizontal movement
    this.player.vx = 0;
    if (this.input.isDown("KeyA") || this.input.isDown("ArrowLeft")) this.player.vx = -this.speed;
    if (this.input.isDown("KeyD") || this.input.isDown("ArrowRight")) this.player.vx = this.speed;

    // Coyote time for forgiving jump feel
    if (this.player.grounded) {
      this.player.coyoteTime = 0.12;
    } else {
      this.player.coyoteTime -= dt;
    }

    // Jump
    const jumpPressed = this.input.isJustPressed("Space") || this.input.isJustPressed("KeyW") || this.input.isJustPressed("ArrowUp");
    if (jumpPressed && this.player.coyoteTime > 0) {
      this.player.vy = this.jumpForce;
      this.player.grounded = false;
      this.player.coyoteTime = 0;
      this.player.squashX = 0.7;
      this.player.squashY = 1.3;
      this.spawnDust(this.player.x + 16, this.player.y + 32);
    }

    // Smooth return of squash and stretch animation
    this.player.squashX += (1 - this.player.squashX) * 10 * dt;
    this.player.squashY += (1 - this.player.squashY) * 10 * dt;

    // Apply gravity
    this.player.vy += this.gravity * dt;

    this.player.x += this.player.vx * dt;
    this.player.y += this.player.vy * dt;

    // Platform collisions
    const prevGrounded = this.player.grounded;
    this.player.grounded = false;

    this.platforms.forEach((p) => {
      if (
        this.player.x < p.x + p.w &&
        this.player.x + this.player.w > p.x &&
        this.player.y + this.player.h >= p.y &&
        this.player.y + this.player.h <= p.y + p.h + 12 &&
        this.player.vy >= 0
      ) {
        this.player.y = p.y - this.player.h;
        this.player.vy = 0;
        this.player.grounded = true;

        if (!prevGrounded) {
          this.player.squashX = 1.3;
          this.player.squashY = 0.7;
          this.spawnDust(this.player.x + 16, p.y);
        }
      }
    });

    // Update dust particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.life -= dt;
      if (pt.life <= 0) this.particles.splice(i, 1);
    }

    this.input.clearJustPressed();
  }

  draw() {
    this.ctx.fillStyle = "#0f172a";
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw platforms
    this.ctx.fillStyle = "#334155";
    this.platforms.forEach((p) => this.ctx.fillRect(p.x, p.y, p.w, p.h));

    // Draw dust particles
    this.particles.forEach((pt) => {
      this.ctx.save();
      this.ctx.fillStyle = "#94a3b8";
      this.ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
      this.ctx.beginPath();
      this.ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });

    // Draw player with squash & stretch transform
    this.ctx.save();
    const centerX = this.player.x + this.player.w / 2;
    const bottomY = this.player.y + this.player.h;
    this.ctx.translate(centerX, bottomY);
    this.ctx.scale(this.player.squashX, this.player.squashY);

    this.ctx.fillStyle = "#38bdf8";
    this.ctx.fillRect(-this.player.w / 2, -this.player.h, this.player.w, this.player.h);
    this.ctx.restore();

    // HUD
    this.ctx.fillStyle = "#f8fafc";
    this.ctx.font = "15px sans-serif";
    this.ctx.fillText("Platformer 2D Engine", 20, 30);

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
    this.ctx.fillText(`Player Pos: X:${Math.round(this.player.x)} Y:${Math.round(this.player.y)}`, 20, 95);
    this.ctx.fillText(`VY: ${Math.round(this.player.vy)} | Grounded: ${this.player.grounded}`, 20, 115);
    this.ctx.fillText(`Gravity: ${this.gravity} | Jump: ${this.jumpForce}`, 20, 135);
    this.ctx.fillText(`Coyote Time: ${Math.max(0, this.player.coyoteTime).toFixed(2)}s`, 20, 155);
    this.ctx.restore();
  }
}
