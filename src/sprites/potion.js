export default class Potion extends Phaser.GameObjects.Sprite {
  constructor(config) 
  {
    super(config.scene, config.x, config.y,'atlas', 'potion');
    config.scene.physics.world.enable(this);
    this.scene = config.scene;
    this.number = config.number;
    this.sound = this.scene.sound.add('potionSFX');
    this.sound.setVolume(.2);
    this.scene.add.existing(this);
  }

  pickup () 
  {
    this.sound.play();
    let magic = this.scene.registry.get('magic_current'); //find out how much magic the player currently has
    if (magic < this.scene.registry.get('magic_max')){
      this.scene.registry.set('magic_current', magic + 5);  //update the player's current magic
    }
    magic = this.scene.registry.get('magic_current');
    if (magic > this.scene.registry.get('magic_max')){//check to see if current magic exceeded max magic
      this.scene.registry.set('magic_current', this.scene.registry.get('magic_max'));  //update the player's current magic
    }
    this.scene.registry.set(`${this.scene.registry.get('load')}_Potion_${this.number}`, 'picked'); //register this object as collected with game so it is not added to future intances of this level
    this.scene.events.emit('magicChange'); //tell the scene the magic count has changed so the HUD is updated
    this.destroy();
  }
  
}