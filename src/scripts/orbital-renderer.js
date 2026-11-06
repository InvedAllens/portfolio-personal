// A pinhole projection of a sphere, tilted rings and satellites onto a 2D canvas.
const TAU = 2 * Math.PI;
const CENTER_X = 310;
const CENTER_Y = 253;
const RADIUS = 119;
const STEPS = 84;
const unitCircle = Array.from({ length: STEPS + 1 }, (_, index) => {
  const angle = index / STEPS * TAU;
  return [Math.cos(angle), Math.sin(angle)];
});
const rings = [
  [149, .21], [159, .55], [164, .87], [172, .3], [183, .49],
  [199, .22], [211, .54], [217, .19], [249, .29], [272, .19],
];
const stars = Array.from({ length: 84 }, (_, index) => {
  const x = Math.sin((index + 1) * 127.1) * 43758.5453;
  const y = Math.sin((index + 1) * 311.7) * 15731.743;
  return [36 + (x - Math.floor(x)) * 548, 47 + (y - Math.floor(y)) * 409, index % 13 === 0 ? 1.35 : .63];
});

function projection(x, y, z) {
  const perspective = 900 / (900 - z);
  return [CENTER_X + x * perspective, CENTER_Y + y * perspective];
}

function rotation(xAngle, yAngle, zAngle) {
  const cx = Math.cos(xAngle), sx = Math.sin(xAngle);
  const cy = Math.cos(yAngle), sy = Math.sin(yAngle);
  const cz = Math.cos(zAngle), sz = Math.sin(zAngle);
  return ([x, y, z]) => {
    const y1 = y * cx - z * sx;
    const z1 = y * sx + z * cx;
    const x2 = x * cy + z1 * sy;
    return [x2 * cz - y1 * sz, x2 * sz + y1 * cz, -x * sy + z1 * cy];
  };
}

function strokeDepth(ctx, points, front) {
  ctx.beginPath();
  let drawing = false;
  for (const point of points) {
    if (front !== (point[2] >= 0)) {
      drawing = false;
      continue;
    }
    const [x, y] = projection(...point);
    if (drawing) ctx.lineTo(x, y);
    else ctx.moveTo(x, y);
    drawing = true;
  }
  ctx.stroke();
}

function circle(ctx, x, y, radius, style) {
  ctx.fillStyle = style;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, TAU);
  ctx.fill();
}

function paintSatellite(ctx, [x, y, depth], radius, warm) {
  const [px, py] = projection(x, y, depth);
  const glow = ctx.createRadialGradient(px, py, radius * .15, px, py, radius * 4);
  glow.addColorStop(0, warm ? '#ffab87a6' : '#b2a6ff92');
  glow.addColorStop(1, '#b2a6ff00');
  circle(ctx, px, py, radius * 4, glow);
  circle(ctx, px, py, radius, warm ? '#ffe3cd' : '#e5dfff');
}

function paintPlanet(ctx, angle, pitch, yaw) {
  const atmosphere = ctx.createRadialGradient(CENTER_X, CENTER_Y, 105, CENTER_X, CENTER_Y, 162);
  atmosphere.addColorStop(0, '#a484fd52');
  atmosphere.addColorStop(1, '#a484fd00');
  circle(ctx, CENTER_X, CENTER_Y, 162, atmosphere);

  const surface = ctx.createRadialGradient(263, 205, 6, 330, 271, 166);
  surface.addColorStop(0, '#665288');
  surface.addColorStop(.44, '#3b315e');
  surface.addColorStop(.81, '#1b1931');
  surface.addColorStop(1, '#101020');
  circle(ctx, CENTER_X, CENTER_Y, 120.1, surface);

  const rim = ctx.createLinearGradient(232, 155, 412, 360);
  rim.addColorStop(0, '#ffe0cb');
  rim.addColorStop(.36, '#ceadfb');
  rim.addColorStop(.65, '#75639d');
  rim.addColorStop(1, '#4d405d');
  ctx.strokeStyle = rim;
  ctx.lineWidth = 1.55;
  ctx.beginPath();
  ctx.arc(CENTER_X, CENTER_Y, 120.1, 0, TAU);
  ctx.stroke();

  const turn = rotation(-.18 + pitch * .6, angle + yaw * .8, -.27);
  const mesh = ctx.createLinearGradient(231, 158, 410, 362);
  mesh.addColorStop(0, '#e5c3f9a3');
  mesh.addColorStop(.46, '#bfa2f77a');
  mesh.addColorStop(1, '#8c80cc26');
  ctx.strokeStyle = mesh;
  ctx.lineWidth = .8;
  for (let index = -5; index <= 5; index++) {
    const latitude = index * Math.PI / 13;
    const r = Math.cos(latitude) * RADIUS;
    const y = Math.sin(latitude) * RADIUS;
    strokeDepth(ctx, unitCircle.map(([c, s]) => turn([r * c, y, r * s])), true);
  }
  for (let index = 0; index < 11; index++) {
    const longitude = index * Math.PI / 11;
    const x = Math.cos(longitude) * RADIUS;
    const z = Math.sin(longitude) * RADIUS;
    strokeDepth(ctx, unitCircle.map(([c, s]) => turn([x * c, RADIUS * s, z * c])), true);
  }
}

export function drawOrbital(ctx, angle = 0, pitch = 0, yaw = 0) {
  ctx.clearRect(0, 0, 620, 520);
  const halo = ctx.createRadialGradient(CENTER_X, CENTER_Y, 90, CENTER_X, CENTER_Y, 254);
  halo.addColorStop(0, '#8454b653');
  halo.addColorStop(.52, '#553b9242');
  halo.addColorStop(1, '#37255700');
  circle(ctx, CENTER_X, CENTER_Y, 254, halo);
  for (const [x, y, size] of stars) {
    circle(ctx, x, y, size, size > 1 ? '#f1cfff9c' : '#c7b6ea65');
  }

  const turn = rotation(1.14 + pitch, yaw, -.43 + Math.sin(angle * .55) * .07);
  const orbit = (radius, x, y) => turn([radius * x, radius * y, 0]);
  const ringPaths = rings.map(([radius, opacity]) => ({
    opacity,
    points: unitCircle.map(([x, y]) => orbit(radius, x, y)),
  }));
  const glow = ctx.createLinearGradient(62, 378, 532, 124);
  glow.addColorStop(0, '#ad80ff');
  glow.addColorStop(.44, '#ffb097');
  glow.addColorStop(.77, '#ffd0b4');
  glow.addColorStop(1, '#dfadf7');

  function paintRings(front) {
    ctx.strokeStyle = glow;
    for (const { points, opacity } of ringPaths) {
      ctx.globalAlpha = opacity * (front ? 1 : .72);
      ctx.lineWidth = opacity > .6 ? 1.65 : .95;
      strokeDepth(ctx, points, front);
    }
    ctx.globalAlpha = 1;
  }

  const satellites = [
    [239, -.35 + angle * 1.5, 5.7, true],
    [217, 2.75 + angle * 1.24, 3.3, false],
    [183, 1.43 + angle * 1.8, 2.8, true],
  ].map(([radius, phase, size, warm]) => ({
    position: orbit(radius, Math.cos(phase), Math.sin(phase)), size, warm,
  }));
  paintRings(false);
  for (const { position, size, warm } of satellites) {
    if (position[2] < 0) paintSatellite(ctx, position, size, warm);
  }
  paintPlanet(ctx, angle, pitch, yaw);
  paintRings(true);
  for (const { position, size, warm } of satellites) {
    if (position[2] >= 0) paintSatellite(ctx, position, size, warm);
  }
}

export function mountOrbital(view) {
  const canvas = view.querySelector('.orbital-canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  let animation = 0;
  let lastFrame = 0;
  let angle = 0;
  let yaw = 0;
  let pitch = 0;
  let targetYaw = 0;
  let targetPitch = 0;
  let drag = null;
  let interactive = false;
  let intro = false;

  function draw() {
    drawOrbital(ctx, angle, pitch, yaw);
  }
  function resize() {
    const width = Math.max(1, Math.round(view.clientWidth * Math.min(devicePixelRatio || 1, 1.6)));
    canvas.width = width;
    canvas.height = Math.round(width * 520 / 620);
    ctx.setTransform(canvas.width / 620, 0, 0, canvas.height / 520, 0, 0);
    draw();
  }
  function animate() {
    if (animation) return;
    lastFrame = performance.now();
    animation = requestAnimationFrame(frame);
  }

  function frame(now) {
    animation = requestAnimationFrame(frame);
    const elapsed = now - lastFrame;
    if (elapsed < 1000 / 30) return;
    lastFrame = now - elapsed % (1000 / 30);
    if (intro) angle += Math.min(elapsed, 50) * .00014;
    yaw += (targetYaw - yaw) * .24;
    pitch += (targetPitch - pitch) * .24;
    draw();
    if (!intro && Math.abs(targetYaw - yaw) < .002 && Math.abs(targetPitch - pitch) < .002) {
      cancelAnimationFrame(animation);
      animation = 0;
    }
  }

  view.tabIndex = -1;
  view.setAttribute('role', 'group');
  view.setAttribute('aria-label', 'Escena orbital interactiva');
  view.setAttribute('aria-describedby', 'orbital-help');
  view.addEventListener('keydown', (event) => {
    if (!interactive) return;
    const steps = { ArrowLeft: [-.15, 0], ArrowRight: [.15, 0], ArrowUp: [0, -.12], ArrowDown: [0, .12] };
    if (event.key === 'Home') {
      targetYaw = targetPitch = 0;
    } else if (steps[event.key]) {
      const [dx, dy] = steps[event.key];
      targetYaw += dx;
      targetPitch = Math.max(-.53, Math.min(.47, targetPitch + dy));
    } else {
      return;
    }
    event.preventDefault();
    animate();
  });
  view.addEventListener('pointerdown', (event) => {
    if (!interactive || !event.isPrimary || event.button !== 0) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, yaw: targetYaw, pitch: targetPitch };
    view.setPointerCapture(event.pointerId);
    view.classList.add('is-dragging');
  });
  view.addEventListener('pointermove', (event) => {
    if (!interactive || drag?.id !== event.pointerId) return;
    targetYaw = drag.yaw + (event.clientX - drag.x) * .009;
    targetPitch = Math.max(-.53, Math.min(.47, drag.pitch + (event.clientY - drag.y) * .006));
    animate();
  });
  function endDrag() {
    drag = null;
    view.classList.remove('is-dragging');
  }
  view.addEventListener('lostpointercapture', endDrag);
  new ResizeObserver(resize).observe(view);
  resize();
  view.classList.add('is-live');

  return (canRotate, showIntro) => {
    interactive = canRotate;
    intro = showIntro;
    view.classList.toggle('is-playing', interactive);
    view.tabIndex = interactive ? 0 : -1;
    if (intro) animate();
    if (!interactive) {
      cancelAnimationFrame(animation);
      animation = 0;
      endDrag();
    }
  };
}
