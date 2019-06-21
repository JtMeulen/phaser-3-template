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
    this.forestBG = this.add.image(0, 0, 'forest_bg').setOrigin(0, 0);

    this.player_1 = this.physics.add.sprite(600, 220, 'star');
    this.player_2 = this.physics.add.sprite(630, 280, 'star');
    this.enemy_1 = this.physics.add.sprite(130, 240, 'star');

    this.createBattleEventHandler();
  }

  attackAnimation(options) {
    const goToPosition = this[options.chosenEnemy].getCenter();
    const originalPosition = this[options.activeChar].getCenter();

    this.attackTimeLine = this.tweens.createTimeline();
    this.attackTimeLine.add({
        targets: this[options.activeChar],
        x: goToPosition.x + 50,
        y: goToPosition.y,
        ease: 'Cubic',
        duration: 300,
        onComplete: () => {
          // PLAY SOUND HERE
          this[options.chosenEnemy].setTint(0xff0000)
        }
    });

    this.attackTimeLine.add({
        targets: this[options.activeChar],
        x: originalPosition.x,
        y: originalPosition.y,
        ease: 'Cubic',
        duration: 400,
        delay: 300,
        onUpdate: () => {
          this[options.chosenEnemy].clearTint()
        },
        onComplete: () => {
          this.events.emit('resumeTimer');
        }
    });

    this.attackTimeLine.play();
  }

  magicAnimation(options) {
    console.log('Magic', options.chosenOption)
    this.events.emit('resumeTimer');
  }

  defendAnimation(options) {
    console.log('defend animation');
    this.events.emit('resumeTimer');
  }

  itemAnimation(options) {
    console.log('Item', options.chosenOption)
    this.events.emit('resumeTimer');
  }

  enemyAttackAnimation(options) {
    const characters = ['player_1', 'player_2'];
    const randomChar = characters[Math.floor(Math.random() * characters.length)];

    const goToPosition = this[randomChar].getCenter();
    const originalPosition = this[options.this_enemy].getCenter();

    this.attackTimeLine = this.tweens.createTimeline();
    this.attackTimeLine.add({
        targets: this[options.this_enemy],
        x: goToPosition.x - 50,
        y: goToPosition.y,
        ease: 'Cubic',
        duration: 300,
        onComplete: () => {
          // PLAY SOUND HERE
          this[randomChar].setTint(0xff0000)
        }
    });

    this.attackTimeLine.add({
        targets: this[options.this_enemy],
        x: originalPosition.x,
        y: originalPosition.y,
        ease: 'Cubic',
        duration: 400,
        delay: 300,
        onUpdate: () => {
          this[randomChar].clearTint()
        },
        onComplete: () => {
          this.events.emit('resumeTimer');
        }
    });

    this.attackTimeLine.play();
  }

  createBattleEventHandler() {
    this.battleMenu = this.scene.get('BattleMenu');

    this.battleMenu.events.on('Attack', (options) => this.attackAnimation(options));
    this.battleMenu.events.on('Magic', (options) => this.magicAnimation(options));
    this.battleMenu.events.on('Defend', (options) => this.defendAnimation(options));
    this.battleMenu.events.on('Items', (options) => this.itemAnimation(options));
    this.battleMenu.events.on('Enemy_attack', (options) => this.enemyAttackAnimation(options));
  }
}

export default BattleScene;
