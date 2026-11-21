// draw.js — small canvas helpers every scene shares.
// One clear job: primitive shapes so the scene files read like a picture list.

export function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
}

export function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
}

export function rr(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
}

export function poly(ctx, points, fill) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
}

export function star(ctx, x, y, r, fill, points = 5) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = (i * Math.PI) / points - Math.PI / 2;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
}

export function line(ctx, x1, y1, x2, y2, color, width = 2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

// A simple fish facing right (flip with scale(-1,1) for left). Body + tail + eye.
export function fish(ctx, x, y, size, body, tail) {
  ellipse(ctx, x, y, size, size * 0.55, body);
  poly(
    ctx,
    [
      [x - size * 0.85, y],
      [x - size * 1.5, y - size * 0.55],
      [x - size * 1.5, y + size * 0.55],
    ],
    tail || body,
  );
  circle(ctx, x + size * 0.45, y - size * 0.12, size * 0.12, '#12202e');
}

// A pine tree: trunk + three stacked triangles + snow caps.
export function pine(ctx, x, y, h, green, snow) {
  const w = h * 0.42;
  rr(ctx, x - 4, y - 6, 8, 14, 2, '#6b4a2f');
  poly(ctx, [[x, y - h], [x - w, y - h * 0.45], [x + w, y - h * 0.45]], green);
  poly(ctx, [[x, y - h * 0.78], [x - w * 0.82, y - h * 0.28], [x + w * 0.82, y - h * 0.28]], green);
  poly(ctx, [[x, y - h * 0.55], [x - w * 0.62, y - h * 0.08], [x + w * 0.62, y - h * 0.08]], green);
  if (snow) {
    poly(ctx, [[x, y - h], [x - w * 0.28, y - h * 0.82], [x + w * 0.28, y - h * 0.82]], snow);
    poly(ctx, [[x, y - h * 0.78], [x - w * 0.24, y - h * 0.62], [x + w * 0.24, y - h * 0.62]], snow);
  }
}

// A five-petal flower head on a stem.
export function flower(ctx, x, y, r, petal, center) {
  line(ctx, x, y, x, y + 34, '#2e7d32', 3);
  ellipse(ctx, x - 8, y + 22, 10, 5, '#388e3c');
  for (let i = 0; i < 5; i++) {
    const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
    circle(ctx, x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62, r * 0.55, petal);
  }
  circle(ctx, x, y, r * 0.5, center);
}

// A soft glowing dot (lantern light, moon glow): layered translucent circles.
export function glow(ctx, x, y, r, color, alpha = 0.25) {
  for (let i = 3; i >= 1; i--) {
    ctx.globalAlpha = alpha / i;
    circle(ctx, x, y, (r * i) / 2, color);
  }
  ctx.globalAlpha = 1;
}
