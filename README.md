# Hidden Worlds — Spot the Difference

[![best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/giber76/spot-the-difference-entry/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/giber76/spot-the-difference-entry/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

A complete, original spot the difference game that runs in a desktop browser
from static files, no network. Three hand-drawn worlds — Coral Reef Dive,
Snowy Cabin Night, Sunflower Farm — each hiding 8 differences between two
near-identical pictures. Click a difference on either panel to mark it;
wrong clicks cost 3 seconds and 25 points. Hints, combo scoring, par times
and star ratings keep the hunt fun after ten finds.

## Play

```sh
node serve.ts   # then open http://localhost:8080
```

Keys: **H** hint · **P** pause · **R** restart scene · **M** mute · **Enter** start.

## Layout

- `game/index.html` — page shell: HUD, two picture panels, overlays
- `game/css/style.css` — the look: dark frame, bright pictures
- `game/src/main.js` — boot, state machine, loop, scoring
- `game/src/scenes.js` — the three scenes and their 8 differences each
- `game/src/draw.js` — shared canvas shapes (fish, pines, flowers, glow)
- `game/src/differences.js` — hit-testing and found/unfound state
- `game/src/hud.js` — counter, timer, score, dots, messages
- `game/src/input.js` — mouse clicks and keyboard shortcuts
- `game/src/audio.js` — synthesized WebAudio sounds, no files
- `game/src/shots.js` — deterministic `?shot=` states for screenshots
- `main.ts` — hands the game in: copies game/ + screenshots/ to /output
  and writes dossier.json with the vendored make.fun library
- `vendor/makefun-game.ts` — the kit's copy, unchanged
