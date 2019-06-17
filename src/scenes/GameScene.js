import { Scene } from 'phaser';

import bombImg from "../assets/bomb.png";
import starImg from "../assets/star.png";
import plaformImg from "../assets/platform.png";
import skyImg from "../assets/sky.png";
import dudeSprite from "../assets/dude.png";

class GameScene extends Scene {
  preload() {
    this.load.image("sky", skyImg);
    this.load.image("platform", plaformImg);
    this.load.image("star", starImg);
    this.load.image("bomb", bombImg);
    this.load.spritesheet("dude", dudeSprite, {
      frameWidth: 32, frameHeight: 48
    });
  }

  create() {
    const sky = this.add.image(0, 0, "sky").setOrigin(0,0);
    const platform = this.add.image(0, 350, "platform").setOrigin(0,0);
    const star = this.add.image(400, 300, "star");
  }
}

export default GameScene;
