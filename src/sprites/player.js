import Fireball from './fireball';

export default class Player extends Phaser.GameObjects.Sprite {
  constructor(config) 
  {
    super(config.scene, config.x, config.y, 'atlas', 'player');
    config.scene.physics.world.enable(this);
    this.scene = config.scene;
    this.body.setDrag(8, 8);
    this.body.setBounce(.5, .5);
    this.alive = true;
    this.damaged = false;
    this.input = this.scene.input.keyboard.createCursorKeys();
    this.canLoad = true;  //property controls whether the level can restart so that it can only be called once

    this.noMagicSound = this.scene.sound.add('outOfMagicSFX');
    this.noMagicSound.setVolume(.4);

    this.hurtSound = this.scene.sound.add('playerDamageSFX');
    this.hurtSound.setVolume(.4);

    this.deathSound = this.scene.sound.add('playerDeathSFX');
    this.deathSound.setVolume(.4);

    //sync crosshair position with pointer
    this.scene.input.on('pointermove', function (pointer) {
      //this.scene.crosshair.x = pointer.x;
      //this.scene.crosshair.y = pointer.y;
      let mouse = pointer
      this.scene.crosshair.setPosition(mouse.x + this.scene.cameras.main.scrollX, mouse.y + this.scene.cameras.main.scrollY);
    }, this);
  
    //create a new instance of fireball class when pointer is clicked and add it to player attack group for collision callbacks
    this.scene.input.on('pointerdown', function (pointer) {
      let magic = this.scene.registry.get('magic_current');
      if (magic > 0) {
        let fireball = new Fireball({
          scene: this.scene,
          x: this.x, 
          y: this.y,
        });
        this.scene.playerAttack.add(fireball);
        this.scene.registry.set('magic_current', magic - 1);
        this.scene.events.emit('magicChange'); //tell the scene the magic has changed so the HUD is updated
      } else {
        this.noMagicSound.play();
      }
    }, this);


    this.scene.add.existing(this);
  }

  update(time, delta) 
  {
    if (this.alive) {
      let healthCurrent = this.scene.registry.get('health_current');
      if (healthCurrent <= 0) {
        this.alive = false;
        this.setTint(0x2a0503);
        this.deathSound.play();
        this.scene.time.addEvent({ delay: 1000, callback: this.gameOver, callbackScope: this });
      }

      this.scene.physics.overlap( this, this.scene.pickups, this.pickup); //call pickup method when player overlaps pickup objects

      //movement
      if (!this.damaged) {
        this.body.setVelocity(0);
      }

      if (this.input.left.isDown)
      {
          this.body.setVelocityX(-64);
      }
      else if (this.input.right.isDown)
      {
          this.body.setVelocityX(64);
      }

      if (this.input.up.isDown)
      {
          this.body.setVelocityY(-64);
      }
      else if (this.input.down.isDown)
      {
          this.body.setVelocityY(64);
      }


      //check if outside bounds, if out of bounds set load and spawn registry to appropriate value from map then tell the Level to reload
      if (this.canLoad) 
      {
        if (this.x > this.scene.physics.world.bounds.width) {
          this.scene.registry.set('load', this.scene.map.properties.loadRight);
          this.scene.registry.set('spawn', this.scene.map.properties.spawnRight);
          this.canLoad = false;
          this.scene.end('restart');
        } else if (this.x < 0) {
          this.scene.registry.set('load', this.scene.map.properties.loadLeft);
          this.scene.registry.set('spawn', this.scene.map.properties.spawnLeft);
          this.canLoad = false;
          this.scene.end('restart');
        } else if (this.y > this.scene.physics.world.bounds.height) {
          this.scene.registry.set('load', this.scene.map.properties.loadDown);
          this.scene.registry.set('spawn', this.scene.map.properties.spawnDown);
          this.canLoad = false;
          this.scene.end('restart');
        } else if (this.y < 0) {
          this.scene.registry.set('load', this.scene.map.properties.loadUp);
          this.scene.registry.set('spawn', this.scene.map.properties.spawnUp);
          this.canLoad = false;
          this.scene.end('restart');
        }
      }
    }
  }

  pickup(player, object) 
  {
    object.pickup();  //call the pickup objects method
  }

  damage(ammount) 
  {
    if (!this.damaged && this.alive) {
      this.hurtSound.play();
      this.scene.cameras.main.shake(32);
      this.damaged = true;
      let health = this.scene.registry.get('health_current'); //find out the player's current health
      this.scene.registry.set('health_current', health - ammount);  //update the player's current health
      this.scene.events.emit('healthChange'); //tell the scene the health has changed so the HUD is updated
      this.setTint(0x8e2f15);
      this.scene.time.addEvent({ delay: 1000, callback: this.normalize, callbackScope: this });
    }
  }

  gameOver()
  {
    this.scene.end('gameOver');
  }

  normalize() 
  {
    if (this.alive) {
      this.damaged = false;
      this.setTint(0xffffff);
    }
  }

}