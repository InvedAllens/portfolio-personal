export function mountOrbital(view) {
  const canvas = view.querySelector('.orbital-canvas');
  let ctx;
  let drawOrbital;
  let loadingRenderer = false;
  let animation = 0;
  let lastFrame = 0;
  let yaw = 0;
  let pitch = 0;
  let targetYaw = 0;
  let targetPitch = 0;
  let drag = null;
  let interactive = false;

  function draw() {
    drawOrbital(ctx, 0, pitch, yaw);
  }
  function resize() {
    const width = Math.max(1, Math.round(view.clientWidth * Math.min(devicePixelRatio || 1, 1.6)));
    canvas.width = width;
    canvas.height = Math.round(width * 520 / 620);
    ctx.setTransform(canvas.width / 620, 0, 0, canvas.height / 520, 0, 0);
    draw();
  }
  async function animate() {
    if (animation || loadingRenderer) return;
    if (!drawOrbital) {
      loadingRenderer = true;
      try {
        ({ drawOrbital } = await import('./orbital-renderer.js'));
      } catch {
        return;
      } finally {
        loadingRenderer = false;
      }
      if (!interactive) return;
    }
    if (!ctx) {
      ctx = canvas.getContext('2d');
      if (!ctx) return;
      resize();
      new ResizeObserver(resize).observe(view);
      view.classList.add('is-live');
    }
    lastFrame = performance.now();
    animation = requestAnimationFrame(frame);
  }

  function frame(now) {
    animation = requestAnimationFrame(frame);
    const elapsed = now - lastFrame;
    if (elapsed < 1000 / 30) return;
    lastFrame = now - elapsed % (1000 / 30);
    yaw += (targetYaw - yaw) * .24;
    pitch += (targetPitch - pitch) * .24;
    draw();
    if (Math.abs(targetYaw - yaw) < .002 && Math.abs(targetPitch - pitch) < .002) {
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
  return (canRotate) => {
    interactive = canRotate;
    view.classList.toggle('is-playing', interactive);
    view.tabIndex = interactive ? 0 : -1;
    if (!interactive) {
      cancelAnimationFrame(animation);
      animation = 0;
      endDrag();
    }
  };
}
