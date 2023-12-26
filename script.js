const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.height = 768;
canvas.width = 1280;

c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

const placementTilesData2D = [];
const placementTiles = [];
for (let i = 0; i < placementTilesData.length; i += 40) {
  placementTilesData2D.push(placementTilesData.slice(i, i + 40));
}
placementTilesData2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 28) {
      placementTiles.push(
        new PlacementTile({
          x: x * 32,
          y: y * 32,
        })
      );
    }
  });
});
const image = new Image();

image.onload = () => {
  animate();
};
image.src = "assets/level1.png";

function getRandomArray() {
  const randomValue = Math.random();
  if (randomValue < 0.5) {
    return path1;
  } else {
    return path2;
  }
}

const enemies = [];

function spawnEnemies(spawnCount) {
  for (let i = 1; i < spawnCount + 1; i++) {
    const xOffset = i * 150;
    enemies.push(
      new Enemy(
        { position: { x: path1[0].x - xOffset, y: path1[0].y } },
        getRandomArray()
      )
    );
  }
}

const allies = [];
let activeTile = undefined;
let enemyCount = 3;
let hearts = 10;
let coins = 100;
let gameover = false;
const explosions = [];
spawnEnemies(enemyCount);
function animate() {
  if (!gameover) {
    requestAnimationFrame(animate);
    c.drawImage(image, 0, 0);
    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];
      enemy.update();

      if (enemy.position.x > canvas.width) {
        hearts -= 1;
        document.querySelector("#hearts").innerHTML = hearts;
        enemies.splice(i, 1);
        if (hearts === 0) {
          console.log("game over");
          gameover = true;
          document.querySelector("#gameOver").style.display = "flex";
        }
      }
    }
    for (let i = explosions.length - 1; i >= 0; i--) {
      const explosion = explosions[i];
      explosion.draw();
      explosion.update();
      if (explosion.frames.current >= explosion.frames.max - 1) {
        explosions.splice(i, 1);
      }
    }
    //tracking total amount of enemies
    if (enemies.length === 0) {
      spawnEnemies((enemyCount += 2));
    }
    placementTiles.forEach((tile) => {
      tile.update(mouse);
    });

    allies.forEach((ally) => {
      ally.update();
      ally.target = null;
      const validEnemies = enemies.filter((enemy) => {
        const xDifference = enemy.center.x - ally.center.x;
        const yDifference = enemy.center.y - ally.center.y;
        const distance = Math.hypot(xDifference, yDifference);
        return distance < enemy.radius + ally.radius;
      });
      ally.target = validEnemies[0];
      for (let i = ally.projectiles.length - 1; i >= 0; i--) {
        const projectile = ally.projectiles[i];

        projectile.update();
        const xDifference = projectile.enemy.center.x - projectile.position.x;
        const yDifference = projectile.enemy.center.y - projectile.position.y;
        const distance = Math.hypot(xDifference, yDifference);
        //projectile hits an enemy
        if (distance < projectile.enemy.radius + projectile.radius) {
          //eneemy health and enemy removal
          projectile.enemy.health -= 20;
          if (projectile.enemy.health <= 0) {
            const enemyIndex = enemies.findIndex((enemy) => {
              return enemy === projectile.enemy;
            });
            if (enemyIndex > -1) {
              enemies.splice(enemyIndex, 1);
              coins += 25;
              document.querySelector("#coins").innerHTML = coins;
            }
          }
          explosions.push(
            new Sprite({
              position: {
                x: projectile.enemy.position.x,
                y: projectile.enemy.position.y,
              },
              imageSrc: "assets/fireExplosion.png",
              frames: { max: 3.5, hold: 5 },
              offset: { x: 0, y: 0 },
            })
          );
          ally.projectiles.splice(i, 1);
        }
      }
    });
  }
}

const mouse = {
  x: undefined,
  y: undefined,
};

canvas.addEventListener("click", (event) => {
  if (activeTile && !activeTile.isOccupied && coins >= 50) {
    coins -= 50;
    document.querySelector("#coins").innerHTML = coins;
    allies.push(
      new Ally({
        position: {
          x: activeTile.position.x,
          y: activeTile.position.y,
        },
      })
    );
    activeTile.isOccupied = true;
    allies.sort((a, b) => {
      return a.position.y - b.position.y;
    });
  }
});
window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;

  activeTile = null;
  for (let i = 0; i < placementTiles.length; i++) {
    const tile = placementTiles[i];
    if (
      mouse.x > tile.position.x &&
      mouse.x < tile.position.x + tile.size &&
      mouse.y > tile.position.y &&
      mouse.y < tile.position.y + tile.size
    ) {
      activeTile = tile;
      break;
    }
  }
});

animate();
