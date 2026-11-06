# Portafolio de Aldo Allende

Portafolio personal de desarrollo web. Reúne siete proyectos, mi trayectoria profesional y **Misión Órbita**, un minijuego de naves con cuatro niveles. El sitio está hecho con Astro, TypeScript y p5.js.

[Ver portafolio](https://invedallens.github.io/portfolio-personal/) · [Explorar proyectos](https://invedallens.github.io/portfolio-personal/proyectos/)

## Ejecutar en local

Requiere Node.js 24 LTS. Desde la carpeta que contiene `package.json`, ejecuta:

```bash
npm ci
npm run dev -- --host 127.0.0.1 --port 4324
```

Abre [el portafolio local](http://127.0.0.1:4324/portfolio-personal/). Para validar los archivos y generar el sitio de producción:

```bash
npm run validate
npm run build
```

La compilación se genera en `dist/`. Puedes revisarla con `npm run preview -- --host 127.0.0.1 --port 4325` y abrir [la vista previa](http://127.0.0.1:4325/portfolio-personal/).

## Jugar Misión Órbita

Pulsa **Jugar** junto al planeta. Los cuatro niveles tienen metas de 5, 7, 9 y 11 asteroides. Al avanzar recuperas un escudo, hasta un máximo de tres.

- En escritorio, mueve la nave con las flechas o WASD y mantén espacio para disparar.
- En móvil, mantén un dedo sobre el campo y arrástralo para mover la nave y disparar.
- Usa **Pausar** o Esc para detener la partida. Si pierdes, puedes reintentar el nivel actual.

## Estructura del proyecto

| Ruta | Contenido |
| --- | --- |
| [`src/pages/`](src/pages/) | Portada y catálogo de proyectos |
| [`src/components/`](src/components/) y [`src/layouts/`](src/layouts/) | Componentes y estructura de las páginas |
| [`src/data/`](src/data/) | Datos del perfil, la trayectoria y los proyectos |
| [`src/scripts/`](src/scripts/) | Navegación, contacto, animaciones y minijuego |
| [`public/images/`](public/images/) | Capturas e ilustraciones |
| [`public/proyectos.html`](public/proyectos.html) | Redirección desde la antigua URL del catálogo |

## Publicar en GitHub Pages

El [flujo de GitHub Actions](.github/workflows/deploy.yml) instala las dependencias, valida el proyecto y ejecuta la compilación en los pull requests hacia `main`. Al integrar los cambios en `main`, publica `dist/`.

En **Settings → Pages**, selecciona **GitHub Actions** como fuente. La ruta base `/portfolio-personal/` está en [`astro.config.mjs`](astro.config.mjs).
