// Collectible.js represents glowing floating coins to pick up.
export class Collectible {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 24;
    this.height = 24;
    this.collected = false;
    this.floatAngle = Math.random() * Math.PI * 2;
  }

  update(deltaTime) {
    this.floatAngle += deltaTime * 4;
  }

  draw(ctx) {
    if (this.collected) return;

    ctx.save();
    const floatOffsetY = Math.sin(this.floatAngle) * 5;
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2 + floatOffsetY;

    // Outer glow ring
    ctx.shadowColor = "#f59e0b";
    ctx.shadowBlur = 16;
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
    ctx.fill();

    // Inner core
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
