// scenes.js — the three original scenes and their differences.
// One clear job: each scene draws its picture and lists its 8 differences.
// draw(ctx, changed) paints the scene; `changed` is a Set of difference ids
// that are altered in the right-hand panel. Hit circles are in scene pixels.

import { circle, ellipse, rr, poly, star, line, fish, flower, glow, pine } from './draw.js';
import { PANEL_W, PANEL_H } from './config.js';

// ---------------------------------------------------------------- reef ----
// "Coral Reef Dive" — a bright underwater reef: diver, corals, fish, chest.
function drawReef(ctx, changed) {
  // water
  const g = ctx.createLinearGradient(0, 0, 0, PANEL_H);
  g.addColorStop(0, '#2aa5b8');
  g.addColorStop(1, '#0d4a63');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, PANEL_W, PANEL_H);
  // light rays
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = '#ffffff';
  poly(ctx, [[80, 0], [150, 0], [60, 330], [10, 330]], '#ffffff');
  poly(ctx, [[300, 0], [340, 0], [300, 330], [250, 330]], '#ffffff');
  ctx.globalAlpha = 1;
  // sand
  ctx.fillStyle = '#e8d39a';
  ctx.fillRect(0, 330, PANEL_W, 70);
  ctx.fillStyle = '#d9c184';
  ellipse(ctx, 120, 345, 90, 10, '#d9c184');
  ellipse(ctx, 480, 352, 110, 12, '#d9c184');

  // bubbles (fixed clusters)
  const bubbles = (x, y, n) => {
    for (let i = 0; i < n; i++) {
      circle(ctx, x + i * 9 - n * 4, y - i * 12, 5 + (i % 2) * 2, 'rgba(255,255,255,0.55)');
    }
  };
  bubbles(90, 130, 3);
  bubbles(300, 90, 4);
  bubbles(520, 160, 3);
  // difference 2: an extra bubble cluster appears beside the diver
  if (changed.has(2)) bubbles(335, 150, 4);

  // seaweed (three clusters; difference 5 removes one blade from the middle)
  const weed = (x, blades, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    for (let i = 0; i < blades; i++) {
      const bx = x + i * 12 - blades * 6;
      ctx.beginPath();
      ctx.moveTo(bx, 330);
      ctx.quadraticCurveTo(bx + 8, 300, bx - 4, 272 - (i % 2) * 10);
      ctx.stroke();
    }
  };
  weed(40, 3, '#2e8b57');
  weed(180, changed.has(5) ? 2 : 3, '#3aa76d');
  weed(600, 3, '#2e8b57');

  // corals (difference 3 recolors the pink branch purple)
  const coral = (x, y, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x - 14, y - 22, x - 26, y - 34);
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + 4, y - 26, x - 2, y - 44);
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + 16, y - 18, x + 28, y - 30);
    ctx.stroke();
  };
  coral(140, 330, changed.has(3) ? '#9b59d0' : '#ff7f9e');
  coral(420, 330, '#ff9f43');
  coral(560, 330, '#b983ff');

  // anemone
  ctx.strokeStyle = '#ff8fb3';
  ctx.lineWidth = 4;
  for (let i = 0; i < 6; i++) {
    const ax = 200 + i * 7 - 18;
    ctx.beginPath();
    ctx.moveTo(ax, 330);
    ctx.quadraticCurveTo(ax + 5, 312, ax - 2, 300);
    ctx.stroke();
  }

  // fish (difference 0 recolors the big yellow fish orange)
  fish(ctx, 480, 110, 26, changed.has(0) ? '#ff8c42' : '#ffd23f', '#f4a300');
  fish(ctx, 220, 180, 22, '#4fc3f7', '#0288d1');
  fish(ctx, 350, 240, 20, '#ff8a65', '#e64a19');
  fish(ctx, 120, 250, 14, '#ce93d8', '#8e24aa');
  fish(ctx, 560, 200, 18, '#aed581', '#689f38');

  // manta ray gliding at the top
  ctx.fillStyle = '#37474f';
  poly(ctx, [[400, 60], [440, 48], [470, 62], [440, 72]], '#37474f');
  ellipse(ctx, 440, 62, 26, 8, '#455a64');

  // diver (difference 6 removes the yellow stripe from the tank)
  ctx.save();
  ctx.translate(300, 180);
  // fins
  poly(ctx, [[-28, 14], [-48, 26], [-44, 8]], '#ff7043');
  poly(ctx, [[-28, 20], [-48, 32], [-42, 14]], '#ff7043');
  // body
  rr(ctx, -30, -8, 56, 22, 10, '#1565c0');
  // tank
  rr(ctx, -34, -20, 14, 26, 6, '#eceff1');
  if (!changed.has(6)) rr(ctx, -34, -12, 14, 6, 2, '#ffd23f');
  // head + mask
  circle(ctx, 32, -2, 11, '#ffcc9e');
  rr(ctx, 30, -8, 14, 8, 3, '#263238');
  ctx.restore();

  // octopus in the corner
  ctx.fillStyle = '#ab47bc';
  ellipse(ctx, 60, 190, 22, 18, '#ab47bc');
  ctx.strokeStyle = '#ab47bc';
  ctx.lineWidth = 5;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(44 + i * 11, 204);
    ctx.quadraticCurveTo(40 + i * 12, 222, 48 + i * 10, 228);
    ctx.stroke();
  }
  circle(ctx, 54, 186, 3, '#fff');
  circle(ctx, 68, 186, 3, '#fff');

  // treasure chest (difference 4 closes the lid)
  ctx.fillStyle = '#8d6e63';
  rr(ctx, 448, 318, 46, 24, 4, '#8d6e63');
  ctx.fillStyle = '#ffd54f';
  rr(ctx, 448, 318, 46, 6, 3, '#ffd54f');
  if (changed.has(4)) {
    rr(ctx, 448, 300, 46, 18, 6, '#6d4c41');
  } else {
    poly(ctx, [[448, 312], [448, 292], [494, 292], [494, 312]], '#a1887f');
    circle(ctx, 460, 306, 4, '#ffd54f');
    circle(ctx, 474, 300, 4, '#ffca28');
  }

  // starfish (difference 1 removes it)
  if (!changed.has(1)) star(ctx, 250, 362, 14, '#ff7043');
  // shells (difference 7 removes the small one)
  ellipse(ctx, 90, 372, 14, 9, '#fff3e0');
  if (!changed.has(7)) ellipse(ctx, 580, 368, 10, 7, '#fff3e0');
}

// ------------------------------------------------------------- cabin ----
// "Snowy Cabin Night" — a quiet winter night: cabin, snowman, reindeer.
function drawCabin(ctx, changed) {
  const g = ctx.createLinearGradient(0, 0, 0, PANEL_H);
  g.addColorStop(0, '#0b1e3a');
  g.addColorStop(1, '#274b6d');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, PANEL_W, PANEL_H);
  // stars
  const stars = [[30, 40], [90, 90], [150, 30], [210, 70], [270, 35], [330, 80], [390, 40], [450, 90], [500, 30], [610, 120], [80, 160], [600, 200], [350, 130], [180, 130]];
  for (const [x, y] of stars) star(ctx, x, y, 3, '#ffffff');
  // moon (difference 0 adds a third crater)
  glow(ctx, 540, 70, 60, '#fff9c4', 0.2);
  circle(ctx, 540, 70, 30, '#fff9c4');
  circle(ctx, 530, 62, 5, '#e6d98c');
  circle(ctx, 550, 78, 4, '#e6d98c');
  if (changed.has(0)) circle(ctx, 546, 58, 4, '#e6d98c');

  // snow ground
  ctx.fillStyle = '#eef4fb';
  ctx.fillRect(0, 330, PANEL_W, 70);
  ellipse(ctx, 140, 340, 120, 12, '#ffffff');
  ellipse(ctx, 480, 344, 140, 12, '#ffffff');

  // pines
  pine(ctx, 60, 330, 110, '#1b5e20', '#ffffff');
  pine(ctx, 150, 330, 88, '#2e7d32', '#ffffff');
  pine(ctx, 520, 330, 120, '#1b5e20', '#ffffff');
  pine(ctx, 600, 330, 80, '#2e7d32', '#ffffff');

  // owl on a branch (difference 7 removes it)
  line(ctx, 20, 168, 130, 150, '#4e342e', 6);
  if (!changed.has(7)) {
    ellipse(ctx, 90, 146, 16, 20, '#6d4c41');
    circle(ctx, 84, 140, 4, '#fff');
    circle(ctx, 96, 140, 4, '#fff');
    poly(ctx, [[90, 162], [82, 176], [98, 176]], '#8d6e63');
  }

  // cabin
  ctx.fillStyle = '#7a5230';
  ctx.fillRect(250, 210, 140, 120);
  poly(ctx, [[240, 212], [320, 160], [400, 212]], '#5d4037');
  ctx.fillStyle = '#ffffff';
  poly(ctx, [[240, 212], [320, 160], [400, 212]], '#ffffff');
  ctx.fillStyle = '#7a5230';
  poly(ctx, [[252, 210], [320, 172], [388, 210]], '#7a5230');
  // chimney + smoke
  ctx.fillStyle = '#8d6e63';
  ctx.fillRect(360, 168, 18, 34);
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  circle(ctx, 372, 150, 7, 'rgba(255,255,255,0.75)');
  circle(ctx, 380, 134, 9, 'rgba(255,255,255,0.6)');
  circle(ctx, 390, 116, 11, 'rgba(255,255,255,0.45)');
  // door + wreath (difference 5 removes the wreath)
  ctx.fillStyle = '#4e342e';
  ctx.fillRect(306, 268, 28, 62);
  circle(ctx, 328, 300, 3, '#ffd54f');
  if (!changed.has(5)) {
    circle(ctx, 320, 282, 11, '#2e7d32');
    circle(ctx, 320, 282, 5, '#7a5230');
    circle(ctx, 320, 272, 2, '#d32f2f');
  }
  // windows (difference 1 darkens the left one)
  ctx.fillStyle = changed.has(1) ? '#263238' : '#ffd54f';
  ctx.fillRect(264, 240, 24, 24);
  ctx.fillStyle = '#ffd54f';
  ctx.fillRect(352, 240, 24, 24);
  ctx.strokeStyle = '#4e342e';
  ctx.lineWidth = 2;
  ctx.strokeRect(264, 240, 24, 24);
  ctx.strokeRect(352, 240, 24, 24);
  line(ctx, 276, 240, 276, 264, '#4e342e', 2);
  line(ctx, 364, 240, 364, 264, '#4e342e', 2);

  // lantern post (difference 4 turns the lantern off)
  line(ctx, 120, 330, 120, 268, '#37474f', 5);
  if (changed.has(4)) {
    rr(ctx, 110, 250, 20, 22, 4, '#78909c');
  } else {
    glow(ctx, 120, 261, 34, '#ffd54f', 0.3);
    rr(ctx, 110, 250, 20, 22, 4, '#ffd54f');
    rr(ctx, 114, 254, 12, 14, 2, '#fff59d');
  }

  // snowman (difference 2 recolors the scarf green)
  circle(ctx, 450, 316, 22, '#ffffff');
  circle(ctx, 450, 282, 16, '#ffffff');
  circle(ctx, 450, 256, 12, '#ffffff');
  poly(ctx, [[462, 254], [478, 258], [462, 262]], '#ff7043');
  circle(ctx, 446, 252, 2, '#263238');
  circle(ctx, 454, 252, 2, '#263238');
  ctx.fillStyle = changed.has(2) ? '#43a047' : '#d32f2f';
  ctx.fillRect(438, 266, 24, 7);
  poly(ctx, [[458, 266], [466, 290], [458, 290]], changed.has(2) ? '#43a047' : '#d32f2f');
  circle(ctx, 450, 282, 2, '#263238');
  circle(ctx, 450, 296, 2, '#263238');
  line(ctx, 434, 282, 414, 268, '#6d4c41', 4);
  line(ctx, 466, 282, 486, 268, '#6d4c41', 4);

  // reindeer (difference 3 removes one antler)
  ctx.fillStyle = '#8d6e63';
  ellipse(ctx, 560, 318, 26, 16, '#8d6e63');
  circle(ctx, 584, 300, 11, '#8d6e63');
  line(ctx, 580, 290, 572, 274, '#6d4c41', 3);
  line(ctx, 580, 290, 588, 274, '#6d4c41', 3);
  if (!changed.has(3)) {
    line(ctx, 572, 274, 564, 266, '#6d4c41', 3);
    line(ctx, 588, 274, 596, 266, '#6d4c41', 3);
  }
  circle(ctx, 592, 298, 3, '#d32f2f');
  line(ctx, 548, 330, 548, 344, '#6d4c41', 3);
  line(ctx, 572, 330, 572, 344, '#6d4c41', 3);

  // sled with gifts (difference 6 leaves two gifts instead of three)
  ctx.fillStyle = '#b71c1c';
  poly(ctx, [[180, 352], [230, 352], [224, 364], [186, 364]], '#b71c1c');
  line(ctx, 180, 352, 230, 352, '#4e342e', 3);
  rr(ctx, 188, 332, 16, 18, 2, '#1565c0');
  rr(ctx, 206, 330, 16, 20, 2, '#2e7d32');
  if (!changed.has(6)) rr(ctx, 224, 334, 14, 16, 2, '#f9a825');

  // footprints from the door
  ctx.fillStyle = 'rgba(120,144,156,0.6)';
  for (let i = 0; i < 5; i++) ellipse(ctx, 320 + i * 14, 344 + (i % 2) * 6, 5, 3, 'rgba(120,144,156,0.6)');
}

// -------------------------------------------------------------- farm ----
// "Sunflower Farm" — a warm noon on the farm: barn, windmill, sunflowers.
function drawFarm(ctx, changed) {
  const g = ctx.createLinearGradient(0, 0, 0, PANEL_H);
  g.addColorStop(0, '#7ec8f7');
  g.addColorStop(1, '#dff3ff');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, PANEL_W, PANEL_H);
  // sun + rays
  glow(ctx, 560, 60, 70, '#ffeb3b', 0.25);
  circle(ctx, 560, 60, 28, '#ffeb3b');
  ctx.strokeStyle = '#ffeb3b';
  ctx.lineWidth = 3;
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    line(ctx, 560 + Math.cos(a) * 34, 60 + Math.sin(a) * 34, 560 + Math.cos(a) * 44, 60 + Math.sin(a) * 44, '#ffeb3b', 3);
  }
  // clouds
  const cloud = (x, y) => {
    ctx.fillStyle = '#ffffff';
    ellipse(ctx, x, y, 34, 16, '#ffffff');
    ellipse(ctx, x - 22, y + 4, 22, 12, '#ffffff');
    ellipse(ctx, x + 24, y + 4, 22, 12, '#ffffff');
  };
  cloud(120, 70);
  cloud(300, 48);
  cloud(450, 92);
  // field + path
  ctx.fillStyle = '#7bc043';
  ctx.fillRect(0, 260, PANEL_W, 140);
  ctx.fillStyle = '#c8a165';
  poly(ctx, [[280, 400], [360, 400], [330, 260], [310, 260]], '#c8a165');

  // barn
  ctx.fillStyle = '#c62828';
  ctx.fillRect(80, 180, 140, 120);
  poly(ctx, [[70, 182], [150, 130], [230, 182]], '#8e0000');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(80, 180, 140, 8);
  // hayloft window
  ctx.fillStyle = '#fff8e1';
  rr(ctx, 138, 150, 24, 20, 3, '#fff8e1');
  // door (difference 1 closes it)
  if (changed.has(1)) {
    ctx.fillStyle = '#8e0000';
    ctx.fillRect(130, 240, 40, 60);
    line(ctx, 150, 240, 150, 300, '#ffffff', 2);
  } else {
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(130, 240, 40, 60);
  }
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(96, 220, 20, 20);
  ctx.fillRect(184, 220, 20, 20);

  // windmill (difference 2 leaves three blades)
  ctx.fillStyle = '#eceff1';
  poly(ctx, [[470, 280], [490, 280], [486, 170], [474, 170]], '#eceff1');
  circle(ctx, 480, 160, 8, '#37474f');
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 6;
  const blade = (a) => {
    line(ctx, 480, 160, 480 + Math.cos(a) * 34, 160 + Math.sin(a) * 34, '#ffffff', 6);
  };
  blade(-Math.PI / 2);
  blade(0);
  blade(Math.PI / 2);
  if (!changed.has(2)) blade(Math.PI);

  // sunflowers (difference 0 beheads one)
  const sunflower = (x, y, withHead) => {
    line(ctx, x, y + 40, x, y, '#2e7d32', 3);
    ellipse(ctx, x - 9, y + 24, 10, 5, '#388e3c');
    if (withHead) flower(ctx, x, y, 16, '#ffca28', '#6d4c41');
  };
  sunflower(260, 300, true);
  sunflower(320, 312, true);
  sunflower(380, 300, true);
  sunflower(420, 306, !changed.has(0));
  sunflower(500, 312, true);
  sunflower(560, 300, true);

  // cow (difference 3 leaves two spots)
  ctx.fillStyle = '#ffffff';
  ellipse(ctx, 330, 336, 30, 18, '#ffffff');
  circle(ctx, 358, 322, 12, '#ffffff');
  circle(ctx, 322, 336, 5, '#263238');
  circle(ctx, 338, 330, 4, '#263238');
  if (!changed.has(3)) circle(ctx, 330, 344, 4, '#263238');
  circle(ctx, 362, 318, 3, '#ffcdd2');
  line(ctx, 302, 348, 302, 362, '#263238', 3);
  line(ctx, 344, 348, 344, 362, '#263238', 3);
  line(ctx, 306, 330, 292, 344, '#263238', 3);

  // tractor
  ctx.fillStyle = '#d32f2f';
  rr(ctx, 150, 330, 52, 22, 6, '#d32f2f');
  rr(ctx, 176, 306, 26, 26, 4, '#d32f2f');
  ctx.fillStyle = '#bbdefb';
  rr(ctx, 182, 312, 16, 14, 2, '#bbdefb');
  circle(ctx, 162, 356, 12, '#263238');
  circle(ctx, 162, 356, 5, '#90a4ae');
  circle(ctx, 196, 356, 8, '#263238');
  line(ctx, 200, 306, 200, 292, '#37474f', 3);

  // scarecrow (difference 4 removes the hat)
  line(ctx, 430, 340, 430, 280, '#6d4c41', 4);
  line(ctx, 408, 300, 452, 300, '#6d4c41', 4);
  ctx.fillStyle = '#1565c0';
  rr(ctx, 412, 296, 36, 26, 4, '#1565c0');
  circle(ctx, 430, 282, 10, '#ffcc9e');
  if (!changed.has(4)) {
    poly(ctx, [[416, 278], [444, 278], [430, 262]], '#ffd54f');
    rr(ctx, 414, 274, 32, 5, 2, '#ffd54f');
  }

  // bees (difference 5 leaves two)
  const bee = (x, y) => {
    ellipse(ctx, x, y, 7, 5, '#ffd54f');
    line(ctx, x - 2, y - 5, x - 2, y + 5, '#263238', 2);
    line(ctx, x + 2, y - 5, x + 2, y + 5, '#263238', 2);
    circle(ctx, x + 6, y - 1, 1.5, '#263238');
  };
  bee(370, 210);
  bee(400, 228);
  if (!changed.has(5)) bee(430, 206);
  // butterfly
  ctx.fillStyle = '#ff8a65';
  ellipse(ctx, 350, 176, 7, 5, '#ff8a65');
  ellipse(ctx, 350, 186, 7, 5, '#ffb74d');

  // pond + duck (difference 6 removes the duck)
  ellipse(ctx, 540, 366, 56, 16, '#4fc3f7');
  if (!changed.has(6)) {
    ellipse(ctx, 540, 362, 12, 8, '#ffffff');
    circle(ctx, 550, 354, 6, '#ffffff');
    poly(ctx, [[556, 354], [562, 356], [556, 358]], '#ff9800');
    circle(ctx, 552, 352, 1.5, '#263238');
  }

  // hay bales (difference 7 adds a second bale)
  circle(ctx, 60, 372, 18, '#ffd54f');
  circle(ctx, 60, 372, 11, '#ffca28');
  if (changed.has(7)) {
    circle(ctx, 96, 374, 14, '#ffd54f');
    circle(ctx, 96, 374, 8, '#ffca28');
  }
}

export const SCENES = [
  {
    id: 'reef',
    name: 'Coral Reef Dive',
    tag: 'Under the waves',
    draw: drawReef,
    diffs: [
      { x: 480, y: 110, r: 30, label: 'the yellow fish' },
      { x: 250, y: 362, r: 24, label: 'the starfish' },
      { x: 335, y: 150, r: 24, label: 'the extra bubbles' },
      { x: 140, y: 300, r: 30, label: 'the pink coral' },
      { x: 470, y: 318, r: 28, label: 'the treasure chest' },
      { x: 180, y: 300, r: 26, label: 'the seaweed' },
      { x: 300, y: 180, r: 26, label: "the diver's tank" },
      { x: 580, y: 368, r: 20, label: 'the little shell' },
    ],
  },
  {
    id: 'cabin',
    name: 'Snowy Cabin Night',
    tag: 'A quiet winter night',
    draw: drawCabin,
    diffs: [
      { x: 540, y: 70, r: 28, label: 'the moon' },
      { x: 276, y: 252, r: 22, label: 'the cabin window' },
      { x: 450, y: 282, r: 24, label: "the snowman's scarf" },
      { x: 560, y: 290, r: 26, label: "the reindeer's antler" },
      { x: 120, y: 261, r: 24, label: 'the lantern' },
      { x: 320, y: 282, r: 22, label: 'the wreath' },
      { x: 206, y: 340, r: 26, label: 'the sled gifts' },
      { x: 90, y: 146, r: 24, label: 'the owl' },
    ],
  },
  {
    id: 'farm',
    name: 'Sunflower Farm',
    tag: 'High noon on the farm',
    draw: drawFarm,
    diffs: [
      { x: 420, y: 300, r: 26, label: 'the sunflower' },
      { x: 150, y: 270, r: 26, label: 'the barn door' },
      { x: 480, y: 160, r: 30, label: 'the windmill blade' },
      { x: 330, y: 336, r: 28, label: 'the cow' },
      { x: 430, y: 272, r: 24, label: "the scarecrow's hat" },
      { x: 400, y: 220, r: 24, label: 'the bees' },
      { x: 540, y: 360, r: 22, label: 'the duck' },
      { x: 96, y: 374, r: 24, label: 'the hay bales' },
    ],
  },
];
