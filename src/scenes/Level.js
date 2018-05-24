import Player from '../sprites/player'
import Enemy from '../sprites/enemy'

export default class Level extends Phaser.Scene {
  constructor() {
    super({
      key: 'Level'
    });
  }

  init(data) {
    this.global = data; //global object is made accessible to objects within the scene through this.scene.data
  }

  preload(){
  }
      
  create() {
    this.map = this.make.tilemap({ key: this.global.load });
    this.physics.world.bounds.width = this.map.widthInPixels;
    this.physics.world.bounds.height = this.map.heightInPixels;
    let tileset = this.map.addTilesetImage('tiles');
    this.layer = this.map.createStaticLayer('tileLayer', tileset, 0, 0);
    this.layer.setCollisionByProperty({ collide: true });

    this.enemies = this.add.group(null);
    this.enemies.runChildUpdate = true;
    this.convertObjects();
    this.physics.add.collider(this.player, this.layer);
    this.physics.add.collider(this.player, this.enemies);
    this.physics.add.collider(this.enemies, this.layer);
  }

  update (time, delta) {
    this.player.update(time, delta);
  }

  convertObjects() {
    let objects = this.map.getObjectLayer("objects");
    objects.objects.forEach(
      (object) => {
        if (object.type === "player") {
          this.player = new Player({
          scene: this,
          x: object.x + 8, 
          y: object.y - 8,
          });
        }
        if (object.type === "enemy") {
          let enemy = new Enemy({
          scene: this,
          x: object.x + 8, 
          y: object.y - 8,
          });
          this.enemies.add(enemy);
        }
      });
  }

  end(){
    this.scene.restart(this.global);
  }

}