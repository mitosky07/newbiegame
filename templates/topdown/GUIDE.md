# Beginner Guide: {{ project_name }}

Welcome to your first web game project. This guide shows you how to make your first code changes step-by-step.

---

## Step 1: Change Player Movement Speed

Open file:
`src/entities/Player.js`

Find line 8:
```javascript
this.speed = 220;
```

Change it to:
```javascript
this.speed = 400; // Double speed
```

Save the file and refresh your browser.

---

## Step 2: Change Player Color

Open file:
`src/entities/Player.js`

Find line 9:
```javascript
this.color = "#38bdf8";
```

Change it to your favorite hex color, such as:
```javascript
this.color = "#ec4899";
```

---

## Step 3: Toggle Live Dev Inspector in Game

While playing in your browser, press the `Tab` key to toggle the Live Developer Inspector overlay. It shows your exact player coordinates, movement speed, and active particle count in real-time.

---

## Step 4: Increase Number of Coins to Collect

Open file:
`src/scenes/MainScene.js`

Find line 12:
```javascript
this.score = new Score(5);
```

Change `5` to `10` coins.
