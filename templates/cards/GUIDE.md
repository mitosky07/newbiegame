# Card Battle Engine Guide

Welcome to your Card Battle Engine project.

---

## Step 1: Add New Cards to Deck

Open file:
`src/game.js`

Look at lines 19-23 inside `reset()`:
```javascript
this.cards = [
  { id: "strike", name: "Heavy Strike", type: "ATTACK", val: 25, x: 160, y: 240, w: 120, h: 160, color: "#334155", hoverY: 0 },
  { id: "shield", name: "Iron Shield", type: "DEFEND", val: 15, x: 340, y: 240, w: 120, h: 160, color: "#0284c7", hoverY: 0 },
  { id: "heal", name: "Quick Heal", type: "HEAL", val: 20, x: 520, y: 240, w: 120, h: 160, color: "#16a34a", hoverY: 0 }
];
```

Try modifying card damage values or adding new card mechanics.
