export default class Enemy extends Phaser.GameObjects.Sprite {
  constructor(config) 
  {
    super(config.scene, config.x, config.y,'atlas', 'enemy');
    config.scene.physics.world.enable(this);
    this.scene = config.scene;
    this.number = config.number;
    this.body.setDrag(8, 8);
    this.health = 4;
    this.alive = true;
    this.damaged = false;
    this.deathSound = this.scene.sound.add('enemyDeathSFX');
    this.deathSound.setVolume(.2);
    this.scene.add.existing(this);
  }

  update(time, delta) 
  {
    if (this.alive) {
      if (this.health <= 0) {
        this.deathSound.play();
        this.alive = false;
        this.setTint(0x2a0503);
        this.scene.time.addEvent({ delay: 500, callback: this.die, callbackScope: this });
      }
    }
  }

  damage(ammount) 
  {
    if (!this.damaged) {
      this.health -= ammount;
      this.damaged = true;
      this.setTint(0x8e2f15);
      this.scene.time.addEvent({ delay: 500, callback: this.normalize, callbackScope: this });
    }
  }

  normalize() 
  {
    this.damaged = false;
    this.setTint(0xffffff);
  }

  die()
  {
    this.scene.registry.set(`${this.scene.registry.get('load')}_Enemies_${this.number}`, 'dead'); //register this enemy as dead so it is not added to future instances of this level.
    this.destroy();
  }
  
}