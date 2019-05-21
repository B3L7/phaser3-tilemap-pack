export default class DarkFireball extends Phaser.GameObjects.Sprite {
  constructor(scene) 
  {
    super(scene, 0, 0,'atlas', 'darkFireball');
    scene.physics.world.enable(this);
    this.damage = 1;
    this.sound = this.scene.sound.add('fireballSFX');
    this.sound.setVolume(.2);
    this.sound.play();
    this.wallSound = this.scene.sound.add('fireballWallSFX');
    this.wallSound.setVolume(.2);
    this.playerSound = this.scene.sound.add('fireballEnemySFX');
    this.playerSound.setVolume(.2);
    this.scene.add.existing(this);
    this.particles = this.scene.add.particles('atlas', 'darkParticle');
    this.emitter = this.particles.createEmitter();
    this.emitter.setPosition(this.x, this.y);
    this.emitter.setSpeed(16);
  }

  fire (x, y)
  {
    this.setPosition(x, y);
    this.scene.physics.moveTo(this, this.scene.player.x, this.scene.player.y);
    this.emitter.flow(0)
    this.setActive(true);
    this.setVisible(true);
  }

  update(time, delta) 
  {
    this.emitter.setPosition(this.x, this.y);
  }

  wallCollide () 
  {
    this.emitter.explode( 64, this.x, this.y );
    this.wallSound.play();
    this.setActive(false);
    this.setVisible(false);
  }

  fireballCollide () 
  {
    this.emitter.explode( 64, this.x, this.y );
    this.wallSound.play();
    this.setActive(false);
    this.setVisible(false);
  }

  playerCollide (player) 
  {
    this.emitter.explode( 32, this.x, this.y );
    this.playerSound.play();
    player.damage(this.damage);
    this.setActive(false);
    this.setVisible(false);
  }
  
}