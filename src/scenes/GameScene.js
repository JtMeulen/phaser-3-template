import { Scene } from 'phaser';

import bombImg from "../assets/bomb.png";
import starImg from "../assets/star.png";
import plaformImg from "../assets/platform.png";
import skyImg from "../assets/sky.png";
import dudeSprite from "../assets/dude.png";

class GameScene extends Scene {
  constructor() {
    super();

    this.score = 0;
    this.gameOver = false;
  }

  preload() {
    this.load.image("sky", skyImg);
    this.load.image("ground", plaformImg);
    this.load.image("star", starImg);
    this.load.image("bomb", bombImg);
    this.load.spritesheet("dude", dudeSprite, {
      frameWidth: 32, frameHeight: 48
    });
  }

  create() {
    const sky = this.add.image(0, 0, "sky").setOrigin(0,0);

    this.createPlatforms();
    this.createPlayer();
    this.createStars();
    this.createBombs();
    this.createAnimations();
    this.createCursors();

    this.scoreText = this.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#000'})
  }

  update() {
    if (this.cursors.left.isDown && !this.cursors.right.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown && !this.cursors.left.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }

    if(this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }

  createPlatforms() {
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');
  }

  createPlayer() {
    this.player = this.physics.add.sprite(320, 100, 'dude');
    this.player.setBounce(0.1);

    this.physics.add.collider(this.player, this.platforms);
    this.player.setCollideWorldBounds(true);
  }

  createStars() {
    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: {x: 12, y: -50, stepX: 70}
    });

    this.stars.children.iterate(star => {
      star.setBounce(Phaser.Math.FloatBetween(0.4, 0.8))
    });

    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
  }

  collectStar(player, star) {
    star.disableBody(true, true);

    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);

    if(this.stars.countActive(true) === 0) {
      this.resetStars();
    }
  }

  resetStars() {
    this.stars.children.iterate(star => {
      star.enableBody(true, star.x, 0, true, true);
    });

    const startX = this.player.body.x < 400 ? Phaser.Math.Between(0, 400) : Phaser.Math.Between(400, 800);
    const bomb = this.bombs.create(startX, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds();
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 30);
  }

  createBombs() {
    this.bombs = this.physics.add.group();
    this.physics.add.collider(this.bombs, this.platforms);
    this.physics.add.collider(this.player, this.bombs, this.bombHit, null, this);
  }

  bombHit(player, bomb) {
    this.physics.pause();
    this.player.setTint(0XFF0000);
    this.player.anims.play('turn');
    this.gameOver = true;
  }

  createAnimations() {
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', {
        start: 0, end: 3
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [{key: 'dude', frame: 4}],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', {
        start: 5, end: 8
      }),
      frameRate: 10,
      repeat: -1
    });
  }

  createCursors() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

}

export default GameScene;
