import { Scene } from 'phaser';
import forest_bg from "../assets/forest_bg.jpg";
import star from "../assets/star.png";

class BattleScene extends Scene {
  constructor(){
    super({ key: 'BattleScene' })
  }

  preload() {
    this.load.image('forest_bg', forest_bg);
    this.load.image('star', star);
  }

  create() {
    const forestBG = this.add.image(0, 0, 'forest_bg').setOrigin(0, 0);

    const player_1 = this.physics.add.sprite(600, 220, 'star');
    const player_2 = this.physics.add.sprite(630, 280, 'star');
    const enemy_1 = this.physics.add.sprite(130, 240, 'star');


    const battleMenu = this.scene.get('BattleMenu');

    battleMenu.events.on('attack', (options) => this.attackAnimation(options));
    battleMenu.events.on('magic', (options) => this.magicAnimation(options));
    battleMenu.events.on('defend', (options) => this.defendAnimation(options));
    battleMenu.events.on('items', (options) => this.itemAnimation(options));
  }

  attackAnimation(options) {
    console.log('attack animation');
    console.log(options)
  }
  magicAnimation(options) {
    console.log('magic animation');
    console.log(options)
  }
  defendAnimation(options) {
    console.log('defend animation');
    console.log(options)
  }
  itemAnimation(options) {
    console.log('item animation');
    console.log(options)
  }
}

export default BattleScene;
