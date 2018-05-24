export default class Player extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, 'player');
    config.scene.physics.world.enable(this);
    this.scene = config.scene;
    this.input = this.scene.input.keyboard.createCursorKeys();
    this.scene.add.existing(this);
  }

  update(time, delta) {
    //this.scene.physics.world.collide(this, this.scene.layer);
    //this.scene.physics.world.collide(this, this.scene.enemies);

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
    
  }


}