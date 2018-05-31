export default class Enemy extends Phaser.GameObjects.Sprite {
  constructor(config) 
  {
    super(config.scene, config.x, config.y,'atlas', 'enemy');
    config.scene.physics.world.enable(this);
    this.scene = config.scene;
    this.scene.add.existing(this);
  }

  update(time, delta) 
  {
    
  }
  
}