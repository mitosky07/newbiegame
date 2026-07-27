# NewbieGame CLI

> **From an empty folder to a running web game in less than two minutes.**

[![npm Version](https://img.shields.io/npm/v/newbiegame.svg?color=cb3837)](https://www.npmjs.com/package/newbiegame)
[![PyPI Version](https://img.shields.io/pypi/v/newbiegame.svg?color=3775a9)](https://pypi.org/project/newbiegame/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Hack Club Anvil](https://img.shields.io/badge/Hack%20Club-Anvil%20YSWS-red)](https://anvil.hackclub.com)

**NewbieGame CLI** is a beginner-friendly developer tool designed for teen hackers and game jam participants. It scaffolds fully functional 2D web games (HTML5 Canvas + JavaScript) with zero build tools or complex setup required.

---

## Quick Start

### 1. Run via `npx` (npm)

```bash
npx newbiegame create
```

Or supply flags directly:

```bash
npx newbiegame create my-dino-game --template topdown
```

### 2. Run via Python (`pip` / `uv`)

```bash
pip install newbiegame
newbiegame create my-dino-game
```

### 3. Launch local dev server

```bash
cd my-dino-game
npx newbiegame serve
```

Your browser will automatically open `http://localhost:8000` with your game running live!

---

## Included Templates

| Template | Description | Features |
|---|---|---|
| **topdown** | 2D Top-down Adventure | Player movement (WASD/Arrows), particle physics, live developer inspector, audio effects. |
| **platformer** | 2D Platformer Game | Gravity physics, jump mechanics, platforms, collectibles. |
| **cards** | Card Battle Engine | Interactive card hand, 3D tilt effect, turn logic, score tracking. |
| **blank** | Minimal Canvas Starter | Game Loop, Input handler, Canvas renderer ready for custom code. |

---

## CLI Commands

- `newbiegame create [NAME]`: Create a new web game project.
- `newbiegame serve`: Start a local HTTP server and open the browser.
- `newbiegame add [COMPONENT]`: Inject reusable components (`score`, `keyboard`, `collision`, `audio`).
- `newbiegame doctor`: Check project structure and fix common errors.
- `newbiegame templates`: List all available game starters.

---

## Educational Philosophy

Every generated project includes:
- `GUIDE.md`: Step-by-step instructions on how to change colors, speed, sprites, and add mechanics.
- A built-in Live Developer Inspector panel inside games for testing variables in real time.
- Clean, explanatory comments in code written by developers for developers.

---

## Built for Hack Club Anvil

Created for the **Hack Club Anvil YSWS** ([https://anvil.hackclub.com](https://anvil.hackclub.com)).
