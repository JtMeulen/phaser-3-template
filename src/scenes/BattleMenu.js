import { Scene } from 'phaser';

class BattleMenu extends Scene {
  constructor(){
    super({ key: 'BattleMenu', active: true });
  }

  preload() {
  }

  create() {
    this.createMenuBox();
    this.createFightMenu();

  }

  createFightMenu() {
    let yPos = 450;

    const battleOptions = [
      {key: 'Attack', clickHandler: this.attackHandler},
      {key: 'Magic', clickHandler: this.magicHandler},
      {key: 'Defend', clickHandler: this.defendHandler},
      {key: 'Items', clickHandler: this.itemHandler},
    ];

    battleOptions.forEach(option => {
      this.add.text(50, yPos, option.key, { fill: '#fff' })
      .setInteractive()
      .on('pointerdown', () => option.clickHandler(this.events));

      yPos += 30;
    });
  }

  attackHandler(events) {
    console.log('attack');
    events.emit('attack', { char: 1, enemy: 2 });
  };

  magicHandler(events) {
    console.log('magic');
    events.emit('magic', { char: 1, enemy: 2, magic: 'fire' });
  };

  defendHandler(events) {
    console.log('defend');
    events.emit('defend', { char: 1 });
  };

  itemHandler(events) {
    console.log('items');
    events.emit('items', { char: 1, enemy: 0, item: 'potion' });
  };

  createMenuBox() {
    const menuBox = this.add.graphics();
    const boxSize = [10, 430, 780, 160];

    menuBox.lineStyle(3, 0xFFFFFF);
    menuBox.fillStyle(0x1b3c72);
    menuBox.fillRect(...boxSize);
    menuBox.strokeRect(...boxSize);
  }
}

export default BattleMenu;
