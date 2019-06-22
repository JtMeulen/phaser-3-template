import { Scene } from 'phaser';
import forest_bg from "../assets/forest_bg.jpg";
import star from "../assets/star.png";

class BattleScene extends Scene {
  constructor(){
    super({ key: 'BattleScene' });

    this.activeTarget = 'enemy_1';
  }

  preload() {
    this.load.image('forest_bg', forest_bg);
    this.load.image('star', star);
  }

  create() {
    this.forestBG = this.add.image(0, 0, 'forest_bg').setOrigin(0, 0);

    this.player_1 = this.physics.add.sprite(600, 220, 'star').setInteractive();
    this.player_1.name = 'player_1';
    this.player_2 = this.physics.add.sprite(630, 280, 'star').setInteractive();
    this.player_2.name = 'player_2';
    this.enemy_1 = this.physics.add.sprite(130, 240, 'star').setInteractive();
    this.enemy_1.name = 'enemy_1';

    this.createActiveMarker(true);
    this.createBattleEventHandler();
  }

  createActiveMarker(onStart) {
    if(onStart) {
      this.showActive = this.add.graphics();
      this.showActive.fillStyle(0xFFFFFF);
    }
    this.showActive.clear();

    const getTargetSize = this[this.activeTarget].getBounds();
    this.showActive.fillRect(
      getTargetSize.x - 5,  // Xpos
      getTargetSize.y + getTargetSize.height + 4,  //Ypos
      getTargetSize.width + 10,  // width
      5  // height
    );
  }

  spriteClickHandler(pointer, sprite) {
    this.activeTarget = sprite.name;
    this.createActiveMarker(false);
    this.events.emit('chosenTarget', {name: sprite.name});
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
    this.events.emit('resumeTimer');
  }

  defendAnimation(options) {
    this.events.emit('resumeTimer');
  }

  itemAnimation(options) {
    this.events.emit('resumeTimer');
  }

  enemyAttackAnimation(options) {
    const goToPosition = this[options.char].getCenter();
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
          this[options.char].setTint(0xff0000)
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
          this[options.char].clearTint()
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

    this.input.on('gameobjectdown', this.spriteClickHandler, this);
  }
}

export default BattleScene;
