import { Scene } from 'phaser';
import forest_bg from "../assets/forest_bg.jpg";
import arrow_down from "../assets/arrow_down.png";
import sword_cursor from "../assets/sword_cursor.png";
import monster from "../assets/monster.png";
import characters from "../assets/characters.png";
import player_1 from "../assets/player_1.png";
import fireball from "../assets/fireball.png";
import iceball from "../assets/iceball.png";
import lightning from "../assets/lightning.png";
import tornado from "../assets/tornado.png";

class BattleScene extends Scene {
  constructor(){
    super({ key: 'BattleScene' });

    this.activeTarget = 'enemy_1';
  }

  preload() {
    this.load.image('forest_bg', forest_bg);
    this.load.image('arrow_down', arrow_down);

    this.load.spritesheet('character',
        characters,
        { frameWidth: 48, frameHeight: 48 }
    );

    this.load.spritesheet('player_1',
    player_1,
        { frameWidth: 64, frameHeight: 64 }
    );

    this.load.spritesheet('monster',
        monster,
        { frameWidth: 199.6, frameHeight: 198 }
    );

    this.load.spritesheet('fire',
        fireball,
        { frameWidth: 64, frameHeight: 31 }
    );

    this.load.spritesheet('ice',
        iceball,
        { frameWidth: 125.9, frameHeight: 52 }
    );

    this.load.spritesheet('lightning',
        lightning,
        { frameWidth: 192, frameHeight: 192 }
    );

    this.load.spritesheet('tornado',
        tornado,
        { frameWidth: 64, frameHeight: 64 }
    );
  }

  create() {
    this.forestBG = this.add.image(0, 0, 'forest_bg').setOrigin(0, 0);

    this.player_1 = this.physics.add.sprite(600, 220, 'player_1').setInteractive({ cursor: 'url('+ sword_cursor + '), pointer' });
    this.player_1.name = 'player_1';
    this.player_2 = this.physics.add.sprite(630, 350, 'character').setInteractive({ cursor: 'url('+ sword_cursor + '), pointer' });
    this.player_2.name = 'player_2';
    this.enemy_1 = this.physics.add.sprite(130, 240, 'monster').setInteractive({ cursor: 'url('+ sword_cursor + '), pointer' });
    this.enemy_1.name = 'enemy_1';
    this.enemy_1.setFlipX(true);

    this.createAnimations();
    this.createActiveMarker(true);
    this.createBattleEventHandler();
  }

  createActiveMarker(onStart) {
    if(onStart) {
      this.arrow_down = this.physics.add.sprite(130, 141 - 15, 'arrow_down');
      this.arrow_down.setScale(0.5);
    } else {
      const getTargetSize = this[this.activeTarget].getBounds();
      this.arrow_down.setPosition(getTargetSize.centerX, getTargetSize.top - 15);
    }
  }

  spriteClickHandler(pointer, sprite) {
    this.activeTarget = sprite.name;
    this.createActiveMarker(false);
    this.events.emit('chosenTarget', {name: sprite.name});
  }

  attackAnimation(options) {
    const goToPosition = this[options.chosenEnemy].getCenter();
    const bounds = this[options.chosenEnemy].getBounds();
    const originalPosition = this[options.activeChar].getCenter();

    this.arrow_down.setPosition(-200, -200);
    this[options.activeChar].anims.play(`${options.activeChar}_walk`, true);

    this.attackTimeLine = this.tweens.createTimeline();
    this.attackTimeLine.add({
        targets: this[options.activeChar],
        x: goToPosition.x + (bounds.width / 2) + 5,
        y: goToPosition.y,
        ease: 'Cubic',
        duration: 1000,
        onComplete: () => {
          // PLAY SOUND HERE
          this[options.activeChar].anims.play(`${options.activeChar}_attack`, true);
          this[options.chosenEnemy].setTint(0xff0000)
        }
    });

    this.attackTimeLine.add({
        targets: this[options.activeChar],
        x: originalPosition.x,
        y: originalPosition.y,
        ease: 'Cubic',
        duration: 1000,
        delay: 800,
        onUpdate: () => {
          this[options.chosenEnemy].clearTint()
        },
        onComplete: () => {
          this.events.emit('resumeTimer');
          this[options.activeChar].anims.play(`${options.activeChar}_idle`, true);
          this.createActiveMarker(false);
        }
    });

    this.attackTimeLine.play();
  }

  magicAnimation(options) {
    const goToPosition = this[options.chosenEnemy].getCenter();
    const startPosition = this[options.activeChar].getCenter();
    const magicMap = {
      1: 'fire',
      2: 'lightning',
      3: 'ice',
      4: 'tornado'
    }
    const attackType = magicMap[options.chosenOption];

    this[options.activeChar].anims.play(`${options.activeChar}_casting`, true);

    // Wait for casting anim to finish
    setTimeout(() => {
      this.arrow_down.setPosition(-200, -200);
      this.magicAttack = this.physics.add.sprite(startPosition.x, startPosition.y, attackType);

      // Set options per attack
      if(options.chosenOption === 1) {
        this.magicAttack.setScale(1.5);
      } else if(options.chosenOption === 2 ) {
        this.magicAttack.setScale(0.7);
        this.magicAttack.setFlipX(true);
      } else if(options.chosenOption === 3 ) {
        this.magicAttack.setFlipX(true);
      } else if(options.chosenOption === 4 ) {
        this.magicAttack.setScale(1.5);
      };

      this.magicAttack.anims.play(attackType, true);

      this.attackTimeLine = this.tweens.createTimeline();
      this.attackTimeLine.add({
          targets: this.magicAttack,
          x: goToPosition.x,
          y: goToPosition.y,
          ease: 'Linear',
          duration: 800,
          onComplete: () => {
            // PLAY SOUND HERE
            this[options.activeChar].anims.play(`${options.activeChar}_idle`, true);
            this.magicAttack.destroy();
            this[options.chosenEnemy].setTint(0xff0000)
            setTimeout(() => {
              this[options.chosenEnemy].clearTint()
              this.events.emit('resumeTimer');
              this.createActiveMarker(false);
            }, 200)
          }
      });

      this.attackTimeLine.play();
    }, 1000);
  }

  defendAnimation(options) {
    this.arrow_down.setPosition(-200, -200);
    this.events.emit('resumeTimer');
    this.createActiveMarker(false);
  }

  itemAnimation(options) {
    this.arrow_down.setPosition(-200, -200);
    this.events.emit('resumeTimer');
    this.createActiveMarker(false);
  }

  enemyAttackAnimation(options) {
    const goToPosition = this[options.char].getCenter();
    const originalPosition = this[options.this_enemy].getCenter();
    const bounds = this[options.this_enemy].getBounds();

    this.arrow_down.setPosition(-200, -200);
    this[options.this_enemy].anims.play(`${options.this_enemy}_walk`, true);

    this.attackTimeLine = this.tweens.createTimeline();
    this.attackTimeLine.add({
        targets: this[options.this_enemy],
        x: goToPosition.x - (bounds.width / 2),
        y: goToPosition.y,
        ease: 'Cubic',
        duration: 1000,
        onComplete: () => {
          // PLAY SOUND HERE
          this[options.char].setTint(0xff0000)
          this[options.this_enemy].anims.play(`${options.this_enemy}_attack`, true);
        }
    });

    this.attackTimeLine.add({
        targets: this[options.this_enemy],
        x: originalPosition.x,
        y: originalPosition.y,
        ease: 'Cubic',
        duration: 1000,
        delay: 1000,
        onUpdate: () => {
          this[options.this_enemy].anims.play(`${options.this_enemy}_walk`, true);
          this[options.char].clearTint()
        },
        onComplete: () => {
          this.events.emit('resumeTimer');
          this[options.this_enemy].anims.play(`${options.this_enemy}_idle`, true);
          this.createActiveMarker(false);
        }
    });

    this.attackTimeLine.play();
  }

  createAnimations() {
    this.anims.create({
      key: 'player_1_walk',
      frames: this.anims.generateFrameNumbers('player_1', { start: 0, end: 8 }),
      frameRate: 15,
      repeat: -1
    });

    this.anims.create({
      key: 'player_1_attack',
      frames: this.anims.generateFrameNumbers('player_1', { start: 9, end: 16 }),
      frameRate: 12,
      repeat: 0
    });

    this.anims.create({
      key: 'player_1_casting',
      frames: this.anims.generateFrameNumbers('player_1', { start: 18, end: 24 }),
      frameRate: 10,
      repeat: 0
    });

    this.anims.create({
      key: 'player_1_idle',
      frames: this.anims.generateFrameNumbers('player_1', { start: 27, end: 35 }),
      frameRate: 15,
      repeat: -1
    });

    this.anims.create({
      key: 'player_2_attack',
      frames: this.anims.generateFrameNumbers('character', { start: 15, end: 17 }),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'player_2_idle',
      frames: this.anims.generateFrameNumbers('character', { start: 3, end: 5 }),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'player_2_cast',
      frames: this.anims.generateFrameNumbers('character', { start: 15, end: 17 }),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'player_2_walk',
      frames: this.anims.generateFrameNumbers('character', { start: 3, end: 5 }),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'enemy_1_idle',
      frames: this.anims.generateFrameNumbers('monster', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'enemy_1_walk',
      frames: this.anims.generateFrameNumbers('monster', { start: 12, end: 17 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'enemy_1_attack',
      frames: this.anims.generateFrameNumbers('monster', { start: 24, end: 29 }),
      frameRate: 10,
      repeat: 0
    });

    this.anims.create({
      key: 'fire',
      frames: this.anims.generateFrameNumbers('fire', { start: 0, end: 7 }),
      frameRate: 15,
      repeat: -1
    });

    this.anims.create({
      key: 'ice',
      frames: this.anims.generateFrameNumbers('ice', { start: 0, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'lightning',
      frames: this.anims.generateFrameNumbers('lightning', { frames: [0,1,2,3,2,1,0,1,2,3,4,5,6,7] }),
      frameRate: 13,
      repeat: -1
    });

    this.anims.create({
      key: 'tornado',
      frames: this.anims.generateFrameNumbers('tornado', { start: 0, end: 9 }),
      frameRate: 12,
      repeat: -1
    });

    this.player_1.anims.play('player_1_idle', true);
    this.player_2.anims.play('player_2_idle', true);
    this.enemy_1.anims.play('enemy_1_idle', true);
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
