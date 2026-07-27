"""Command implementation for newbiegame add."""

from pathlib import Path
from typing import Optional
from rich.prompt import Prompt

from newbiegame.utils import console
from newbiegame.errors import handle_error, ProjectConfigNotFound, NewbieGameError
from newbiegame.models.project import ProjectConfig

COMPONENTS = {
    "score": {
        "file": "src/components/Score.js",
        "content": """export class Score {
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
    ctx.fillText(`Score: ${this.value}`, 20, 30);
    ctx.restore();
  }
}
"""
    },
    "keyboard": {
        "file": "src/core/Input.js",
        "content": """export class Input {
  constructor() {
    this.keys = {};
    window.addEventListener("keydown", (e) => (this.keys[e.code] = true));
    window.addEventListener("keyup", (e) => (this.keys[e.code] = false));
  }
  isDown(code) { return !!this.keys[code]; }
}
"""
    },
    "collision": {
        "file": "src/components/Collision.js",
        "content": """export class Collision {
  static checkAABB(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }
}
"""
    },
    "audio": {
        "file": "src/core/Sound.js",
        "content": """export class Sound {
  constructor() {
    this.ctx = null;
  }
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
"""
    }
}


def run_add_command(component_name: Optional[str] = None) -> None:
    """Inject a new component into the current project."""
    try:
        cwd = Path.cwd()
        config = ProjectConfig.load(cwd)
        if not config:
            raise ProjectConfigNotFound("Not inside a valid NewbieGame project directory.")

        if not component_name:
            console.print("\n[bold yellow]? Select component to add:[/bold yellow]")
            for key in COMPONENTS.keys():
                console.print(f"  > [bold cyan]{key}[/bold cyan]")
            component_name = Prompt.ask("\nChoice", choices=list(COMPONENTS.keys()), default="score")

        comp_key = component_name.lower().strip()
        if comp_key not in COMPONENTS:
            raise NewbieGameError(
                f"Unknown component '{component_name}'.",
                f"Available components: {', '.join(COMPONENTS.keys())}"
            )

        comp = COMPONENTS[comp_key]
        target_path = cwd / comp["file"]
        target_path.parent.mkdir(parents=True, exist_ok=True)

        with open(target_path, "w", encoding="utf-8") as f:
            f.write(comp["content"])

        console.print(f"  [bold green]✓[/bold green] Created [cyan]{comp['file']}[/cyan]")
        console.print(f"[bold green]✨ Component '{comp_key}' added successfully![/bold green]\n")

    except Exception as err:
        handle_error(err)
