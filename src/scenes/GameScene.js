import { Scene } from 'phaser';

import bombImg from "../assets/bomb.png";
import starImg from "../assets/star.png";
import plaformImg from "../assets/platform.png";
import skyImg from "../assets/sky.png";
import dudeSprite from "../assets/dude.png";

class GameScene extends Scene {
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
    this.createAnimations();
    this.createCursors();
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
    this.player = this.physics.add.sprite(350, 100, 'dude');
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

    this.stars.children.iterate(child => {
      child.setBounce(Phaser.Math.FloatBetween(0.4, 0.8))
    });

    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
  }

  collectStar(player, star) {
    star.disableBody(true, true);
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
