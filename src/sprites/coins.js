export default class Coins extends Phaser.GameObjects.Sprite {
  constructor(config) 
  {
    super(config.scene, config.x, config.y,'atlas', 'coins');
    config.scene.physics.world.enable(this);
    this.scene = config.scene;
    this.number = config.number;
    this.sound = this.scene.sound.add('coinSFX');
    this.sound.setVolume(.5);
    this.scene.add.existing(this);
  }

  pickup () 
  {
    this.sound.play();
    let coins = this.scene.registry.get('coins_current');
    this.scene.registry.set('coins_current', coins + 1);
    this.scene.registry.set(`${this.scene.registry.get('load')}_Coins_${this.number}`, 'picked');
    this.scene.events.emit('coinChange');
    this.destroy();
  }
  
}