const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

ctx.fillRect(0, 0, canvas.width, canvas.height);

class Sprite {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
  }
  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.position.x, this.position.y, 50, 150);
  }
  update() {

  }
}

const player = new Sprite({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
});
const enemy = new Sprite({
  position: { x: canvas.width - 50, y: 0 },
  velocity: { x: 0, y: 0 },
});

player.draw();
enemy.draw();

function animate() {
  window.requestAnimationFrame(animate);
}

animate();
