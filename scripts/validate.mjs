import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const read = (p) => readFileSync(path.join(root, p), 'utf8');
const exists = (p) => existsSync(path.join(root, p));
const source = read('src/data/projects.ts');
const base = read('astro.config.mjs');
const originalImageIds = ['appsalon_captura_tablet','bienesraices_captura_tablet','encriptador_challenge','controldegastos_vtablet','veterinaria_citas_tablet','cotizadorMonedas_vportatil','festival-musical'];
const ids = Array.from(source.matchAll(/id: '([^']+)'/g), (m) => m[1]);
assert.equal(ids.length, 7, 'Deben existir los 7 proyectos originales');
assert.equal(new Set(ids).size, 7, 'Los identificadores de proyectos no deben repetirse');
assert.match(base, /base:\s*'\/portfolio-personal'/);
assert.match(base, /output:\s*'static'/);
assert.match(read('src/pages/index.astro'), /<ContactForm/);
assert.match(read('src/pages/proyectos/index.astro'), /projects\.map/);
assert.match(read('public/proyectos.html'), /\/portfolio-personal\/proyectos\//);
for (const id of originalImageIds) {
  assert.ok(source.includes(`image: '${id}'`), `Falta el proyecto ${id}`);
  for (const type of ['avif', 'webp']) {
    const file = `public/images/${id}.${type}`;
    assert.ok(exists(file), `Falta la imagen ${file}`);
    assert.ok(statSync(path.join(root, file)).size > 100, `Imagen vacía: ${file}`);
  }
}
for (const file of ['src/pages/index.astro','src/pages/proyectos/index.astro','src/layouts/BaseLayout.astro','src/styles/global.css','public/images/nave-orbital.webp','public/images/mi-logo2.svg']) {
  assert.ok(exists(file), `Falta ${file}`);
}
assert.match(read('src/pages/index.astro'), /timeline-item--current/);
assert.match(read('src/pages/index.astro'), /<OrbitalScene/);
assert.equal(Array.from(read('src/data/site.ts').matchAll(/current: true/g)).length, 2);
assert.match(read('src/components/OrbitalScene.astro'), /data-mission-start/);
assert.match(read('src/scripts/mission-game.js'), /import\('p5'\)/);
assert.ok(!exists('public/images/aldoallens.avif') && !exists('public/images/aldoallens.webp'));
assert.match(read('public/images/orbita.svg'), /^<svg /);
assert.match(read('src/scripts/cosmic.js'), /import\('p5'\)/);
assert.match(read('src/scripts/motion.js'), /prefers-reduced-motion/);
assert.equal(JSON.parse(read('package.json')).dependencies.p5, '1.11.13');
console.log('Correcto: 7 proyectos, 14 imágenes, ruta base, minijuego orbital, ilustración y dos hitos actuales.');
