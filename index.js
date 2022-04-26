const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const startButton = document.querySelector("#startGame");
const startModal = document.querySelector("#startModal");
const restartButton = document.querySelector("#restartGame");

canvas.width = 1024;
canvas.height = 576;

ctx.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imgSrc: "./img/background.png",
});
const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imgSrc: "./img/shop.png",
  scale: 2.75,
  framesMax: 6,
});
const player = new Fighter({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  offset: { x: 0, y: 0 },
  imgSrc: "./img/samuraiMack/idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imgSrc: "./img/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imgSrc: "./img/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imgSrc: "./img/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imgSrc: "./img/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imgSrc: "./img/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    attack2: {
      imgSrc: "./img/samuraiMack/Attack2.png",
      framesMax: 6,
    },
    takeHit: {
      imgSrc: "./img/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imgSrc: "./img/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 70,
      y: 50,
    },
    width: 190,
    height: 50,
  },
});
const enemy = new Fighter({
  position: { x: canvas.width - 50, y: 0 },
  velocity: { x: 0, y: 0 },
  color: "blue",
  offset: { x: 50, y: 0 },
  imgSrc: "./img/kenji/idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167,
  },
  sprites: {
    idle: {
      imgSrc: "./img/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imgSrc: "./img/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imgSrc: "./img/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imgSrc: "./img/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imgSrc: "./img/kenji/Attack1.png",
      framesMax: 4,
    },
    attack2: {
      imgSrc: "./img/kenji/Attack2.png",
      framesMax: 4,
    },
    takeHit: {
      imgSrc: "./img/kenji/Take Hit.png",
      framesMax: 3,
    },
    death: {
      imgSrc: "./img/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -175,
      y: 50,
    },
    width: 175,
    height: 50,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};

// decreaseTimer();
// function init (){

// }
let gameState = "start";
function animate() {
  window.requestAnimationFrame(animate);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.width);
  background.update();
  shop.update();
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();
  player.velocity.x = 0;
  enemy.velocity.x = 0;
  //player movement
  if (keys.a.pressed && player.lastKey === "a" && player.position.x >= 0) {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  //enemy movement
  // if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
  //   enemy.velocity.x = -5;
  //   enemy.switchSprite("run");
  // } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
  //   enemy.velocity.x = 5;
  //   enemy.switchSprite("run");
  // } else {
  //   enemy.switchSprite("idle");
  // }

  //ENEMY AI MOVEMENT
  //keeps CPU idle until gameState changes to "fight"
  if (gameState === "fight") {
    //mini jump dodge
    if (
      player.isAttacking &&
      enemy.position.y > canvas.height / 2 &&
      enemy.position.x > 0
    ) {
      enemy.velocity.x = -5;
      enemy.velocity.y = -10;
      enemy.switchSprite("run");
    }
    //maintain pressure on player 1
    else if (
      enemy.position.x + enemy.width / 2 >
      player.position.x + enemy.attackBox.width
    ) {
      enemy.velocity.x = -5;
      enemy.switchSprite("run");
    }
    //keep player 1 in front of you
    else if (
      enemy.position.x + enemy.width / 2 <
      player.position.x +
        enemy.width +
        enemy.attackBox.width +
        enemy.attackBox.offset.x +
        30
    ) {
      enemy.velocity.x = 5;
      enemy.switchSprite("run");
    }
    //attack but have mercy  -- no 60+ hits a second you naughty CPU
    else if (
      rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
      enemy.image !== enemy.sprites.attack1.image &&
      enemy.framesElapsed % enemy.framesCurrent == 1
    ) {
      enemy.attack();
    }
    //mirror the jumps of player 1 -- we cannot allow for complete highground domination
    else if (
      player.image == player.sprites.jump.image &&
      enemy.position.y > canvas.height / 2
    ) {
      enemy.velocity.y = -20;
    }
    // prevents CPU from getting stuck in a run or attack loop
    else {
      enemy.switchSprite("idle");
    }
  } else {
    enemy.switchSprite("idle");
  }

  //animation swticher
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  //detect collision
  if(gameState==="fight"){
    if (
      rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
      player.isAttacking &&
      player.health > 0 &&
      player.framesCurrent === 4
    ) {
      enemy.takeHit();
      player.isAttacking = false;
      gsap.to("#enemyHealth", {
        width: `${enemy.health}%`,
      });
    }
    if (player.isAttacking && player.framesCurrent === 4) {
      player.isAttacking = false;
    }
    if (
      rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
      enemy.health > 0 &&
      enemy.isAttacking
    ) {
      enemy.attack();
      player.takeHit();
      enemy.isAttacking = false;
      gsap.to("#playerHealth", {
        width: `${player.health}%`,
      });
    }
  
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
      enemy.isAttacking = false;
    }
  
    //end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
      determineWinner({ player, enemy, timerId });
      gameState = "done";
      setTimeout(() => {
        restartButton.style.display = "flex";
      }, 2000);
    }
  }
}
animate();

startButton.addEventListener("click", () => {
  // animate()
  decreaseTimer();
  startModal.style.display = "none";
  gameState = "fight";
});
restartButton.addEventListener("click", () => {
 location.reload()
});
window.addEventListener("keydown", (event) => {
  //player keys
  if (!player.dead && gameState ==="fight") {
    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        if (player.position.y > canvas.height / 2) {
          player.velocity.y = -20;
        }
        break;
      case " ":
        player.attack();
        break;
    }
  }
});
window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      break;
    default:
  }
  // console.log(event.key);
});
