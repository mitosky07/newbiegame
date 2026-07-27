# Platformer 2D Guide

Welcome to your 2D Platformer project.

---

## Step 1: Adjust Jump Height and Gravity

Open file:
`src/game.js`

Find lines 22-23:
```javascript
this.gravity = 950;
this.jumpForce = -440;
```

Try changing `this.jumpForce = -600;` for higher jumps.

---

## Step 2: Live Inspector

Press `Tab` while playing in your browser to toggle the Live Developer Inspector overlay and check player velocity and coyote time.
