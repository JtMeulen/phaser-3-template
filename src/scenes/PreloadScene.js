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
    this.cursors = this.input.on('pointerdown', () => {
      this.scene.start('game');
    })
  }
}

export default PreloadScene;