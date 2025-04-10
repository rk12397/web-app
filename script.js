let score = 0;
let gameOver = false;
const lanes = [-2, 0, 2];
let currentLaneIndex = 1;

const scoreEl = document.getElementById('score');
const finalScoreEl = document.getElementById('finalScore');
const gameOverDiv = document.getElementById('gameOver');
const gameDiv = document.getElementById('game');

// THREE.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, gameDiv.clientWidth / gameDiv.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(gameDiv.clientWidth, gameDiv.clientHeight);
gameDiv.appendChild(renderer.domElement);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1).normalize();
scene.add(light);

// Player Cube
const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
const playerMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffcc });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.y = -2;
player.position.x = lanes[currentLaneIndex];
scene.add(player);

// Obstacles
const obstacles = [];

function createObstacle() {
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const mat = new THREE.MeshStandardMaterial({ color: 0xff5555 });
  const block = new THREE.Mesh(geo, mat);
  const randomLane = lanes[Math.floor(Math.random() * lanes.length)];
  block.position.set(randomLane, 3, 0);
  scene.add(block);
  obstacles.push(block);
}

// Camera position
camera.position.z = 4;

// Movement logic
function moveLeft() {
  if (currentLaneIndex > 0 && !gameOver) {
    currentLaneIndex--;
    player.position.x = lanes[currentLaneIndex];
  }
}

function moveRight() {
  if (currentLaneIndex < lanes.length - 1 && !gameOver) {
    currentLaneIndex++;
    player.position.x = lanes[currentLaneIndex];
  }
}

// Expose to global scope so buttons can call these
window.moveLeft = moveLeft;
window.moveRight = moveRight;

// Add arrow key support
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') moveLeft();
  if (e.key === 'ArrowRight') moveRight();
});

// Game loop
function animate() {
  if (gameOver) return;

  requestAnimationFrame(animate);

  obstacles.forEach((obs, i) => {
    obs.position.y -= 0.07;

    if (
      obs.position.x === player.position.x &&
      Math.abs(obs.position.y - player.position.y) < 1
    ) {
      gameOver = true;
      finalScoreEl.innerText = score;
      gameOverDiv.style.display = 'block';
    }

    if (obs.position.y < -5) {
      scene.remove(obs);
      obstacles.splice(i, 1);
    }
  });

  score++;
  scoreEl.innerText = score;

  renderer.render(scene, camera);
}

// Obstacle spawning
setInterval(() => {
  if (!gameOver) createObstacle();
}, 1300);

// Start animation
animate();
