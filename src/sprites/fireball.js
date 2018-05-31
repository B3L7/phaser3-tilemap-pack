export default class Fireball extends Phaser.GameObjects.Sprite {
  constructor(config) 
  {
    super(config.scene, config.x, config.y,'atlas', 'fireball');
    config.scene.physics.world.enable(this);
    this.scene = config.scene;
    this.damage = 1;
    this.sound = this.scene.sound.add('fireballSFX');
    this.sound.setVolume(.2);
    this.sound.play();
    this.wallSound = this.scene.sound.add('fireballWallSFX');
    this.wallSound.setVolume(.1);
    this.enemySound = this.scene.sound.add('fireballEnemySFX');
    this.enemySound.setVolume(.1);
    this.scene.add.existing(this);
    this.scene.physics.moveTo(this, this.scene.crosshair.x, this.scene.crosshair.y);
  }

  update(time, delta) 
  {
    
  }

  wallCollide () 
  {
    this.wallSound.play();
    this.destroy();
  }

  enemyCollide (enemy) 
  {
    this.enemySound.play();
    enemy.damage(this.damage);
    this.destroy();
  }
  
}