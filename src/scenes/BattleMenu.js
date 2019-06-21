import { Scene } from 'phaser';

class BattleMenu extends Scene {
  constructor(){
    super({ key: 'BattleMenu', active: true });

    this.timer = {
      enemy_1: 0,
      player_1: 0,
      player_2: 0
    };

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
    this.createSecondMenu();

    // Listen for the finished fighting animations
    this.scene.get('BattleScene').events.on('resumeTimer', () => this.pausedTimer = false);
  }

  update() {
    if(!this.pausedTimer) {
      this.timer.enemy_1 += 2;
      this.timer.player_1 += 3;
      this.timer.player_2 += 5;
    }

    this.timerTextP1.setText('Player 1: ' + this.timer.player_1);
    this.timerTextP2.setText('Player 2: ' + this.timer.player_2);
    this.timerTextE1.setText('Enemy 1: ' + this.timer.enemy_1);

    if(this.timer.player_1 >= 1000) {this.battleParams.activeChar = 'player_1', this.pausedTimer = true;}
    if(this.timer.player_2 >= 1000) {this.battleParams.activeChar = 'player_2', this.pausedTimer = true;}
    if(this.timer.enemy_1 >= 1000) {this.enemyAttack('enemy_1'), this.pausedTimer = true;}
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

  battleOptionsClickHandler(option) {
    if(this.battleParams.activeChar) {
      switch(option) {
        case 'Attack':
          this.timer[this.battleParams.activeChar] = 0;
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
    this.timer[enemy] = 0;
    this.events.emit('Enemy_attack', { this_enemy: enemy });
  }

  createStatsMenu() {
    this.timerTextP1 = this.add.text(500, 450, 'Player 1: 0', { fill: '#fff' })
    this.timerTextP2 = this.add.text(500, 480, 'Player 2: 0', { fill: '#fff' })
    this.timerTextE1 = this.add.text(500, 510, 'Enemy 1: 0', { fill: '#fff' })
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
