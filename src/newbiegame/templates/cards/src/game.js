import { GameLoop } from "./core/GameLoop.js";
import { Input } from "./core/Input.js";

export class Game {
  constructor(options) {
    this.canvas = document.getElementById(options.canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.width = options.width || 800;
    this.height = options.height || 450;
    this.input = new Input(this.canvas);

    this.showInspector = false;
    this.reset();

    this.loop = new GameLoop(
      () => this.update(),
      () => this.draw()
    );
  }

  reset() {
    this.playerHp = 100;
    this.enemyHp = 100;
    this.battleLog = "Select a card to play your turn.";
    this.selectedCard = null;
    this.turn = 1;

    this.cards = [
      { id: "strike", name: "Heavy Strike", type: "ATTACK", val: 25, x: 160, y: 240, w: 120, h: 160, color: "#334155", hoverY: 0 },
      { id: "shield", name: "Iron Shield", type: "DEFEND", val: 15, x: 340, y: 240, w: 120, h: 160, color: "#0284c7", hoverY: 0 },
      { id: "heal", name: "Quick Heal", type: "HEAL", val: 20, x: 520, y: 240, w: 120, h: 160, color: "#16a34a", hoverY: 0 }
    ];
  }

  start() {
    this.loop.start();
  }

  playTurn(card) {
    this.selectedCard = card;

    if (card.type === "ATTACK") {
      this.enemyHp = Math.max(0, this.enemyHp - card.val);
      this.battleLog = `You played ${card.name}! Dealt ${card.val} damage to enemy.`;
    } else if (card.type === "DEFEND") {
      this.battleLog = `You played ${card.name}! Blocked enemy counter-attack.`;
    } else if (card.type === "HEAL") {
      this.playerHp = Math.min(100, this.playerHp + card.val);
      this.battleLog = `You played ${card.name}! Restored ${card.val} HP.`;
    }

    // Simple Enemy AI turn
    if (this.enemyHp > 0) {
      setTimeout(() => {
        if (card.type !== "DEFEND") {
          const dmg = 15;
          this.playerHp = Math.max(0, this.playerHp - dmg);
          this.battleLog += ` Enemy counter-attacked for ${dmg} DMG!`;
        }
      }, 300);
    }

    this.turn += 1;
  }

  update() {
    if (this.input.isJustPressed("Tab")) {
      this.showInspector = !this.showInspector;
    }

    const clicked = this.input.consumeClick();

    this.cards.forEach((card) => {
      const mx = this.input.mouse.x;
      const my = this.input.mouse.y;
      const targetHoverY = (mx >= card.x && mx <= card.x + card.w && my >= card.y - 20 && my <= card.y + card.h) ? -18 : 0;

      // Smooth card lift animation on hover
      card.hoverY += (targetHoverY - card.hoverY) * 0.2;

      if (targetHoverY !== 0 && clicked && this.playerHp > 0 && this.enemyHp > 0) {
        this.playTurn(card);
      }
    });

    this.input.clearJustPressed();
  }

  draw() {
    // Battle arena background
    this.ctx.fillStyle = "#0f172a";
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Title & Health HUD
    this.ctx.fillStyle = "#f8fafc";
    this.ctx.font = "bold 22px sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.fillText("Card Battle Arena", this.width / 2, 40);

    // Player HP Bar
    this.drawHealthBar(80, 70, 240, 20, this.playerHp, 100, "Player HP", "#38bdf8");
    // Enemy HP Bar
    this.drawHealthBar(480, 70, 240, 20, this.enemyHp, 100, "Enemy HP", "#ef4444");

    // Battle Log text
    this.ctx.fillStyle = "#fbbf24";
    this.ctx.font = "15px sans-serif";
    this.ctx.fillText(this.battleLog, this.width / 2, 140);

    // Draw cards with 3D shadow and lift animation
    this.cards.forEach((c) => {
      this.ctx.save();
      const currentY = c.y + c.hoverY;

      if (c.hoverY < -2) {
        this.ctx.shadowColor = "#38bdf8";
        this.ctx.shadowBlur = 18;
      }

      this.ctx.fillStyle = c.color;
      this.ctx.fillRect(c.x, currentY, c.w, c.h);

      this.ctx.strokeStyle = "#ffffff";
      this.ctx.lineWidth = c.hoverY < -2 ? 3 : 1;
      this.ctx.strokeRect(c.x, currentY, c.w, c.h);

      this.ctx.fillStyle = "#ffffff";
      this.ctx.font = "bold 14px sans-serif";
      this.ctx.textAlign = "center";
      this.ctx.fillText(c.name, c.x + c.w / 2, currentY + 35);

      this.ctx.font = "12px sans-serif";
      this.ctx.fillStyle = "#94a3b8";
      this.ctx.fillText(c.type, c.x + c.w / 2, currentY + 65);

      this.ctx.font = "bold 18px sans-serif";
      this.ctx.fillStyle = "#fbbf24";
      this.ctx.fillText(`${c.val}`, c.x + c.w / 2, currentY + 115);

      this.ctx.restore();
    });

    if (this.showInspector) {
      this.drawInspector();
    }
  }

  drawHealthBar(x, y, w, h, current, max, label, color) {
    this.ctx.save();
    this.ctx.fillStyle = "#1e293b";
    this.ctx.fillRect(x, y, w, h);

    const ratio = Math.max(0, current / max);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, w * ratio, h);

    this.ctx.strokeStyle = "#475569";
    this.ctx.strokeRect(x, y, w, h);

    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = "12px monospace";
    this.ctx.textAlign = "left";
    this.ctx.fillText(`${label}: ${current}/${max}`, x, y - 6);
    this.ctx.restore();
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
    this.ctx.fillText(`Player HP: ${this.playerHp}/100`, 20, 95);
    this.ctx.fillText(`Enemy HP: ${this.enemyHp}/100`, 20, 115);
    this.ctx.fillText(`Current Turn: ${this.turn}`, 20, 135);
    this.ctx.fillText(`Cards Count: ${this.cards.length}`, 20, 155);
    this.ctx.restore();
  }
}
