// input.js — mouse clicks on both panels and the keyboard shortcuts.
// One clear job: turn pointer and key events into game actions.

export class Input {
  constructor(leftCanvas, rightCanvas, actions) {
    this.actions = actions;
    const bind = (canvas, side) => {
      canvas.addEventListener('pointerdown', (ev) => {
        const rect = canvas.getBoundingClientRect();
        const x = ((ev.clientX - rect.left) / rect.width) * canvas.width;
        const y = ((ev.clientY - rect.top) / rect.height) * canvas.height;
        this.actions.click(x, y, side);
      });
    };
    bind(leftCanvas, 'left');
    bind(rightCanvas, 'right');
    document.addEventListener('keydown', (ev) => {
      if (ev.repeat) return;
      const k = ev.key.toLowerCase();
      if (k === 'h') this.actions.hint();
      else if (k === 'p') this.actions.pause();
      else if (k === 'r') this.actions.restart();
      else if (k === 'm') this.actions.mute();
      else if (k === 'enter' || k === ' ') this.actions.confirm();
    });
  }
}
