// config.js — the game's fixed numbers: panel size, scoring, timers, hints.
// One clear job: every tunable number lives here, nowhere else.

export const PANEL_W = 640;
export const PANEL_H = 400;

export const SCENE_COUNT = 3;
export const DIFFS_PER_SCENE = 8;

export const POINTS_PER_FIND = 100;
export const COMBO_STEP = 25; // extra points per step of the streak, capped
export const COMBO_CAP = 100;
export const WRONG_CLICK_POINTS = -25;
export const WRONG_CLICK_SECONDS = 3;
export const HINT_POINTS = -50;
export const HINTS_PER_SCENE = 3;
export const HINT_PULSE_MS = 2000;

export const MARK_RADIUS = 26; // hit-test radius of a difference, scene pixels
export const RING_LINE = 5; // found-marker ring thickness, scene pixels

export const PAR_SECONDS = [90, 120, 120]; // par time per scene, seconds
export const STAR_TWO_MULT = 1.5; // 2 stars when finished within par * this

export const TIMER_TICK_MS = 250;

// Screenshot states the maker uses (?shot=...). The game reads these in shots.js.
export const SHOT_DEFAULTS = {
  start: { scene: 0 },
  play: { scene: 0, found: 3, timer: 47 },
  play2: { scene: 1, found: 2, timer: 83 },
  end: { scene: 2, found: 8, timer: 104 },
};
