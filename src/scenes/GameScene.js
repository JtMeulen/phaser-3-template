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
    const star = this.add.image(400, 300, "star");

    this.createPlatforms();
  }

  createPlatforms() {
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    this.platforms.create(150, 360, 'ground');
    this.platforms.create(700, 220, 'ground');
    this.platforms.create(180, 70, 'ground');
  }
}

export default GameScene;
