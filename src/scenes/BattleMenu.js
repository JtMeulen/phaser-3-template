import { Scene } from 'phaser';
import { calculateDamage } from '../utils/calculate';

class BattleMenu extends Scene {
  constructor(){
    super({ key: 'BattleMenu', active: true });

    this.timer = {
      enemy_1: 0,
      player_1: 0,
      player_2: 0
    };

    this.battleStats = {
      player_1: {
        hp: 66,
        defense: 12,
        mdef: 10,
        speed: 6,
        magic: 16,
        attack: 20,
        status: []
      },
      player_2: {
        hp: 44,
        defense: 10,
        mdef: 12,
        speed: 8,
        magic: 21,
        attack: 15,
        status: []
      },
      enemy_1: {
        hp: 90,
        defense: 14,
        mdef: 10,
        speed: 5,
        magic: 13,
        attack: 19,
        status: []
      }
    }

    this.pausedTimer = false;
    this.secondMenu = null;
    this.battleParams = {
      activeChar: null,
      chosenEnemy: 'enemy_1',
      chosenOption: null
    }
  }

  preload() {
  }

  create() {
    this.createMenuBox();
    this.createFightMenu();
    this.createStatsMenu();
    this.createTimerMenu();
    this.createSecondMenu();

    // Listen for events
    this.BattleScene = this.scene.get('BattleScene')
    this.BattleScene.events.on('resumeTimer', () => this.turnFinished());
    this.BattleScene.events.on('chosenTarget', ({name}) => this.chosenTarget(name));
  }

  update() {
    if(!this.pausedTimer) {
      this.timer.player_1 += this.battleStats.player_1.speed;
      this.timer.player_2 += this.battleStats.player_2.speed;
      this.timer.enemy_1 += this.battleStats.enemy_1.speed;
    }

    this.timerTextP1.setText('P1: ' + this.timer.player_1);
    this.timerTextP2.setText('P2: ' + this.timer.player_2);
    this.timerTextE1.setText('E1: ' + this.timer.enemy_1);

    if(this.timer.player_1 >= 1000) {this.battleParams.activeChar = 'player_1', this.pausedTimer = true;}
    if(this.timer.player_2 >= 1000) {this.battleParams.activeChar = 'player_2', this.pausedTimer = true;}
    if(this.timer.enemy_1 >= 1000) {this.enemyAttack('enemy_1'), this.pausedTimer = true;}
  }

  turnFinished() {
    this.statsTextP1.setText('P1: ' + this.battleStats.player_1.hp);
    this.statsTextP2.setText('P2: ' + this.battleStats.player_2.hp);
    this.statsTextE1.setText('E1: ' + this.battleStats.enemy_1.hp);
    console.log('CHECK FOR DEAD');
    this.pausedTimer = false;
  }

  updateDamage(type, option, randomChar = null) {
    let attacker;
    let target;
    if(type === 'player') {
      attacker = this.battleParams.activeChar;
      target = this.battleParams.chosenEnemy;
    } else {
      attacker = option;
      target = randomChar;
    }
    // calculateDamage(allStats, attacker, target, method )
    this.battleStats = {...calculateDamage(this.battleStats, attacker, target, option)};
  }

  createFightMenu() {
    let yPos = 450;
    const battleOptions = ['Attack', 'Magic', 'Defend', 'Items'];

    battleOptions.forEach(option => {
      this.add.text(50, yPos, option, { fill: '#fff' })
      .setInteractive()
      .on('pointerdown', () => this.battleOptionsClickHandler(option));

      yPos += 30;
    });
  }

  createSecondMenu() {
    this.option_1 = this.add.text(150, 450, '', { fill: '#fff' })
      .setInteractive()
      .on('pointerdown', () => this.SecondMenuClickHandler(1));;

    this.option_2 = this.add.text(150, 480, '', { fill: '#fff' })
      .setInteractive()
      .on('pointerdown', () => this.SecondMenuClickHandler(2));

    this.option_3 = this.add.text(150, 510, '', { fill: '#fff' })
      .setInteractive()
      .on('pointerdown', () => this.SecondMenuClickHandler(3));

    this.option_4 = this.add.text(150, 540, '', { fill: '#fff' })
      .setInteractive()
      .on('pointerdown', () => this.SecondMenuClickHandler(4));
  }

  chosenTarget(name) {
    this.battleParams.chosenEnemy = name;
  }

  battleOptionsClickHandler(option) {
    if(this.battleParams.activeChar) {
      switch(option) {
        case 'Attack':
          this.timer[this.battleParams.activeChar] = 0;
          this.updateDamage('player', option);
          this.events.emit(option, {...this.battleParams});
          this.clearAllOptions();
          break;
        case 'Magic':
          this.openMagicOptions();
          break;
        case 'Items':
          this.openItemOptions();
          break;
        case 'Defend':
          this.timer[this.battleParams.activeChar] = 0;
          this.events.emit(option, {...this.battleParams});
          this.clearAllOptions();
          break;
      }
    }
  }

  SecondMenuClickHandler(option) {
    this.timer[this.battleParams.activeChar] = 0;
    this.battleParams.chosenOption = option;
    this.updateDamage('player', option);
    this.events.emit(this.secondMenu, {...this.battleParams});
    this.clearAllOptions();
  }

  openMagicOptions() {
    this.secondMenu = 'Magic';
    this.option_1.setText('Fire');
    this.option_2.setText('Lightning');
    this.option_3.setText('Ice');
    this.option_4.setText('Earth');
  }

  openItemOptions() {
    this.secondMenu = 'Items';
    this.option_1.setText('Potion');
    this.option_2.setText('Ether');
    this.option_3.setText('Bomb');
    this.option_4.setText('Escape');
  }

  clearAllOptions() {
    this.battleParams.activeChar = null;
    this.battleParams.chosenOption = null;
    this.option_1.setText('');
    this.option_2.setText('');
    this.option_3.setText('');
    this.option_4.setText('');
  }

  enemyAttack(enemy) {
    const characters = ['player_1', 'player_2'];
    const randomChar = characters[Math.floor(Math.random() * characters.length)];

    this.timer[enemy] = 0;
    this.updateDamage('enemy', enemy, randomChar);
    this.events.emit('Enemy_attack', { this_enemy: enemy, char: randomChar });
  }

  createStatsMenu() {
    this.statsTextP1 = this.add.text(420, 450, 'P1: ' + this.battleStats.player_1.hp, { fill: '#fff' })
    this.statsTextP2 = this.add.text(420, 480, 'P1: ' + this.battleStats.player_2.hp, { fill: '#fff' })
    this.statsTextE1 = this.add.text(420, 510, 'P1: ' + this.battleStats.enemy_1.hp, { fill: '#fff' })
  }

  createTimerMenu() {
    this.timerTextP1 = this.add.text(500, 450, 'P1: 0', { fill: '#fff' })
    this.timerTextP2 = this.add.text(500, 480, 'P2: 0', { fill: '#fff' })
    this.timerTextE1 = this.add.text(500, 510, 'E1: 0', { fill: '#fff' })
  }

  createMenuBox() {
    const boxSize = [10, 430, 780, 160];
    this.menuBox = this.add.graphics();

    this.menuBox.lineStyle(3, 0xFFFFFF);
    this.menuBox.fillStyle(0x1b3c72);
    this.menuBox.fillRect(...boxSize);
    this.menuBox.strokeRect(...boxSize);
  }
}

export default BattleMenu;
