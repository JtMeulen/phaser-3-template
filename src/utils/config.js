import Phaser from 'phaser';
import BattleScene from '../scenes/BattleScene';
import BattleMenu from '../scenes/BattleMenu';

export const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  scene: [BattleScene, BattleMenu],
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 0 },
        debug: true
    }
},
};