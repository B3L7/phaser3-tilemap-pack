import Fireball from './fireball'

export default class Player extends Phaser.GameObjects.Sprite {
  constructor(config) 
  {
    super(config.scene, config.x, config.y, 'atlas', 'player');
    config.scene.physics.world.enable(this);
    this.scene = config.scene;
    this.body.setDrag(8, 8);
    this.input = this.scene.input.keyboard.createCursorKeys();
    this.canLoad = true;
    this.scene.input.on('pointermove', function (pointer) {
      this.scene.crosshair.x = pointer.x;
      this.scene.crosshair.y = pointer.y;
    }, this);
  
    this.scene.input.on('pointerdown', function (pointer) {
      let fireball = new Fireball({
        scene: this.scene,
        x: this.x, 
        y: this.y,
      });
      this.scene.playerAttack.add(fireball);
    }, this);
    this.scene.add.existing(this);
  }

  update(time, delta) 
  {
    this.scene.physics.overlap( this, this.scene.pickups, this.pickup);

    //movement
    this.body.setVelocity(0);

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
        this.scene.end();
      } else if (this.x < 0) {
        this.scene.registry.set('load', this.scene.map.properties.loadLeft);
        this.scene.registry.set('spawn', this.scene.map.properties.spawnLeft);
        this.canLoad = false;
        this.scene.end();
      } else if (this.y > this.scene.physics.world.bounds.height) {
        this.scene.registry.set('load', this.scene.map.properties.loadDown);
        this.scene.registry.set('spawn', this.scene.map.properties.spawnDown);
        this.canLoad = false;
        this.scene.end();
      } else if (this.y < 0) {
        this.scene.registry.set('load', this.scene.map.properties.loadUp);
        this.scene.registry.set('spawn', this.scene.map.properties.spawnUp);
        this.canLoad = false;
        this.scene.end();
      }
    }
  }

  pickup(player, object) {
    object.pickup();
  }

}