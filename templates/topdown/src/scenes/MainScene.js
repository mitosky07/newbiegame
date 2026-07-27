import { Player } from "../entities/Player.js";
import { Collectible } from "../entities/Collectible.js";
import { Collision } from "../components/Collision.js";
import { Score } from "../components/Score.js";
import { Sound } from "../core/Sound.js";

export class MainScene {
  constructor(canvasWidth, canvasHeight) {
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.sound = new Sound();
    this.score = new Score(5);

    this.particles = [];
    this.floatingTexts = [];
    this.screenShake = 0;
    this.showInspector = false;

    this.dpadState = { left: false, right: false, up: false, down: false };

    this.attachDomHandlers();
    this.reset();
  }

  attachDomHandlers() {
    const btnInspect = document.getElementById("btn-inspector");
    if (btnInspect) {
      btnInspect.addEventListener("click", () => {
        this.showInspector = !this.showInspector;
      });
    }

    const btnReset = document.getElementById("btn-reset");
    if (btnReset) {
      btnReset.addEventListener("click", () => {
        this.reset();
      });
    }

    // Touch/Mouse D-Pad Controls
    const setupDpadBtn = (id, direction) => {
      const el = document.getElementById(id);
      if (!el) return;
      const start = (e) => { e.preventDefault(); this.dpadState[direction] = true; };
      const end = (e) => { e.preventDefault(); this.dpadState[direction] = false; };
      el.addEventListener("mousedown", start);
      el.addEventListener("mouseup", end);
      el.addEventListener("touchstart", start);
      el.addEventListener("touchend", end);
    };

    setupDpadBtn("btn-left", "left");
    setupDpadBtn("btn-right", "right");
    setupDpadBtn("btn-up", "up");
    setupDpadBtn("btn-down", "down");
  }

  reset() {
    this.player = new Player(100, 100);
    this.score.reset();
    this.isVictory = false;
    this.particles = [];
    this.floatingTexts = [];

    // Spawn 5 coins in random safe locations
    this.collectibles = [];
    for (let i = 0; i < 5; i++) {
      const x = 80 + Math.random() * (this.width - 160);
      const y = 80 + Math.random() * (this.height - 160);
      this.collectibles.push(new Collectible(x, y));
    }
  }

  spawnBurst(x, y, color = "#fbbf24", count = 12) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 140;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 4,
        color,
        life: 0.4 + Math.random() * 0.3,
        maxLife: 0.7
      });
    }
  }

  addFloatingText(text, x, y, color = "#fbbf24") {
    this.floatingTexts.push({
      text,
      x,
      y,
      vy: -40,
      life: 0.8,
      maxLife: 0.8,
      color
    });
  }

  update(deltaTime, input) {
    if (input.isJustPressed("Tab")) {
      this.showInspector = !this.showInspector;
    }

    if (this.isVictory) {
      if (input.isDown("Space") || input.isDown("Enter")) {
        this.reset();
      }
      return;
    }

    if (this.screenShake > 0) {
      this.screenShake -= deltaTime * 30;
      if (this.screenShake < 0) this.screenShake = 0;
    }

    // Merge D-Pad state with Input system
    const mergedInput = {
      isDown: (code) => {
        if (code === "KeyA" || code === "ArrowLeft") return input.isDown(code) || this.dpadState.left;
        if (code === "KeyD" || code === "ArrowRight") return input.isDown(code) || this.dpadState.right;
        if (code === "KeyW" || code === "ArrowUp") return input.isDown(code) || this.dpadState.up;
        if (code === "KeyS" || code === "ArrowDown") return input.isDown(code) || this.dpadState.down;
        return input.isDown(code);
      }
    };

    this.player.update(deltaTime, mergedInput, this.width, this.height);

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      p.life -= deltaTime;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Update floating texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy * deltaTime;
      ft.life -= deltaTime;
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }

    // Check collectibles collision
    this.collectibles.forEach((item) => {
      item.update(deltaTime);
      if (!item.collected && Collision.checkAABB(this.player, item)) {
        item.collected = true;
        this.score.add(1);
        this.sound.playCollect();
        this.spawnBurst(item.x + item.width / 2, item.y + item.height / 2);
        this.addFloatingText("+1 COIN", item.x + item.width / 2, item.y);
        this.screenShake = 4;

        if (this.score.hasWon()) {
          this.isVictory = true;
          this.sound.playWin();
          this.spawnBurst(this.width / 2, this.height / 2, "#38bdf8", 40);
        }
      }
    });

    input.clearJustPressed();
  }

  draw(ctx) {
    ctx.save();

    if (this.screenShake > 0) {
      const shakeX = (Math.random() - 0.5) * this.screenShake;
      const shakeY = (Math.random() - 0.5) * this.screenShake;
      ctx.translate(shakeX, shakeY);
    }

    // Background gradient
    const bgGrad = ctx.createRadialGradient(this.width / 2, this.height / 2, 50, this.width / 2, this.height / 2, 500);
    bgGrad.addColorStop(0, "#1e293b");
    bgGrad.addColorStop(1, "#0b0f19");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Dynamic grid lines
    ctx.strokeStyle = "rgba(51, 65, 85, 0.4)";
    ctx.lineWidth = 1;
    for (let x = 0; x < this.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }
    for (let y = 0; y < this.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }

    // Draw entities
    this.collectibles.forEach((item) => item.draw(ctx));
    this.player.draw(ctx);

    // Draw particles
    this.particles.forEach((p) => {
      ctx.save();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw floating texts
    this.floatingTexts.forEach((ft) => {
      ctx.save();
      ctx.fillStyle = ft.color;
      ctx.globalAlpha = Math.max(0, ft.life / ft.maxLife);
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    });

    this.score.draw(ctx);

    if (this.showInspector) {
      this.drawInspector(ctx);
    }

    if (this.isVictory) {
      ctx.save();
      ctx.fillStyle = "rgba(11, 15, 25, 0.90)";
      ctx.fillRect(0, 0, this.width, this.height);

      ctx.textAlign = "center";
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 32px sans-serif";
      ctx.fillText("STAGE CLEAR!", this.width / 2, this.height / 2 - 20);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "16px sans-serif";
      ctx.fillText("You collected all 5 coins!", this.width / 2, this.height / 2 + 20);
      ctx.fillText("Press Space or Enter to play again", this.width / 2, this.height / 2 + 50);
      ctx.restore();
    }

    ctx.restore();
  }

  drawInspector(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(15, 23, 42, 0.94)";
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1.5;
    ctx.fillRect(10, 50, 270, 160);
    ctx.strokeRect(10, 50, 270, 160);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 12px monospace";
    ctx.fillText("[ LIVE DEV INSPECTOR ]", 20, 72);

    ctx.fillStyle = "#f8fafc";
    ctx.font = "12px monospace";
    ctx.fillText(`Player Pos: X:${Math.round(this.player.x)} Y:${Math.round(this.player.y)}`, 20, 95);
    ctx.fillText(`Player Speed: ${this.player.speed} px/s`, 20, 115);
    ctx.fillText(`Coins Remaining: ${this.collectibles.filter(c => !c.collected).length}`, 20, 135);
    ctx.fillText(`Active Particles: ${this.particles.length}`, 20, 155);
    ctx.restore();
  }
}
