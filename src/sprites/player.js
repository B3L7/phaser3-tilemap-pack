export default class Player extends Phaser.GameObjects.Sprite {
  constructor(config) 
  {
    super(config.scene, config.x, config.y, 'player');
    config.scene.physics.world.enable(this);
    this.scene = config.scene;
    this.input = this.scene.input.keyboard.createCursorKeys();
    this.canLoad = true;
    this.scene.add.existing(this);
  }

  update(time, delta) 
  {

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


    //check if outside bounds, if out of bounds set load registry to appropriate value from map then tell the Level to reload
    if (this.canLoad) 
    {
      if (this.x > this.scene.physics.world.bounds.width) {
        this.scene.registry.set('load', this.scene.map.properties.loadRight);
        this.canLoad = false;
        this.scene.end();
      } else if (this.x < 0) {
        this.scene.registry.set('load', this.scene.map.properties.loadLeft);
        this.canLoad = false;
        this.scene.end();
      } else if (this.y > this.scene.physics.world.bounds.height) {
        this.scene.registry.set('load', this.scene.map.properties.loadDown);
        this.canLoad = false;
        this.scene.end();
      } else if (this.y < 0) {
        this.scene.registry.set('load', this.scene.map.properties.loadUp);
        this.canLoad = false;
        this.scene.end();
      }
    }
  }

}