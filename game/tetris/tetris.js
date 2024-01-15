const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);

function arenaSweep() {
  let rowCount = 1;
  outer: for (let y = arena.length - 1; y > 0; --y) {
    for (let x = 0; x < arena[y].length; ++x) {
        if (arena[y][x] === 0) {
          continue outer;
        }
    }

    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    ++y;

    player.score += rowCount * 10;
    rowCount *= 2;
  }
}

function collide(arena, player){
  const [m, o] = [player.tetrisPiece, player.pos]
  for(let y=0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (m[y][x] !== 0 && 
      (arena[y + o.y] &&
      arena[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

function createtetrisPiece(w, h) {
  const tetrisPiece = [];
  while(h--){
    tetrisPiece.push(new Array(w).fill(0));
  }
  return tetrisPiece;
}

function createPiece(type){
  if (type === "T") {
    return [
    [0,0,0],
    [1,1,1],
    [0,1,0],
];
  } else if (type === 'O') {
    return [
    [2,2],
    [2,2],
];
  } else if (type === 'L') {
    return [
    [0,3,0],
    [0,3,0],
    [0,3,3],
];
} else if (type === 'J') {
    return [
    [0,4,0],
    [0,4,0],
    [4,4,0],
];
} else if (type === 'I') {
    return [
    [0,5,0,0],
    [0,5,0,0],
    [0,5,0,0],
    [0,5,0,0],
];
} else if (type === 'S') {
    return [
    [0,6,6],
    [6,6,0],
    [0,0,0],
];
} else if (type === 'Z') {
    return [
    [7,7,0],
    [0,7,7],
    [0,0,0],
];
}
}
function draw() {
  
context.fillStyle = '#202028';
context.fillRect(0, 0, canvas.width, canvas.height);

drawtetrisPiece(arena, {x:0, y:0})
drawtetrisPiece(player.tetrisPiece, player.pos );
}

function drawtetrisPiece(tetrisPiece, offset) {
tetrisPiece.forEach((row, y) => {
  row.forEach((value, x) => {
    if (value !== 0) {
      context.fillStyle = colors[value];
      context.fillRect(x + offset.x,
                       y + offset.y,
                       1, 1);
    }
  });
});
};

function merge(arena, player) {
  player.tetrisPiece.forEach((row, y) =>{
    row.forEach((value, x) =>{
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    })
  })
}

function playerDrop() {
  player.pos.y++;
  if (collide(arena, player)){
    player.pos.y--;
    merge(arena, player);
    playerReset();
    arenaSweep();
    updateScore();
  }
   dropCounter = 0; 
}

function playerMove(dir) {
  player.pos.x += dir
  if (collide(arena, player)) {
    player.pos.x -= dir
  }
}

function playerReset() {
  const pieces = "ILJOTSZ"
  player.tetrisPiece = createPiece(pieces[pieces.length*Math.random() | 0]);
  player.pos.y =  0
  player.pos.x = (arena[0].length / 2 | 0 ) -
                 (player.tetrisPiece[0].length / 2 | 0);
  if (collide(arena, player)) {
    arena.forEach(row => row.fill(0));
    player.score = 0;
    updateScore()
  }
                
}

function playerRotate(dir) {
  const pos = player.pos.x
  let offset = 1;
  rotate(player.tetrisPiece, dir)
  while (collide(arena, player)) {
player.pos.x += offset;
offset = -(offset + (offset > 0 ? 1: -1));
if (offset > player.tetrisPiece[0].length) {
  rotate(player.tetrisPiece, -dir)
  player.pos.x = pos;
  return;
}
  }
}

function rotate(tetrisPiece, dir) {
  for(let y = 0; y < tetrisPiece.length; ++y) {
    for( let x=0; x < y; ++x){
      [
        tetrisPiece[x][y],
        tetrisPiece[y][x],
      ] = [
        tetrisPiece[y][x],
        tetrisPiece[x][y],
      ];
    }
  }
  if (dir > 0) {
  tetrisPiece.forEach(row => row.reverse())
} else {
  tetrisPiece.reverse()
}
}

let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;
function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  
dropCounter += deltaTime
if (dropCounter > dropInterval) {
  playerDrop()
}
  
  draw();
  requestAnimationFrame(update)
}

function updateScore() {
  document.getElementById('score').innerText = player.score
}

const colors = [
  null,
  '#F11414',
  '#f1e814',
  '#3df114',
  '#14f1eb',
  '#1439f1',
  '#d914f1',
  '#ff8d2e',
]

const arena = createtetrisPiece(12, 20) 

const player = {
  pos: {x:0, y:0},
  tetrisPiece: null,
  score: 0,
}

document.addEventListener ('keydown', event => {
  if (event.keyCode === 37) {
   playerMove(-1);
  } else if (event.keyCode === 39){
   playerMove(1);
  } else if (event.keyCode === 40) {
    playerDrop()
  } else if (event.keyCode === 32) {
    playerRotate(-1);
  };
})

playerReset();
updateScore();
update();