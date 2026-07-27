// Player.js represents the hero character on screen with motion aura and glow.
export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.speed = 240; // Movement speed in pixels per second
    this.color = "#38bdf8"; // Cyan
    this.trail = [];
    this.facing = "down";
  }

  update(deltaTime, input, canvasWidth, canvasHeight) {
    let dx = 0;
    let dy = 0;

    if (input.isDown("KeyA") || input.isDown("ArrowLeft")) { dx -= 1; this.facing = "left"; }
    if (input.isDown("KeyD") || input.isDown("ArrowRight")) { dx += 1; this.facing = "right"; }
    if (input.isDown("KeyW") || input.isDown("ArrowUp")) { dy -= 1; this.facing = "up"; }
    if (input.isDown("KeyS") || input.isDown("ArrowDown")) { dy += 1; this.facing = "down"; }

    if (dx !== 0 && dy !== 0) {
      dx *= 0.7071;
      dy *= 0.7071;
    }

    if (dx !== 0 || dy !== 0) {
      // Add motion trail point
      this.trail.push({ x: this.x, y: this.y, alpha: 0.4 });
      if (this.trail.length > 5) this.trail.shift();
    }

    this.x += dx * this.speed * deltaTime;
    this.y += dy * this.speed * deltaTime;

    // Decay trail alpha
    this.trail.forEach((t) => (t.alpha -= deltaTime * 1.5));
    this.trail = this.trail.filter((t) => t.alpha > 0);

    // Keep inside boundaries
    this.x = Math.max(0, Math.min(this.x, canvasWidth - this.width));
    this.y = Math.max(0, Math.min(this.y, canvasHeight - this.height));
  }

  draw(ctx) {
    // Draw motion trail
    this.trail.forEach((t) => {
      ctx.save();
      ctx.fillStyle = "#38bdf8";
      ctx.globalAlpha = Math.max(0, t.alpha);
      ctx.fillRect(t.x, t.y, this.width, this.height);
      ctx.restore();
    });

    // Draw main hero body with neon glow
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 14;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Draw inner accent line
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4);

    // Draw eyes based on direction
    ctx.fillStyle = "#0f172a";
    let eyeX1 = this.x + 8, eyeY1 = this.y + 10;
    let eyeX2 = this.x + 24, eyeY2 = this.y + 10;

    if (this.facing === "left") { eyeX1 = this.x + 4; eyeX2 = this.x + 18; }
    else if (this.facing === "right") { eyeX1 = this.x + 18; eyeX2 = this.x + 32; }
    else if (this.facing === "up") { eyeY1 = this.y + 4; eyeY2 = this.y + 4; }

    ctx.fillRect(eyeX1, eyeY1, 8, 8);
    ctx.fillRect(eyeX2, eyeY2, 8, 8);

    ctx.restore();
  }
}
