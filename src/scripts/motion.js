import { connectMission } from './mission-controls.js';
import { mountOrbital } from './orbital-controls.js';

const scene = document.querySelector('[data-orbital]');
const view = document.querySelector('[data-orbital-view]');
const help = document.querySelector('[data-orbital-help]');
const backdrop = view.closest('.hero-backdrop');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const runScene = mountOrbital(view);
let visible = false;
let missionOpen = false;

const mission = connectMission(scene, (open) => {
  missionOpen = open;
  sync();
}, () => visible && document.visibilityState === 'visible');

function sync() {
  const pageVisible = document.visibilityState === 'visible';
  const idle = !missionOpen && !reduced.matches && visible && pageVisible;
  document.documentElement.dataset.motion = pageVisible && !reduced.matches ? 'on' : 'off';
  if (!visible || !pageVisible) mission.pause();
  help.textContent = idle ? 'Arrastra para girar el planeta' : 'Minijuego de naves';
  runScene(idle);
}

function startAmbientMotion() {
  if (missionOpen || reduced.matches) return;
  backdrop?.classList.add('orbital-intro');
  view.removeEventListener('pointerdown', startAmbientMotion);
  view.removeEventListener('keydown', startAmbientMotion);
}

view.addEventListener('pointerdown', startAmbientMotion);
view.addEventListener('keydown', startAmbientMotion);

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
sync();
