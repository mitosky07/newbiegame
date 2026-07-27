// Score.js handles tracking and drawing current score on canvas.
export class Score {
  constructor(targetScore = 5) {
    this.value = 0;
    this.targetScore = targetScore;
  }

  add(points = 1) {
    this.value += points;
  }

  reset() {
    this.value = 0;
  }

  hasWon() {
    return this.value >= this.targetScore;
  }

  draw(ctx) {
    ctx.save();
    ctx.font = "bold 18px sans-serif";
    ctx.fillStyle = "#f8fafc";
    ctx.fillText(`Coins: ${this.value} / ${this.targetScore}`, 20, 36);
    ctx.restore();
  }
}
