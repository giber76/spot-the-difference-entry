// hud.js — the numbers and words around the pictures.
// One clear job: write the counter, timer, score, dots and messages to the DOM.

import { PAR_SECONDS } from './config.js';

function fmt(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export class Hud {
  constructor(root) {
    this.el = {
      sceneName: root.querySelector('#scene-name'),
      sceneMeta: root.querySelector('#scene-meta'),
      remain: root.querySelector('#remain'),
      timer: root.querySelector('#timer'),
      timebar: root.querySelector('#timebar-fill'),
      score: root.querySelector('#score'),
      combo: root.querySelector('#combo'),
      hints: root.querySelector('#btn-hint'),
      strikes: root.querySelector('#strikes'),
      dots: root.querySelector('#found-dots'),
      toast: root.querySelector('#toast'),
      pauseBtn: root.querySelector('#btn-pause'),
      restartBtn: root.querySelector('#btn-restart'),
      muteBtn: root.querySelector('#btn-mute'),
    };
    this.toastTimer = 0;
  }

  scene(scene, index, total) {
    this.el.sceneName.textContent = scene.name;
    this.el.sceneMeta.textContent = `Scene ${index + 1} of ${total} · ${scene.tag} · Par ${fmt(PAR_SECONDS[index])}`;
  }

  counts(remaining, total, foundCount) {
    this.el.remain.textContent = `${remaining} to find`;
    this.el.dots.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('span');
      dot.className = 'dot' + (i < foundCount ? ' on' : '');
      dot.textContent = i < foundCount ? '✓' : '';
      this.el.dots.appendChild(dot);
    }
  }

  clock(seconds, sceneIndex) {
    this.el.timer.textContent = fmt(seconds);
    const par = PAR_SECONDS[sceneIndex];
    const pct = Math.min(100, (seconds / par) * 100);
    this.el.timebar.style.width = `${pct}%`;
    this.el.timebar.classList.toggle('over', seconds > par);
  }

  points(score, combo) {
    this.el.score.textContent = `Score ${score}`;
    this.el.combo.textContent = combo > 1 ? `Combo ×${combo}` : '';
  }

  hintsLeft(n) {
    this.el.hints.textContent = `Hint (${n})`;
    this.el.hints.disabled = n <= 0;
  }

  wrongs(n) {
    this.el.strikes.textContent = n > 0 ? `Strikes: ${'✕'.repeat(n)}` : 'Strikes: 0';
  }

  say(text, ms = 2200) {
    this.el.toast.textContent = text;
    this.el.toast.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.el.toast.classList.remove('show'), ms);
  }

  pauseLabel(paused) {
    this.el.pauseBtn.textContent = paused ? 'Resume' : 'Pause';
  }

  muteLabel(muted) {
    this.el.muteBtn.textContent = muted ? 'Unmute' : 'Mute';
  }
}
