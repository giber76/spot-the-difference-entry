// shots.js — deterministic states for the maker's screenshots.
// One clear job: read ?shot= from the URL and set the game up exactly so.
//   ?shot=start            title screen over scene 1
//   ?shot=play&found=3     scene 1 mid-hunt, 3 found, timer frozen at 0:47
//   ?shot=play2&found=2    scene 2 mid-hunt, 2 found, timer frozen at 1:23
//   ?shot=end              scene 3 finished, all 8 found, stars shown
// The timer never runs in shot mode, so every render is identical.

import { SHOT_DEFAULTS } from './config.js';

export function readShot() {
  const q = new URLSearchParams(window.location.search);
  const shot = q.get('shot');
  if (!shot) return null;
  const d = SHOT_DEFAULTS[shot];
  if (!d) return null;
  const found = Math.max(0, Math.min(8, parseInt(q.get('found') ?? String(d.found ?? 0), 10) || 0));
  const timer = parseInt(q.get('timer') ?? String(d.timer ?? 0), 10) || 0;
  const scene = parseInt(q.get('scene') ?? String(d.scene ?? 0), 10) || 0;
  return { shot, scene, found, timer };
}
