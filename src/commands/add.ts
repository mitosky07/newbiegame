import fs from "node:fs";
import path from "node:path";
import pc from "picocolors";
import { ProjectConfig } from "../models/project.js";
import { handleError, NewbieGameError } from "../errors.js";

const COMPONENTS: Record<string, { file: string; content: string }> = {
  score: {
    file: "src/components/Score.js",
    content: `export class Score {
  constructor(targetScore = 10) {
    this.value = 0;
    this.targetScore = targetScore;
  }
  add(points = 1) { this.value += points; }
  reset() { this.value = 0; }
  draw(ctx) {
    ctx.save();
    ctx.font = "bold 18px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(\`Score: \${this.value}\`, 20, 30);
    ctx.restore();
  }
}
`
  },
  keyboard: {
    file: "src/core/Input.js",
    content: `export class Input {
  constructor() {
    this.keys = {};
    window.addEventListener("keydown", (e) => (this.keys[e.code] = true));
    window.addEventListener("keyup", (e) => (this.keys[e.code] = false));
  }
  isDown(code) { return !!this.keys[code]; }
}
`
  },
  collision: {
    file: "src/components/Collision.js",
    content: `export class Collision {
  static checkAABB(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }
}
`
  },
  audio: {
    file: "src/core/Sound.js",
    content: `export class Sound {
  constructor() { this.ctx = null; }
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }
  playBeep() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }
}
`
  }
};

export function runAddCommand(componentName?: string): void {
  try {
    const cwd = process.cwd();
    const config = ProjectConfig.load(cwd);
    if (!config) {
      throw new NewbieGameError("Not inside a valid NewbieGame project directory.");
    }

    if (!componentName) {
      throw new NewbieGameError(
        "Please specify a component name to add.",
        `Available components: ${Object.keys(COMPONENTS).join(", ")}`
      );
    }

    const key = componentName.toLowerCase().trim();
    if (!(key in COMPONENTS)) {
      throw new NewbieGameError(
        `Unknown component '${componentName}'.`,
        `Available components: ${Object.keys(COMPONENTS).join(", ")}`
      );
    }

    const comp = COMPONENTS[key];
    const targetPath = path.join(cwd, comp.file);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, comp.content, "utf-8");

    console.log(pc.green(`  [+] Created ${comp.file}`));
    console.log(pc.bold(pc.green(`[SUCCESS] Component '${key}' added successfully.\n`)));
  } catch (err) {
    handleError(err);
  }
}
