// differences.js — the found / unfound state of one scene.
// One clear job: hit-testing clicks and tracking which differences are found.

export class DifferenceSet {
  constructor(scene) {
    this.scene = scene;
    this.found = new Set();
    this.latest = -1; // id of the most recent find, for the green pulse
  }

  get total() {
    return this.scene.diffs.length;
  }

  get remaining() {
    return this.total - this.found.size;
  }

  get done() {
    return this.remaining === 0;
  }

  // Click in scene coordinates; returns the difference id, or -1 for a miss.
  hitAt(x, y) {
    for (let i = 0; i < this.scene.diffs.length; i++) {
      if (this.found.has(i)) continue;
      const d = this.scene.diffs[i];
      const dx = x - d.x;
      const dy = y - d.y;
      if (dx * dx + dy * dy <= d.r * d.r) return i;
    }
    return -1;
  }

  markFound(id) {
    this.found.add(id);
    this.latest = id;
  }

  firstUnfound() {
    for (let i = 0; i < this.scene.diffs.length; i++) {
      if (!this.found.has(i)) return i;
    }
    return -1;
  }

  // Markers for the overlay: gold rings on every found difference.
  markers() {
    return this.scene.diffs.map((d, i) => ({
      x: d.x,
      y: d.y,
      r: d.r,
      found: this.found.has(i),
      latest: i === this.latest,
    }));
  }
}
