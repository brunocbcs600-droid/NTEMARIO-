
// Simple Phaser 3 platformer inspired by Super Mario
const config = {
  type: Phaser.AUTO,
  parent: 'gameDiv',
  width: 800,
  height: 420,
  backgroundColor: '#87CEEB',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 800 }, debug: false }
  },
  scene: { preload, create, update }
};

const game = new Phaser.Game(config);

let player, cursors, platforms, coins, enemies, flagpole;
let score = 0, scoreText, lives=3, livesText;

function preload() {
  this.load.image('tiles', 'assets/enemies.png'); // reused as simple tilesheet for bricks/coins/enemies
  this.load.image('player', 'assets/player.png');
  // small simple images created from enemies.png will be used as frames (we assume 32x32)
  this.load.spritesheet('enemies', 'assets/enemies.png', { frameWidth: 32, frameHeight: 32 });
}

function create() {
  // simple level layout using static group for platforms
  platforms = this.physics.add.staticGroup();
  // ground
  platforms.create(400, 408, 'tiles').setScale(25, 1).refreshBody().setVisible(false);
  // create brick blocks (approx positions like World 1-1)
  platforms.create(120, 320, 'tiles').setScale(1,0.5).refreshBody().setVisible(false);
  platforms.create(220, 300, 'tiles').setScale(1,0.5).refreshBody().setVisible(false);
  platforms.create(320, 260, 'tiles').setScale(1,0.5).refreshBody().setVisible(false);
  platforms.create(420, 260, 'tiles').setScale(1,0.5).refreshBody().setVisible(false);
  platforms.create(520, 300, 'tiles').setScale(1,0.5).refreshBody().setVisible(false);
  platforms.create(680, 340, 'tiles').setScale(1,0.5).refreshBody().setVisible(false);
  // decorative visible bricks using Phaser Graphics
  drawBricks(this);

  // player
  player = this.physics.add.sprite(40, 340, 'player').setScale(0.45);
  player.setBounce(0.05);
  player.setCollideWorldBounds(true);
  player.body.setSize(player.width * 0.6, player.height * 0.9, true);

  // simple bobbing animation emulation: we will flip scaleX when moving for direction
  // coins group
  coins = this.physics.add.group();
  coins.create(220, 260, 'enemies', 10).setScale(1).setBounceY(0.2); // coin-like frame
  coins.create(320, 220, 'enemies', 10).setScale(1).setBounceY(0.2);
  coins.create(420, 220, 'enemies', 10).setScale(1).setBounceY(0.2);
  coins.create(520, 260, 'enemies', 10).setScale(1).setBounceY(0.2);

  // enemies (use frame 1..n as simple little critters)
  enemies = this.physics.add.group();
  let e1 = enemies.create(300, 370, 'enemies', 1).setScale(1);
  e1.setVelocityX(30);
  e1.setCollideWorldBounds(true);
  e1.setBounce(1, 0);

  // flagpole (end of level)
  flagpole = this.add.container(760, 260);
  const pole = this.add.rectangle(0, 0, 6, 200, 0x66ff66).setOrigin(0.5, 0);
  flagpole.add(pole);
  const flag = this.add.triangle(6, 10, 0, 0, 40, 10, 0, 20, 0xffffff).setFillStyle(0xffffff);
  flag.setData('scored', false);
  flagpole.add(flag);

  // UI
  scoreText = this.add.text(12, 8, 'Pontos: 0', { fontSize: '18px', fill: '#fff' });
  livesText = this.add.text(12, 28, 'Vidas: 3', { fontSize: '14px', fill: '#fff' });
  const castleLabel = this.add.text(540, 80, 'DIRETORIA REGIONAL DE ENSINO', { fontSize:'14px', fill:'#fff' });

  // collisions
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(coins, platforms);
  this.physics.add.collider(enemies, platforms);
  this.physics.add.collider(enemies, enemies);
  this.physics.add.overlap(player, coins, collectCoin, null, this);
  this.physics.add.overlap(player, enemies, hitEnemy, null, this);

  // inputs
  cursors = this.input.keyboard.createCursorKeys();

  // camera
  this.cameras.main.setBounds(0, 0, 900, 420);
  this.cameras.main.startFollow(player, true, 0.08, 0.08);
  this.physics.world.setBounds(0, 0, 900, 420);

  // instructions
  this.add.text(220, 12, 'Setas: mover / Espaço: pular', { fontSize:'12px', fill:'#000' }).setScrollFactor(0);

  // create simple walking tween for enemies
  enemies.children.iterate(function(en){ en.setGravityY(300); });
}

function update() {
  // basic controls
  if (cursors.left.isDown) {
    player.setVelocityX(-120);
    player.setFlipX(true);
    bob(player, true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(120);
    player.setFlipX(false);
    bob(player, true);
  } else {
    player.setVelocityX(0);
    bob(player, false);
  }

  if ((cursors.up.isDown || cursors.space.isDown) && player.body.touching.down) {
    player.setVelocityY(-360);
  }

  // check flagpole overlap - simple distance check
  const distToFlag = Phaser.Math.Distance.Between(player.x, player.y, 760, 260);
  if (distToFlag < 40) {
    if (!flagpole.getAt(1).getData('scored')) {
      flagpole.getAt(1).setData('scored', true);
      score += 400;
      scoreText.setText('Pontos: ' + score);
      this.add.text(player.x - 60, player.y - 80, 'Fase concluída!', { fontSize: '16px', fill: '#ff0' }).setScrollFactor(0).setDepth(100);
    }
  }

  // simple enemies patrol
  enemies.children.iterate(function(en){
    if (en.x < 200) en.setVelocityX(40);
    if (en.x > 700) en.setVelocityX(-40);
  });
}

// helper: coin collect
function collectCoin(player, coin) {
  coin.destroy();
  score += 100;
  scoreText.setText('Pontos: ' + score);
}

// helper: hit enemy
function hitEnemy(player, enemy) {
  if (player.body.velocity.y > 80) {
    // stomp
    enemy.destroy();
    score += 200;
    scoreText.setText('Pontos: ' + score);
    player.setVelocityY(-180);
  } else {
    // take damage: simple bounce back and lose life
    lives -= 1;
    livesText.setText('Vidas: ' + lives);
    player.setTint(0xff6666);
    player.setVelocityY(-180);
    setTimeout(()=>player.clearTint(), 400);
    if (lives <= 0) {
      this.scene.restart();
      score = 0;
      lives = 3;
    }
  }
}

// tiny bobbing for "animation"
function bob(sprite, moving) {
  if (moving) {
    sprite.y += Math.sin(Date.now()/100) * 0.4;
  }
}

function drawBricks(scene) {
  // create visible bricks using graphics to mimic NES blocks
  const g = scene.add.graphics();
  for (let x=120;x<720;x+=80) {
    const y = (x%240===0) ? 300 : 340;
    g.fillStyle(0x8B4513, 1);
    for (let bx=0;bx<4;bx++) {
      g.fillRect(x+bx*16 - 8, y - 16, 16, 16);
    }
  }
  g.setScrollFactor(1);
}
