import Player from '../sprites/player';
import Enemy from '../sprites/enemy';
import Coins from '../sprites/coins';
import Meat from '../sprites/meat';
import Potion from '../sprites/potion';

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
    this.enemies = this.add.group(null);
    this.enemies.runChildUpdate = true;
    this.pickups = this.add.group(null);
    this.convertObjects();

    let spawn = this.spawnpoints[this.registry.get('spawn')]; //assign spawn variable that points to the currently loaded spawnpoint

    this.crosshair = this.add.image(0, 0, 'atlas', 'crosshair');  //create crosshair which is controlled by player class
    //create a new instance of the player class at the currently loaded spawnpoint
    this.player = new Player({
        scene: this,
        x: spawn.x, 
        y: spawn.y,
      });
    this.playerAttack = this.add.group(null); //create attack group to hold player's fireballs
    this.playerAttack.runChildUpdate = true;

    //tell the physics system to collide player, appropriate tiles, and other objects based on group, run callbacks when appropriate
    this.physics.add.collider(this.player, this.layer);
    this.physics.add.collider(this.player, this.enemies, this.playerEnemy);
    this.physics.add.collider(this.enemies, this.layer);
    this.physics.add.collider(this.enemies, this.enemies);
    this.physics.add.collider(this.playerAttack, this.layer, this.fireballWall);  //collide callback for fireball hitting wall
    this.physics.add.collider(this.playerAttack, this.enemies, this.fireballEnemy); //collide callback for fireball hitting enemy

  }

  update (time, delta) 
  {
    this.player.update(time, delta);  //the player class update method must be called each cycle as the class is not currently part of a group
  }

  convertObjects() 
  {
    //objects in map are checked by type(assigned in object layer in Tiled) and the appopriate extended sprite is created
    const objects = this.map.getObjectLayer('objects'); //find the object layer in the tilemap named 'objects'
    const level = this.registry.get('load');
    let coinNum = 1;  //initialize our coin numbering used to check if the coin has been picked up
    let meatNum = 1;  //initialize our meat numbering used to check if the meat has been picked up
    let potNum = 1;  //initialize our potion numbering used to check if the meat has been picked up
    let enemyNum = 1; //initialize our enemy numbering used to check if the enemy has been killed
    let regName
    objects.objects.forEach(
      (object) => {
        //create a series of points in our spawnpoints array
        if (object.type === 'spawn') {
          this.spawnpoints[object.name] = {
            x: object.x + 8,
            y: object.y - 8
          }
        }
        if (object.type === 'coins') {
          //check the registry to see if the coin has already been picked. If not create the coin in the level and register it with the game
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
        if (object.type === 'meat') {
          //check the registry to see if the meat has already been picked. If not create the meat in the level and register it with the game
          regName = `${level}_Meat_${meatNum}`;
          if (this.registry.get(regName) !== 'picked') {
            let meat = new Meat({
              scene: this,
              x: object.x + 8, 
              y: object.y - 8,
              number: meatNum
              });
              this.pickups.add(meat);
              this.registry.set(regName, 'active');
            }
          coinNum += 1;
        }
        if (object.type === 'potion') {
          //check the registry to see if the potion has already been picked. If not create the potion in the level and register it with the game
          regName = `${level}_Potion_${potNum}`;
          if (this.registry.get(regName) !== 'picked') {
            let potion = new Potion({
              scene: this,
              x: object.x + 8, 
              y: object.y - 8,
              number: potNum
              });
              this.pickups.add(potion);
              this.registry.set(regName, 'active');
            }
          coinNum += 1;
        }
        if (object.type === "enemy") {
          //check the registry to see if the enemy has already been killed. If not create the enemy in the level and register it with the game
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

  playerEnemy(player, enemy){
    player.damage(enemy.attack);
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