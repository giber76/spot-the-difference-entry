// main.js — the game itself: boot, state machine, loop, rendering, scoring.
// One clear job: wire the scenes, differences, HUD, input and sound together.

import { SCENES } from './scenes.js';
import { DifferenceSet } from './differences.js';
import { SoundBank } from './audio.js';
import { Hud } from './hud.js';
import { Input } from './input.js';
import { readShot } from './shots.js';
import {
  PANEL_W,
  PANEL_H,
  POINTS_PER_FIND,
  COMBO_STEP,
  COMBO_CAP,
  WRONG_CLICK_POINTS,
  WRONG_CLICK_SECONDS,
  HINT_POINTS,
  HINTS_PER_SCENE,
  HINT_PULSE_MS,
  PAR_SECONDS,
  STAR_TWO_MULT,
  TIMER_TICK_MS,
} from './config.js';

const $ = (id) => document.getElementById(id);

class Game {
  constructor() {
    this.left = $('panel-left');
    this.right = $('panel-right');
    this.lctx = this.left.getContext('2d');
    this.rctx = this.right.getContext('2d');
    this.hud = new Hud(document);
    this.sounds = new SoundBank();
    this.state = 'title'; // title | playing | paused | sceneDone | gameDone
    this.sceneIndex = 0;
    this.diffs = null;
    this.timer = 0;
    this.score = 0;
    this.combo = 0;
    this.wrongs = 0;
    this.hintsLeft = HINTS_PER_SCENE;
    this.hintPulse = null; // { id, until }
    this.flashUntil = 0;
    this.lastTick = 0;
    this.shot = readShot();
    this.overlay = {
      title: $('overlay-title'),
      scene: $('overlay-scene'),
      game: $('overlay-game'),
      pause: $('overlay-pause'),
    };
    this.bindButtons();
    new Input(this.left, this.right, {
      click: (x, y) => this.onClick(x, y),
      hint: () => this.onHint(),
      pause: () => this.onPauseToggle(),
      restart: () => this.onRestart(),
      mute: () => this.onMute(),
      confirm: () => this.onConfirm(),
    });
    this.loadScene(0);
    if (this.shot) this.applyShot();
    else this.showOverlay('title');
    requestAnimationFrame((t) => this.loop(t));
  }

  // ------------------------------------------------------------ setup ----
  loadScene(index) {
    this.sceneIndex = index;
    this.scene = SCENES[index];
    this.diffs = new DifferenceSet(this.scene);
    this.timer = 0;
    this.combo = 0;
    this.wrongs = 0;
    this.hintsLeft = HINTS_PER_SCENE;
    this.hintPulse = null;
    this.hud.scene(this.scene, index, SCENES.length);
    this.hud.counts(this.diffs.remaining, this.diffs.total, 0);
    this.hud.clock(0, index);
    this.hud.points(this.score, this.combo);
    this.hud.hintsLeft(this.hintsLeft);
    this.hud.wrongs(0);
    this.hud.pauseLabel(false);
  }

  applyShot() {
    const s = this.shot;
    this.loadScene(Math.min(s.scene, SCENES.length - 1));
    this.timer = s.timer;
    for (let i = 0; i < s.found && i < this.diffs.total; i++) this.diffs.markFound(i);
    // Score consistent with the finds shown (100 + combo step per find).
    this.score = 0;
    this.combo = 0;
    for (let i = 0; i < this.diffs.found.size; i++) {
      this.combo = i + 1;
      this.score += POINTS_PER_FIND + Math.min(i * COMBO_STEP, COMBO_CAP);
    }
    this.hud.points(this.score, this.combo);
    this.hud.counts(this.diffs.remaining, this.diffs.total, this.diffs.found.size);
    this.hud.clock(this.timer, this.sceneIndex);
    if (s.shot === 'start') {
      this.state = 'title';
      this.showOverlay('title');
    } else if (s.shot === 'end') {
      this.state = 'sceneDone';
      this.showSceneDone();
    } else {
      this.state = 'playing';
      this.hideOverlays();
    }
  }

  // ---------------------------------------------------------- buttons ----
  bindButtons() {
    $('btn-start').addEventListener('click', () => this.startGame());
    $('btn-hint').addEventListener('click', () => this.onHint());
    $('btn-pause').addEventListener('click', () => this.onPauseToggle());
    $('btn-restart').addEventListener('click', () => this.onRestart());
    $('btn-mute').addEventListener('click', () => this.onMute());
    $('btn-next').addEventListener('click', () => this.nextScene());
    $('btn-again').addEventListener('click', () => this.startGame());
    $('btn-resume').addEventListener('click', () => this.onPauseToggle());
    $('btn-quit').addEventListener('click', () => this.toTitle());
    document.querySelectorAll('[data-scene]').forEach((b) => {
      b.addEventListener('click', () => {
        this.loadScene(parseInt(b.dataset.scene, 10));
        this.state = 'playing';
        this.hideOverlays();
      });
    });
  }

  // ------------------------------------------------------------ flow -----
  startGame() {
    this.sounds.unlock();
    this.score = 0;
    this.loadScene(0);
    this.state = 'playing';
    this.hideOverlays();
    this.hud.say('Find every difference — click it on either picture.');
  }

  toTitle() {
    this.loadScene(0);
    this.state = 'title';
    this.showOverlay('title');
  }

  nextScene() {
    this.sounds.click();
    if (this.sceneIndex + 1 < SCENES.length) {
      this.loadScene(this.sceneIndex + 1);
      this.state = 'playing';
      this.hideOverlays();
      this.hud.say(`${this.scene.name} — ${this.diffs.total} differences to find.`);
    } else {
      this.state = 'gameDone';
      this.showGameDone();
    }
  }

  starsFor(seconds, index) {
    if (seconds <= PAR_SECONDS[index]) return 3;
    if (seconds <= PAR_SECONDS[index] * STAR_TWO_MULT) return 2;
    return 1;
  }

  showSceneDone() {
    const stars = this.starsFor(this.timer, this.sceneIndex);
    $('scene-stars').textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    $('scene-time').textContent = `Finished in ${this.fmt(this.timer)} · Par ${this.fmt(PAR_SECONDS[this.sceneIndex])}`;
    $('scene-score').textContent = `Score ${this.score}`;
    $('btn-next').textContent = this.sceneIndex + 1 < SCENES.length ? 'Next scene →' : 'See results →';
    this.showOverlay('scene');
  }

  showGameDone() {
    $('game-stars').textContent = '★★★';
    $('game-score').textContent = `Final score ${this.score}`;
    $('game-line').textContent = `You found all ${SCENES.length * 8} differences across ${SCENES.length} scenes.`;
    this.showOverlay('game');
  }

  showOverlay(name) {
    this.hideOverlays();
    if (name) this.overlay[name].classList.add('show');
  }

  hideOverlays() {
    for (const o of Object.values(this.overlay)) o.classList.remove('show');
  }

  fmt(s) {
    const m = Math.floor(s / 60);
    return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  }

  // ---------------------------------------------------------- actions ----
  onClick(x, y) {
    this.sounds.unlock();
    if (this.state !== 'playing') return;
    const id = this.diffs.hitAt(x, y);
    if (id >= 0) {
      this.diffs.markFound(id);
      this.combo += 1;
      const gain = POINTS_PER_FIND + Math.min((this.combo - 1) * COMBO_STEP, COMBO_CAP);
      this.score += gain;
      this.sounds.found();
      this.hud.counts(this.diffs.remaining, this.diffs.total, this.diffs.found.size);
      this.hud.points(this.score, this.combo);
      this.hud.say(`Found: ${this.scene.diffs[id].label}! +${gain}`);
      if (this.diffs.done) {
        this.state = 'sceneDone';
        this.sounds.win();
        this.showSceneDone();
      }
    } else {
      this.combo = 0;
      this.wrongs += 1;
      this.timer += WRONG_CLICK_SECONDS;
      this.score = Math.max(0, this.score + WRONG_CLICK_POINTS);
      this.flashUntil = performance.now() + 350;
      this.sounds.wrong();
      this.hud.points(this.score, this.combo);
      this.hud.wrongs(this.wrongs);
      this.hud.say(`Not a difference — +${WRONG_CLICK_SECONDS}s and ${-WRONG_CLICK_POINTS} points.`);
    }
  }

  onHint() {
    if (this.state !== 'playing') return;
    if (this.hintsLeft <= 0) {
      this.hud.say('No hints left in this scene.');
      return;
    }
    const id = this.diffs.firstUnfound();
    if (id < 0) return;
    this.hintsLeft -= 1;
    this.score = Math.max(0, this.score + HINT_POINTS);
    this.hintPulse = { id, until: performance.now() + HINT_PULSE_MS };
    this.sounds.hint();
    this.hud.hintsLeft(this.hintsLeft);
    this.hud.points(this.score, this.combo);
    this.hud.say('Hint: look inside the pulsing ring.');
  }

  onPauseToggle() {
    if (this.state === 'playing') {
      this.state = 'paused';
      this.hud.pauseLabel(true);
      this.showOverlay('pause');
    } else if (this.state === 'paused') {
      this.state = 'playing';
      this.hud.pauseLabel(false);
      this.hideOverlays();
    }
  }

  onRestart() {
    this.sounds.click();
    this.loadScene(this.sceneIndex);
    this.state = 'playing';
    this.hideOverlays();
    this.hud.say(`${this.scene.name} — fresh start, ${this.diffs.total} differences to find.`);
  }

  onMute() {
    const muted = this.sounds.toggleMute();
    this.hud.muteLabel(muted);
  }

  onConfirm() {
    if (this.state === 'title') this.startGame();
    else if (this.state === 'sceneDone') this.nextScene();
    else if (this.state === 'gameDone') this.startGame();
  }

  // ------------------------------------------------------------- loop ----
  loop(t) {
    if (this.state === 'playing' && !this.shot) {
      if (!this.lastTick) this.lastTick = t;
      if (t - this.lastTick >= TIMER_TICK_MS) {
        this.timer += (t - this.lastTick) / 1000;
        this.lastTick = t;
        this.hud.clock(this.timer, this.sceneIndex);
      }
    } else {
      this.lastTick = 0;
    }
    this.render(t);
    requestAnimationFrame((nt) => this.loop(nt));
  }

  // ----------------------------------------------------------- render ----
  render(t) {
    // left panel: the original; right panel: every difference applied
    const all = new Set(this.scene.diffs.map((_, i) => i));
    this.scene.draw(this.lctx, new Set());
    this.scene.draw(this.rctx, all);
    this.drawMarkers(this.lctx, t);
    this.drawMarkers(this.rctx, t);
    if (this.hintPulse && t < this.hintPulse.until) {
      const d = this.scene.diffs[this.hintPulse.id];
      const pulse = 1 + 0.12 * Math.sin(t / 120);
      for (const ctx of [this.lctx, this.rctx]) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * pulse + 6, 0, Math.PI * 2);
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 4;
        ctx.setLineDash([8, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
    if (t < this.flashUntil) {
      for (const ctx of [this.lctx, this.rctx]) {
        ctx.fillStyle = 'rgba(211,47,47,0.18)';
        ctx.fillRect(0, 0, PANEL_W, PANEL_H);
      }
    }
  }

  drawMarkers(ctx, t) {
    for (const m of this.diffs.markers()) {
      if (!m.found) continue;
      const pulse = m.latest && !this.shot ? 1 + 0.06 * Math.sin(t / 180) : 1;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r * pulse, 0, Math.PI * 2);
      ctx.strokeStyle = m.latest ? '#69f0ae' : '#ffd54f';
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r * pulse + 5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.65)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => new Game());
