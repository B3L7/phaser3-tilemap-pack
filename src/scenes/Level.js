import Player from '../sprites/player'
import Enemy from '../sprites/enemy'
import Coins from '../sprites/coins'

export default class Level extends Phaser.Scene {
  constructor() 
  {
    super({
      key: 'Level'
    });
  }

  create() 
  {
    //point the variable at the registry which is assigned either at the Preload scene or just prior to level restart
    let load = this.registry.get('load');

    //load music based on registry value, loop, and play
    this.music = this.sound.add(`${load}Music`);
    this.music.setLoop(true);
    this.music.play();

    //load map based on registry value, set physics bounds, and create layer
    this.map = this.make.tilemap({ key: `${load}Map` });
    this.physics.world.bounds.width = this.map.widthInPixels;
    this.physics.world.bounds.height = this.map.heightInPixels;
    this.tileset = this.map.addTilesetImage('tiles');
    this.layer = this.map.createStaticLayer('tileLayer', this.tileset, 0, 0);
    this.layer.setCollisionByProperty({ collide: true }); //make the layer collidable by the property set on the tileset in Tiled

    this.spawnpoints = [];  //create an array to hold the spawnpoints populated by converObjects()
    //set up groups, tell group to run updates on its children, then call the object conversion method
    this.pickups = this.add.group(null);
    this.enemies = this.add.group(null);
    this.enemies.runChildUpdate = true;
    this.convertObjects();

    let spawn = this.spawnpoints[this.registry.get('spawn')];

    this.crosshair = this.add.image(0, 0, 'atlas', 'crosshair');
    this.player = new Player({
        scene: this,
        x: spawn.x, 
        y: spawn.y,
      });
    this.playerAttack = this.add.group(null);
    this.playerAttack.runChildUpdate = true;

    //tell the physics system to collide player, appropriate tiles, and other objects based on group
    this.physics.add.collider(this.player, this.layer);
    this.physics.add.collider(this.player, this.enemies);
    this.physics.add.collider(this.enemies, this.layer);
    this.physics.add.collider(this.playerAttack, this.layer, this.fireballWall);
    this.physics.add.collider(this.playerAttack, this.enemies, this.fireballEnemy);

  }

  update (time, delta) 
  {
    this.player.update(time, delta);
  }

  convertObjects() 
  {
    //objects in map are checked by type(assigned in object layer in Tiled) and the appopriate extended sprite is created
    const objects = this.map.getObjectLayer('objects');
    const level = this.registry.get('load');
    let coinNum = 1;
    let enemyNum = 1;
    let regName
    objects.objects.forEach(
      (object) => {
        if (object.type === 'spawn') {
          this.spawnpoints[object.name] = {
            x: object.x + 8,
            y: object.y - 8
          }
        }
        if (object.type === 'coins') {
          regName = `${level}_Coins_${coinNum}`;
          if (this.registry.get(regName) !== 'picked') {
            let coins = new Coins({
              scene: this,
              x: object.x + 8, 
              y: object.y - 8,
              number: coinNum
              });
              this.pickups.add(coins);
              this.registry.set(regName, 'active');
            }
          coinNum += 1;
        }
        if (object.type === "enemy") {
          regName = `${level}_Enemies_${enemyNum}`;
          if (this.registry.get(regName) !== 'dead') {
            let enemy = new Enemy({
            scene: this,
            x: object.x + 8, 
            y: object.y - 8,
            number: enemyNum
            });
            this.enemies.add(enemy);
            this.registry.set(regName, 'active');
          }
          enemyNum += 1;
        }
      });
  }

  fireballWall(fireball, wall)
  {
    fireball.wallCollide();
  }

  fireballEnemy(fireball, enemy)
  {
    fireball.enemyCollide(enemy);
  }

  end()
  {
    //restart the scene. You can place additional cleanup functions in here
    this.music.stop();
    this.scene.restart();
  }

}