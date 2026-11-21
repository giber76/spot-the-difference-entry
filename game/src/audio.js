// audio.js — synthesized sounds, no audio files and no network.
// One clear job: every sound the game makes, built with WebAudio.

export class SoundBank {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  unlock() {
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        this.ctx = null;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  tone(freq, at, dur, type = 'sine', vol = 0.12) {
    if (!this.ctx || this.muted) return;
    const t0 = this.ctx.currentTime + at;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  found() {
    this.tone(660, 0, 0.12, 'sine', 0.14);
    this.tone(880, 0.09, 0.18, 'sine', 0.14);
  }

  wrong() {
    this.tone(160, 0, 0.18, 'sawtooth', 0.07);
  }

  hint() {
    this.tone(520, 0, 0.1, 'triangle', 0.1);
    this.tone(780, 0.08, 0.14, 'triangle', 0.1);
  }

  win() {
    [523, 659, 784, 1047].forEach((f, i) => this.tone(f, i * 0.11, 0.22, 'sine', 0.13));
  }

  click() {
    this.tone(440, 0, 0.05, 'triangle', 0.06);
  }
}
