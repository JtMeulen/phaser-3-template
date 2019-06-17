import Phaser from 'phaser';
import GameScene from '../scenes/GameScene';

export const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  scene: GameScene
};