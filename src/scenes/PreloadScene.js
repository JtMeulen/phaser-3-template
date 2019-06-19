import { Scene } from 'phaser';
import { preload_particle } from '../utils/particle';
import logo from '../assets/logo.png';
import particle from '../assets/bomb.png';

class PreloadScene extends Scene {
  constructor() {
    super({ key: 'preload'});
  }

  preload() {
    this.load.image('logo', logo);
    this.load.image('particle', particle);
  }

  create() {
    this.createParticles();

    this.logo = this.add.image(400, 300, 'logo');
    this.startText = this.add.text(400, 500, 'Press space to start', {fontSize: '24px', fill: '#eee'}).setOrigin(0.5);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  createParticles() {
    this.particles = this.add.particles('particle');
    this.emitter = this.particles.createEmitter(preload_particle);
  }

  update() {
    if(this.cursors.space.isDown) {
      this.scene.start('game');
    }
  }
}

export default PreloadScene;