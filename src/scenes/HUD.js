export default class HUD extends Phaser.Scene {
  constructor() 
  {
    super({
      key: 'HUD'
    });
  }

  create() 
  {
    this.health = this.add.bitmapText(1, 1, 'minecraft', `Health: ${this.registry.get('health_current')} / ${this.registry.get('health_max')}`).setScrollFactor(0);
    this.coins = this.add.bitmapText(this.cameras.main.width - 1, 1, 'minecraft', `Coins: ${this.registry.get('coins_current')}`).setScrollFactor(0);
    this.coins.setOrigin(1, 0);

    const level = this.scene.get('Level');
    level.events.on('coinChange', this.updateCoins, this);
    

  }

  updateCoins() {
    this.coins.setText(`Coins: ${this.registry.get('coins_current')}`);
  }

}