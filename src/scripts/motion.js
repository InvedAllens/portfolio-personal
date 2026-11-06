import { connectMission } from './mission-controls.js';

const scene = document.querySelector('[data-orbital]');
const view = document.querySelector('[data-orbital-view]');
const cosmos = document.getElementById('cosmic-canvas');
const help = document.querySelector('[data-orbital-help]');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let visible = false;
let ready = false;
let missionOpen = false;
let sceneTask;
let cosmosTask;
let runScene;
let runCosmos;
let intro = false;
let introPlayed = false;

const mission = connectMission(scene, (open) => {
  missionOpen = open;
  sync();
}, () => visible && document.visibilityState === 'visible');

function sync() {
  const pageVisible = document.visibilityState === 'visible';
  const idle = !missionOpen && !reduced.matches && visible && pageVisible;
  document.documentElement.dataset.motion = pageVisible && !reduced.matches ? 'on' : 'off';
  if (!visible || !pageVisible) mission.pause();
  help.textContent = runScene && idle ? 'Arrastra para girar el planeta' : 'Minijuego de naves';
  runScene?.(idle, idle && intro);
  runCosmos?.(idle && intro);

  if (!idle || !ready) return;
  sceneTask ??= import('./orbital-renderer.js')
    .then(({ mountOrbital }) => {
      runScene = mountOrbital(view);
      sync();
    })
    .catch(() => { /* Keep the vector illustration visible. */ });
  if (!runScene || introPlayed) return;
  introPlayed = intro = true;
  runScene(true, true);
  setTimeout(() => {
    intro = false;
    sync();
  }, 4100);

  cosmosTask ??= import('./cosmic.js')
    .then(async ({ mountCosmos }) => {
      runCosmos = await mountCosmos(cosmos);
      sync();
    })
    .catch(() => { /* Keep the static background visible. */ });
}

function schedule() {
  const start = () => {
    ready = true;
    sync();
  };
  if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 1000 });
  else setTimeout(start, 250);
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.intersectionRatio >= .16;
    sync();
  }, { threshold: .16 });
  observer.observe(view);

  const artwork = document.querySelector('[data-about-illustration]');
  if (artwork) {
    const reveal = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      artwork.classList.add('illustration-in-view');
      reveal.disconnect();
    }, { threshold: .25 });
    reveal.observe(artwork);
  }
} else {
  visible = true;
}
document.addEventListener('visibilitychange', sync);
reduced.addEventListener('change', sync);
if (document.readyState === 'complete') schedule();
else window.addEventListener('load', schedule, { once: true });
sync();
