export default class Coins extends Phaser.GameObjects.Sprite {
  constructor(config) 
  {
    super(config.scene, config.x, config.y,'atlas', 'coins');
    config.scene.physics.world.enable(this);
    this.scene = config.scene;
    this.number = config.number;
    this.sound = this.scene.sound.add('coinSFX');
    this.sound.setVolume(.4);
    this.scene.add.existing(this);
  }

  pickup () 
  {
    this.sound.play();
    let coins = this.scene.registry.get('coins_current'); //find out how many coins the player currently has
    this.scene.registry.set('coins_current', coins + 1);  //update the player's coin total
    this.scene.registry.set(`${this.scene.registry.get('load')}_Coins_${this.number}`, 'picked'); //register this object as collected with game so it is not added to future intances of this level
    this.scene.events.emit('coinChange'); //tell the scene the coint count has changed so the HUD is updated
    this.destroy();
  }
  
}