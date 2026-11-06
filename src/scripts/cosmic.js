// Motivos del fondo original: asteroides irregulares, estrellas y un planeta con anillos.
export async function mountCosmos(container) {
  const { default: P5 } = await import('p5');
  return new Promise((resolve) => {
    new P5((p) => {
      const stars = [];
      const rocks = [];
      let cursorX = 0;
      let cursorY = 0;
      let driftX = 0;
      let driftY = 0;
      let active = false;

      function populate() {
        stars.length = rocks.length = 0;
        const compact = p.width < 720;
        for (let i = 0; i < (compact ? 27 : 64); i++) {
          stars.push({ x: p.random(p.width), y: p.random(p.height), size: p.random(.6, 1.8), phase: p.random(6.28) });
        }
        for (let i = 0; i < (compact ? 4 : 8); i++) {
          const sides = Math.floor(p.random(6, 10));
          rocks.push({
            x: p.random(p.width), y: p.random(p.height), radius: p.random(12, 41), angle: p.random(6.28),
            dx: p.random(-.36, .38), dy: p.random(-.19, .23),
            shape: Array.from({ length: sides }, () => p.random(.64, 1.18)),
          });
        }
      }

      p.setup = () => {
        p.pixelDensity(1);
        p.createCanvas(Math.max(1, container.clientWidth), Math.max(1, container.clientHeight));
        p.frameRate(24);
        p.noLoop();
        populate();
        new ResizeObserver(() => {
          const width = Math.max(1, container.clientWidth);
          const height = Math.max(1, container.clientHeight);
          if (width === p.width && height === p.height) return;
          p.resizeCanvas(width, height, true);
          populate();
        }).observe(container);

        window.addEventListener('pointermove', (event) => {
          if (!active || event.pointerType !== 'mouse') return;
          cursorX = (event.clientX / innerWidth - .5) * 14;
          cursorY = (event.clientY / innerHeight - .5) * 10;
        }, { passive: true });

        resolve((shouldRun) => {
          if (active === shouldRun) return;
          active = shouldRun;
          if (active) p.loop();
          else p.noLoop();
        });
      };

      p.draw = () => {
        if (!active) return;
        p.clear();
        const time = p.frameCount * .019;
        driftX += (cursorX - driftX) * .12;
        driftY += (cursorY - driftY) * .12;

        p.noStroke();
        for (const star of stars) {
          p.fill(205, 187, 246, 58 + Math.sin(time + star.phase) * 30);
          p.circle(star.x + driftX * .4, star.y + driftY * .4, star.size);
        }

        p.noFill();
        p.strokeWeight(1);
        p.stroke(179, 155, 225, 41);
        for (const rock of rocks) {
          rock.x = (rock.x + rock.dx + 42 + p.width + 84) % (p.width + 84) - 42;
          rock.y = (rock.y + rock.dy + 42 + p.height + 84) % (p.height + 84) - 42;
          p.push();
          p.translate(rock.x + driftX, rock.y + driftY);
          p.rotate(rock.angle + time * .16);
          p.beginShape();
          rock.shape.forEach((factor, index) => {
            const angle = index / rock.shape.length * p.TWO_PI;
            p.vertex(Math.cos(angle) * rock.radius * factor, Math.sin(angle) * rock.radius * factor);
          });
          p.endShape(p.CLOSE);
          p.pop();
        }

        p.push();
        p.translate(p.width * .32 - driftX, p.height * .89 - driftY);
        p.rotate(-.3 + Math.sin(time * .13) * .06);
        const radius = Math.min(p.width * .135, 155);
        p.stroke(231, 162, 175, 42);
        p.circle(0, 0, radius);
        p.stroke(190, 166, 236, 33);
        p.ellipse(0, 0, radius * 1.55, radius * .34);
        p.ellipse(0, 0, radius * 1.75, radius * .4);
        p.pop();
      };
    }, container);
  });
}
