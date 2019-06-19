import { Scene } from 'phaser';
import logo from '../assets/logo.png';

class PreloadScene extends Scene {
  constructor() {
    super({ key: 'preload'});
  }

  preload() {
    this.load.image('logo', logo);
  }

  create() {
    this.logo = this.add.image(400, 300, 'logo');
    this.startText = this.add.text(400, 500, 'Press space to start', {fontSize: '24px', fill: '#eee'}).setOrigin(0.5);
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if(this.cursors.space.isDown) {
      this.scene.start('game');
    }
  }
}

export default PreloadScene;