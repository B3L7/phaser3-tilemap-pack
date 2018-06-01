export default class Heart extends Phaser.GameObjects.Sprite {
  constructor(config) 
  {
    super(config.scene, config.x, config.y,'atlas', 'heart');
    config.scene.physics.world.enable(this);
    this.scene = config.scene;
    this.number = config.number;
    this.sound = this.scene.sound.add('heartSFX');
    this.sound.setVolume(.2);
    this.scene.add.existing(this);
  }

  pickup () 
  {
    this.sound.play();
    let healthCurrent = this.scene.registry.get('health_current'); //find out how much health the player currently has
    let healthMax = this.scene.registry.get('health_max'); //find out how much health the player currently has
    this.scene.registry.set('health_current', healthCurrent + 1);  //update the player's current health
    this.scene.registry.set('health_max', healthMax + 1);  //update the player's max health
    healthCurrent = this.scene.registry.get('health_current'); //find out how much health the player currently has
    healthMax = this.scene.registry.get('health_max'); //find out how much health the player currently has
    if (healthCurrent > healthMax){ //make sure current health has not exceeded max health
      this.scene.registry.set('health_current', healthMax);  
    }
    this.scene.registry.set(`${this.scene.registry.get('load')}_Heart_${this.number}`, 'picked'); //register this object as collected with game so it is not added to future intances of this level
    this.scene.events.emit('healthChange'); //tell the scene the health has changed so the HUD is updated
    this.destroy();
  }
  
}