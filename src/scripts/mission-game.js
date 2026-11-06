const WIDTH = 620;
const HEIGHT = 520;
const SHIP_RADIUS = 15;
const MAX_SHIELDS = 3;
const TAU = Math.PI * 2;
const LEVELS = [
  { name: 'Cinturón exterior', goal: 5, speed: [70, 104], radius: [25, 36], drift: 12, interval: 1.08, color: '#c0aef5' },
  { name: 'Corriente lateral', goal: 7, speed: [88, 123], radius: [22, 33], drift: 60, interval: .93, color: '#a9c7fa' },
  { name: 'Campo fragmentado', goal: 9, speed: [116, 157], radius: [15, 24], drift: 42, interval: .79, color: '#f0c899' },
  { name: 'Tormenta orbital', goal: 11, speed: [129, 179], radius: [16, 34], drift: 82, interval: .65, color: '#e4a9dc' },
];

const limit = (value, min, max) => Math.max(min, Math.min(max, value));
const distanceSquared = (a, b) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;

export async function mountMission(field, input, updateHud, finish) {
  const { default: P5 } = await import('p5');
  return new Promise((resolve, reject) => {
    new P5((p) => {
      const ship = { x: WIDTH / 2, y: HEIGHT - 73 };
      let asteroids = [];
      let shots = [];
      let sparks = [];
      let destroyed = 0;
      let shields = MAX_SHIELDS;
      let spawnIn = 0;
      let shotIn = 0;
      let shieldTime = 0;
      let running = false;
      let elapsed = 0;
      let levelIndex = 0;
      let level = LEVELS[0];
      let entryShields = MAX_SHIELDS;

      function asteroid(x = p.random(40, WIDTH - 40), y = -38) {
        return {
          x, y, radius: p.random(...level.radius), rotation: p.random(TAU),
          speed: p.random(...level.speed) + Math.min(elapsed, 20),
          drift: p.random(-level.drift, level.drift), spin: p.random(-1.15, 1.15),
          rim: Array.from({ length: 8 }, () => p.random(.78, 1.09)),
        };
      }

      function beginLevel(index, startingShields) {
        levelIndex = index;
        level = LEVELS[index];
        entryShields = startingShields;
        ship.x = WIDTH / 2;
        ship.y = HEIGHT - 73;
        elapsed = 0;
        asteroids = [asteroid(WIDTH / 2, 110)];
        asteroids[0].drift = 0;
        shots = [];
        sparks = [];
        destroyed = 0;
        shields = entryShields;
        spawnIn = level.interval;
        shotIn = 0;
        shieldTime = 0;
        updateHud(destroyed, shields);
        p.redraw();
        return { number: levelIndex + 1, total: LEVELS.length, name: level.name, goal: level.goal };
      }

      function moveShip(dt) {
        if (input.pointer) {
          const targetX = input.pointer.x * WIDTH;
          const targetY = input.pointer.y * HEIGHT - 22;
          const ease = 1 - Math.exp(-13 * dt);
          ship.x += (targetX - ship.x) * ease;
          ship.y += (targetY - ship.y) * ease;
        } else {
          const x = Number(input.right) - Number(input.left);
          const y = Number(input.down) - Number(input.up);
          const distance = Math.hypot(x, y) || 1;
          ship.x += x / distance * 310 * dt;
          ship.y += y / distance * 310 * dt;
        }
        ship.x = limit(ship.x, 21, WIDTH - 21);
        ship.y = limit(ship.y, 105, HEIGHT - 23);
      }

      function burst(x, y, shield = false) {
        for (let i = 0; i < 8; i++) {
          const direction = p.random(TAU);
          const speed = p.random(30, 130);
          sparks.push({ x, y, dx: Math.cos(direction) * speed, dy: Math.sin(direction) * speed, life: p.random(.16, .42), shield });
        }
      }

      function update(dt) {
        const previousHits = destroyed;
        const previousShields = shields;
        elapsed += dt;
        shieldTime = Math.max(0, shieldTime - dt);
        moveShip(dt);
        shotIn -= dt;
        spawnIn -= dt;
        if ((input.fire || input.pointer || input.trigger) && shotIn <= 0) {
          shots.push({ x: ship.x, y: ship.y - 20 });
          input.trigger = false;
          shotIn = .19;
        }
        if (spawnIn <= 0) {
          asteroids.push(asteroid());
          spawnIn = level.interval;
        }
        for (const rock of asteroids) {
          rock.x += rock.drift * dt;
          if ((rock.x < rock.radius && rock.drift < 0) || (rock.x > WIDTH - rock.radius && rock.drift > 0)) {
            rock.drift = -rock.drift;
          }
          rock.y += rock.speed * dt;
          rock.rotation += rock.spin * dt;
        }
        for (const shot of shots) {
          shot.y -= 470 * dt;
          const rock = asteroids.find((candidate) => !candidate.hit && distanceSquared(candidate, shot) < (candidate.radius + 5) ** 2);
          if (!rock) continue;
          shot.hit = rock.hit = true;
          burst(rock.x, rock.y);
          destroyed++;
          if (destroyed === level.goal) break;
        }
        for (const rock of asteroids) {
          if (shieldTime > 0 || destroyed === level.goal) break;
          if (rock.hit || distanceSquared(rock, ship) > (rock.radius + SHIP_RADIUS - 5) ** 2) continue;
          rock.hit = true;
          shields--;
          shieldTime = 1.12;
          burst(ship.x, ship.y, true);
        }
        for (const spark of sparks) {
          spark.x += spark.dx * dt;
          spark.y += spark.dy * dt;
          spark.life -= dt;
        }
        asteroids = asteroids.filter((rock) => !rock.hit && rock.y - rock.radius < HEIGHT);
        shots = shots.filter((shot) => !shot.hit && shot.y > -15);
        sparks = sparks.filter((spark) => spark.life > 0);
        if (destroyed !== previousHits || shields !== previousShields) updateHud(destroyed, shields);
        if (!shields || destroyed === level.goal) {
          finish({ number: levelIndex + 1, nextName: LEVELS[levelIndex + 1]?.name, shields });
        }
      }

      function drawShip() {
        if (!shields) return;
        p.push();
        p.translate(ship.x, ship.y);
        p.noStroke();
        p.fill('#ffb19886');
        p.triangle(-6, 11, 6, 11, 0, 25 + (running ? Math.sin(elapsed * 15) * 4 : 0));
        p.stroke(shieldTime > 0 ? '#ffb49c' : '#efe5ff');
        p.strokeWeight(1.5);
        p.fill('#b9a7f7');
        p.beginShape();
        p.vertex(0, -19);
        p.vertex(16, 13);
        p.vertex(0, 8);
        p.vertex(-16, 13);
        p.endShape(p.CLOSE);
        p.noStroke();
        p.fill('#42395b');
        p.triangle(0, -10, 5, 5, -5, 5);
        if (shieldTime > 0) {
          p.noFill();
          p.stroke('#ffb49c95');
          p.circle(0, 0, 49);
        }
        p.pop();
      }

      function drawRock(rock) {
        p.push();
        p.translate(rock.x, rock.y);
        p.rotate(rock.rotation);
        p.fill('#29223e');
        p.stroke(level.color);
        p.strokeWeight(1.6);
        p.beginShape();
        rock.rim.forEach((ratio, index) => {
          const angle = index / rock.rim.length * TAU;
          p.vertex(Math.cos(angle) * rock.radius * ratio, Math.sin(angle) * rock.radius * ratio);
        });
        p.endShape(p.CLOSE);
        p.noFill();
        p.stroke('#8974ae');
        p.strokeWeight(1.15);
        p.circle(-rock.radius * .2, -rock.radius * .19, rock.radius * .6);
        p.circle(rock.radius * .29, rock.radius * .28, rock.radius * .31);
        p.pop();
      }

      p.setup = () => {
        try {
          p.pixelDensity(1);
          const canvas = p.createCanvas(WIDTH, HEIGHT);
          canvas.attribute('aria-hidden', 'true');
          p.frameRate(60);
          p.noLoop();
          resolve({
            reset: () => beginLevel(0, MAX_SHIELDS),
            retry: () => beginLevel(levelIndex, entryShields),
            advance: () => beginLevel(levelIndex + 1, Math.min(shields + 1, MAX_SHIELDS)),
            setRunning(next) {
              if (next === running) return;
              running = next;
              if (running) p.loop();
              else p.noLoop();
            },
          });
        } catch (error) {
          p.remove();
          reject(error);
        }
      };

      p.draw = () => {
        if (running) update(Math.min(p.deltaTime / 1000, .045));
        p.clear();
        asteroids.forEach(drawRock);
        p.stroke('#ffbca5');
        p.strokeWeight(3.4);
        for (const shot of shots) p.line(shot.x, shot.y + 9, shot.x, shot.y - 5);
        p.noStroke();
        for (const spark of sparks) {
          p.fill(spark.shield ? '#d2bcff' : '#ffbd9f');
          p.circle(spark.x, spark.y, 3.5 * Math.min(1, spark.life * 4));
        }
        drawShip();
      };
    }, field);
  });
}
