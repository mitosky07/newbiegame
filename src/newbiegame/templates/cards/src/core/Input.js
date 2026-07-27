export class Input {
  constructor(canvas) {
    this.mouse = { x: -1, y: -1, clicked: false };
    this.keys = {};
    this.justPressedKeys = {};

    if (canvas) {
      canvas.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
      });

      canvas.addEventListener("click", () => {
        this.mouse.clicked = true;
      });
    }

    window.addEventListener("keydown", (e) => {
      if (!this.keys[e.code]) {
        this.justPressedKeys[e.code] = true;
      }
      this.keys[e.code] = true;
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.code] = false;
      this.justPressedKeys[e.code] = false;
    });

    const resetInput = () => {
      this.keys = {};
      this.justPressedKeys = {};
    };

    window.addEventListener("blur", resetInput);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) resetInput();
    });
  }

  consumeClick() {
    if (this.mouse.clicked) {
      this.mouse.clicked = false;
      return true;
    }
    return false;
  }

  isDown(code) {
    return !!this.keys[code];
  }

  isJustPressed(code) {
    return !!this.justPressedKeys[code];
  }

  clearJustPressed() {
    this.justPressedKeys = {};
  }
}
