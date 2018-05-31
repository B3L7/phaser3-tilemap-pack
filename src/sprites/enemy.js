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
    this.playerDetected = false;
    this.detectionDistance = 64;
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
      this.playerDetected = this.detectPlayer();
      if (!this.damaged) {
        if (this.playerDetected) {
          if (this.x > this.scene.player.x) {
            this.moveX = 'left';
          } else if (this.x < this.scene.player.x) {
            this.moveX = 'right';
          } else {
            this.moveX = 'none';
          }
          if (this.y > this.scene.player.y) {
            this.moveY = 'up';
          } else if (this.y < this.scene.player.y) {
            this.moveY = 'down';
          } else {
            this.moveY = 'none';
          }
        } else {
          //decide where to move
          if (this.canDecide) {
            this.canDecide = false;
            this.scene.time.addEvent({ delay: 500, callback: this.resetDecide, callbackScope: this });
            let decisionX = Phaser.Math.RND.integerInRange(1, 4);
            if (decisionX === 1 || decisionX === 2) {
              this.moveX = 'none';
            } else if (decisionX === 3) {
              this.moveX = 'left';
            } else if (decisionX === 4) {
              this.moveX = 'right';
            }
            let decisionY = Phaser.Math.RND.integerInRange(1, 4);
            if (decisionY === 1 || decisionY === 2) {
              this.moveY = 'none';
            } else if (decisionY === 3) {
              this.moveY = 'up';
            } else if (decisionY === 4) {
              this.moveY = 'down';
            }
          }
        }
        this.movement();
      }


      if (this.health <= 0) {
        this.deathSound.play();
        this.alive = false;
        this.setTint(0x2a0503);
        this.scene.time.addEvent({ delay: 500, callback: this.die, callbackScope: this });
      }
    }
  }

  detectPlayer() {
    const distanceToPlayerX = Math.abs(this.x - this.scene.player.x);
    const distanceToPlayerY = Math.abs(this.y - this.scene.player.y);
    return (distanceToPlayerY <= this.detectionDistance) &&  (distanceToPlayerX <= this.detectionDistance) && this.scene.player.alive && !this.scene.player.damaged;
  }

  movement()
  {
    let speed;
    if (this.playerDetected) {
      speed = 32;
    } else {
      speed = 16;
    }
    if (this.moveX === 'none') {
      this.body.setVelocityX(0);
    } else if (this.moveX === 'left') {
      this.body.setVelocityX(-speed);
    } else if (this.moveX === 'right') {
      this.body.setVelocityX(speed);
    }

    if (this.moveY === 'none') {
      this.body.setVelocityY(0);
    } else if (this.moveY === 'up') {
      this.body.setVelocityY(-speed);
    } else if (this.moveY === 'down') {
      this.body.setVelocityY(speed);
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