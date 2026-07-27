export class GameLoop {
  constructor(updateFn, renderFn) {
    this.updateFn = updateFn;
    this.renderFn = renderFn;
    this.lastTime = 0;
    this.isRunning = false;
    this.requestId = null;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.loop = this.loop.bind(this);
    this.requestId = requestAnimationFrame(this.loop);
  }

  stop() {
    this.isRunning = false;
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
    }
  }

  loop(currentTime) {
    if (!this.isRunning) return;
    const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.05);
    this.lastTime = currentTime;

    this.updateFn(deltaTime);
    this.renderFn();

    this.requestId = requestAnimationFrame(this.loop);
  }
}
