import Phaser from 'phaser';
import GameScene from '../scenes/GameScene';
import PreloadScene from '../scenes/PreloadScene';

export const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  scene: [PreloadScene, GameScene],
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 300 },
        debug: true
    }
  }
};