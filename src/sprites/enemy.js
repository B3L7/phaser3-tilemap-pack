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
    this.canDecide = true;
    this.moveX = 'none';
    this.moveY = 'none';
    this.deathSound = this.scene.sound.add('enemyDeathSFX');
    this.deathSound.setVolume(.2);
    this.scene.add.existing(this);
  }

  update(time, delta) 
  {
    if (this.alive) {
      if (!this.damaged) {

        //decide where to move
        if (this.canDecide) {
          this.canDecide = false;
          this.scene.time.addEvent({ delay: 500, callback: this.resetDecide, callbackScope: this });
          let decisionX = Phaser.Math.RND.integerInRange(1, 4);
          if (decisionX === 1 || decisionX === 2) {
            this.moveX = 'none';
          } else if (decisionX === 3) {
            this.moveX = 'up';
          } else if (decisionX === 4) {
            this.moveX = 'down';
          }
          let decisionY = Phaser.Math.RND.integerInRange(1, 4);
          if (decisionY === 1 || decisionY === 2) {
            this.moveY = 'none';
          } else if (decisionY === 3) {
            this.moveY = 'left';
          } else if (decisionY === 4) {
            this.moveY = 'right';
          }
        }

        
        this.movement();  //call the movement method
      }


      if (this.health <= 0) {
        this.deathSound.play();
        this.alive = false;
        this.setTint(0x2a0503);
        this.scene.time.addEvent({ delay: 500, callback: this.die, callbackScope: this });
      }
    }
  }

  movement()
  {
    if (this.moveX === 'none') {
      this.body.setVelocityX(0);
    } else if (this.moveX === 'up') {
      this.body.setVelocityX(-32);
    } else if (this.moveX === 'down') {
      this.body.setVelocityX(32);
    }

    if (this.moveY === 'none') {
      this.body.setVelocityY(0);
    } else if (this.moveY === 'left') {
      this.body.setVelocityY(-32);
    } else if (this.moveY === 'right') {
      this.body.setVelocityY(32);
    }

  }

  resetDecide() {
    this.canDecide = true;
  }

  damage(ammount) 
  {
    if (!this.damaged) {
      this.health -= ammount;
      this.damaged = true;
      this.setTint(0x8e2f15);
      this.scene.time.addEvent({ delay: 1000, callback: this.normalize, callbackScope: this });
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