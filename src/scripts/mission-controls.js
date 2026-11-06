const keys = new Map([
  ['ArrowLeft', 'left'], ['a', 'left'], ['ArrowRight', 'right'], ['d', 'right'],
  ['ArrowUp', 'up'], ['w', 'up'], ['ArrowDown', 'down'], ['s', 'down'], [' ', 'fire'],
]);

export function connectMission(scene, onOpen, canPlay) {
  const mission = scene.querySelector('[data-mission]');
  const field = scene.querySelector('[data-mission-field]');
  const controls = scene.querySelector('[data-orbital-controls]');
  const start = scene.querySelector('[data-mission-start]');
  const startLabel = start.querySelector('span');
  const pauseButton = scene.querySelector('[data-mission-pause]');
  const exit = scene.querySelector('[data-mission-exit]');
  const idleHelp = scene.querySelector('[data-orbital-help]');
  const gameHelp = scene.querySelector('#mission-help');
  const level = scene.querySelector('[data-mission-level]');
  const total = scene.querySelector('[data-mission-total]');
  const goal = scene.querySelector('[data-mission-goal]');
  const score = scene.querySelector('[data-mission-score]');
  const shield = scene.querySelector('[data-mission-shield]');
  const notice = scene.querySelector('[data-mission-notice]');
  const title = scene.querySelector('[data-mission-title]');
  const detail = scene.querySelector('[data-mission-detail]');
  const status = scene.querySelector('[data-mission-status]');
  const held = new Map();
  const input = { pointer: null, left: false, right: false, up: false, down: false, fire: false, trigger: false };
  let mode = 'idle';
  let roundAction = 'reset';
  let game;
  let pointerId = null;
  controls.hidden = false;

  function clearInput() {
    held.clear();
    input.left = input.right = input.up = input.down = input.fire = input.trigger = false;
    input.pointer = null;
    if (pointerId !== null && field.hasPointerCapture(pointerId)) field.releasePointerCapture(pointerId);
    pointerId = null;
  }

  function updateHud(hits, shields) {
    if (score.textContent !== String(hits)) score.textContent = hits;
    if (shield.textContent !== String(shields)) shield.textContent = shields;
  }

  function showMessage(heading, message) {
    notice.hidden = false;
    title.textContent = heading;
    detail.textContent = message;
    status.textContent = `${heading}. ${message}`;
  }

  function fly() {
    mode = 'playing';
    start.hidden = true;
    pauseButton.hidden = false;
    pauseButton.textContent = 'Pausar';
    notice.hidden = true;
    field.tabIndex = 0;
    field.focus({ preventScroll: true });
    game.setRunning(true);
  }

  function pause(focus = false) {
    if (mode !== 'playing') return;
    mode = 'paused';
    game.setRunning(false);
    clearInput();
    field.tabIndex = -1;
    pauseButton.textContent = 'Continuar';
    showMessage('Misión en pausa', 'Pulsa Continuar para volver al campo.');
    if (focus) pauseButton.focus({ preventScroll: true });
  }

  function finish({ number, nextName, shields }) {
    mode = 'ended';
    game.setRunning(false);
    clearInput();
    field.tabIndex = -1;
    pauseButton.hidden = true;
    start.hidden = false;

    if (!shields) {
      roundAction = 'retry';
      startLabel.textContent = 'Reintentar';
      showMessage('Escudos agotados', `Puedes volver a intentar el nivel ${number}.`);
    } else if (nextName) {
      roundAction = 'advance';
      startLabel.textContent = 'Siguiente nivel';
      const shieldNote = shields < 3 ? ' Recuperas un escudo al avanzar.' : '';
      showMessage(`Nivel ${number} completado`, `Siguiente: ${nextName}.${shieldNote}`);
    } else {
      roundAction = 'reset';
      startLabel.textContent = 'Volver a jugar';
      showMessage('Misión cumplida', 'Completaste todos los niveles.');
    }
    if (document.activeElement === field || document.activeElement === document.body) {
      start.focus({ preventScroll: true });
    }
  }

  function close() {
    mode = 'idle';
    roundAction = 'reset';
    game?.setRunning(false);
    clearInput();
    mission.hidden = true;
    field.tabIndex = -1;
    exit.hidden = true;
    pauseButton.hidden = true;
    idleHelp.hidden = false;
    gameHelp.hidden = true;
    start.hidden = start.disabled = false;
    startLabel.textContent = 'Jugar';
    start.focus({ preventScroll: true });
    onOpen(false);
  }

  async function startMission() {
    if (mode !== 'ended' && mode !== 'idle') return;
    mode = 'loading';
    start.disabled = true;
    startLabel.textContent = 'Cargando…';
    status.textContent = 'Cargando Misión Órbita.';
    try {
      if (!game) {
        const { mountMission } = await import('./mission-game.js');
        game = await mountMission(field, input, updateHud, finish);
      }
      clearInput();
      mission.hidden = gameHelp.hidden = false;
      idleHelp.hidden = true;
      exit.hidden = false;
      start.disabled = false;
      onOpen(true);
      const round = game[roundAction]();
      level.textContent = round.number;
      total.textContent = round.total;
      goal.textContent = round.goal;
      status.textContent = `Nivel ${round.number} de ${round.total}, ${round.name}. Destruye ${round.goal} asteroides.`;
      fly();
      if (!canPlay()) pause();
    } catch {
      close();
      status.textContent = 'El juego no pudo iniciar. Pulsa Jugar para intentarlo de nuevo.';
      idleHelp.textContent = 'El juego no pudo iniciar. Intenta de nuevo.';
    }
  }

  function pointerTarget(event) {
    const bounds = field.getBoundingClientRect();
    input.pointer = {
      x: (event.clientX - bounds.left) / bounds.width,
      y: (event.clientY - bounds.top) / bounds.height,
    };
  }

  field.addEventListener('pointerdown', (event) => {
    if (mode !== 'playing' || !event.isPrimary || event.button !== 0 || pointerId !== null) return;
    event.preventDefault();
    field.focus({ preventScroll: true });
    pointerId = event.pointerId;
    field.setPointerCapture(pointerId);
    pointerTarget(event);
    input.trigger = true;
  });
  field.addEventListener('pointermove', (event) => {
    if (pointerId === event.pointerId) pointerTarget(event);
  });
  field.addEventListener('lostpointercapture', (event) => {
    if (pointerId !== event.pointerId) return;
    input.pointer = null;
    pointerId = null;
  });
  field.addEventListener('keydown', (event) => {
    if (mode !== 'playing') return;
    if (event.key === 'Escape') {
      event.preventDefault();
      pause(true);
      return;
    }
    const action = keys.get(event.key.toLowerCase()) ?? keys.get(event.key);
    if (!action) return;
    event.preventDefault();
    if (action === 'fire' && !event.repeat) input.trigger = true;
    held.set(event.code, action);
    input[action] = true;
  });
  field.addEventListener('keyup', (event) => {
    const action = held.get(event.code);
    if (!action) return;
    held.delete(event.code);
    input[action] = Array.from(held.values()).includes(action);
  });
  field.addEventListener('blur', clearInput);
  start.addEventListener('click', startMission);
  pauseButton.addEventListener('click', () => {
    if (mode === 'playing') pause(true);
    else if (canPlay()) fly();
  });
  exit.addEventListener('click', close);
  return { pause };
}
