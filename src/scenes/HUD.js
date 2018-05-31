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
    this.magic = this.add.bitmapText(1, 18, 'minecraft', `Magic: ${this.registry.get('magic_current')} / ${this.registry.get('magic_max')}`).setScrollFactor(0);
    this.coins = this.add.bitmapText(this.cameras.main.width - 1, 1, 'minecraft', `Coins: ${this.registry.get('coins_current')}`).setScrollFactor(0);
    this.coins.setOrigin(1, 0);

    const level = this.scene.get('Level');
    level.events.on('coinChange', this.updateCoins, this);  //watch the level to see if the coin count has changed. Event emitted by coin class.
    level.events.on('healthChange', this.updateHealth, this);  //watch the level to see if the coin health has changed. Event emitted by player and meat class.
    level.events.on('magicChange', this.updateMagic, this);  //watch the level to see if the coin magic has changed. Event emitted by player and potion class.
    

  }

  updateCoins() 
  {
    this.coins.setText(`Coins: ${this.registry.get('coins_current')}`);
  }

  updateHealth() 
  {
    this.health.setText(`Health: ${this.registry.get('health_current')} / ${this.registry.get('health_max')}`);
  }

  updateMagic() 
  {
    this.magic.setText(`Magic: ${this.registry.get('magic_current')} / ${this.registry.get('magic_max')}`);
  }

}