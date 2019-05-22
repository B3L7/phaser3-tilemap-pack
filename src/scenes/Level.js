import Player from '../sprites/player';
import Fireball from '../sprites/fireball';
import Enemy from '../sprites/enemy';
import Demon from '../sprites/demon';
import DarkFireball from '../sprites/darkFireball';
import Slime from '../sprites/slime';
import Coins from '../sprites/coins';
import Meat from '../sprites/meat';
import Potion from '../sprites/potion';
import Jug from '../sprites/jug';
import Heart from '../sprites/heart';

export default class Level extends Phaser.Scene {
  constructor() 
  {
    super({
      key: 'Level'
    });
  }

  create() 
  {
    this.cameras.main.setBackgroundColor(0x2a0503);
    //point the variable at the registry which is assigned either at the Preload scene or just prior to level restart
    let load = this.registry.get('load');

    //load music based on registry value, loop, and play
    this.music = this.sound.add(`${load}Music`);
    this.music.setLoop(true);
    this.music.play();

    this.fanfare = this.sound.add('fanfareSFX');
    this.fanfare.setVolume(.5);

    //load map based on registry value, set physics bounds, and create layer
    this.map = this.make.tilemap({ key: `${load}Map` });
    this.physics.world.bounds.width = this.map.widthInPixels;
    this.physics.world.bounds.height = this.map.heightInPixels;
    this.tileset = this.map.addTilesetImage('tiles');
    this.layer = this.map.createStaticLayer('tileLayer', this.tileset, 0, 0);
    this.layer.setCollisionByProperty({ collide: true }); //make the layer collidable by the property set on the tileset in Tiled

    this.spawnpoints = [];  //create an array to hold the spawnpoints populated by converObjects()
    //set up groups, tell group to run updates on its children, then call the object conversion method
    this.enemies = this.add.group();
    this.enemies.runChildUpdate = true;
    this.enemyAttack = this.add.group({
     classType: DarkFireball,
     maxSize: 50,
     runChildUpdate: true 
   });
    this.pickups = this.add.group();
    this.convertObjects();

    let spawn = this.spawnpoints[this.registry.get('spawn')]; //assign spawn variable that points to the currently loaded spawnpoint

    this.crosshair = this.add.image(0, 0, 'atlas', 'crosshair');  //create crosshair which is controlled by player class
    //create a new instance of the player class at the currently loaded spawnpoint
    this.player = new Player({
      scene: this,
      x: spawn.x, 
      y: spawn.y,
    });
    this.cameras.main.startFollow(this.player);
    this.playerAttack = this.add.group({
      classType: Fireball,
      maxSize: 100,
      runChildUpdate: true 
    }); //create attack group to hold player's fireballs

    //tell the physics system to collide player, appropriate tiles, and other objects based on group, run callbacks when appropriate
    this.physics.add.collider(this.player, this.layer);
    this.physics.add.collider(this.player, this.enemies, this.playerEnemy);
    this.physics.add.collider(this.enemies, this.layer);
    this.physics.add.collider(this.enemies, this.enemies);
    this.physics.add.collider(this.playerAttack, this.layer, this.fireballWall);  //collide callback for fireball hitting wall
    this.physics.add.collider(this.enemyAttack, this.layer, this.fireballWall);  //collide callback for fireball hitting wall
    this.physics.add.collider(this.playerAttack, this.enemies, this.fireballEnemy); //collide callback for fireball hitting enemy
    this.physics.add.collider(this.playerAttack, this.enemyAttack, this.fireballFireball); //collide callback for fireball hitting darkFireball
    this.physics.add.collider(this.player, this.enemyAttack, this.fireballPlayer); //collide callback for fireball hitting player

    if (this.registry.get('newGame') === true) {
      this.newGame();
      this.centerText = true;
      this.textCall = 1;
    } else {
      this.centerText = false;
    }
  }

  update (time, delta) 
  {
    this.player.update(time, delta);  //the player class update method must be called each cycle as the class is not currently part of a group
    
    //center text over player if a new game
    if (this.centerText) {
      this.text.setPosition(this.player.x, this.player.y - 32);
    }

    //win condition
    if (this.player.alive){
      let coinsCurrent = this.registry.get('coins_current');
      let coinsMax = this.registry.get('coins_max');
      if (coinsCurrent >= coinsMax) {
        this.player.alive = false;
        this.player.body.setVelocity(0);
        this.fanfare.play();
        this.particles = this.add.particles('atlas', 'coins');
        this.emitter = this.particles.createEmitter();
        this.emitter.setPosition(this.player.x, this.player.y);
        this.emitter.setSpeed(32);
        this.emitter.explode( 16, this.player.x, this.player.y );
        this.time.addEvent({ delay: 1000, callback: () => {this.end('win');}, callbackScope: this });
      }
    }
  }

  convertObjects() 
  {
    //objects in map are checked by type(assigned in object layer in Tiled) and the appopriate extended sprite is created
    const objects = this.map.getObjectLayer('objects'); //find the object layer in the tilemap named 'objects'
    const level = this.registry.get('load');
    let coinNum = 1;  //initialize our coin numbering used to check if the coin has been picked up
    let meatNum = 1;  //initialize our meat numbering used to check if the meat has been picked up
    let potNum = 1;  //initialize our potion numbering used to check if the potion has been picked up
    let jugNum = 1;  //initialize our jug numbering used to check if the jug has been picked up
    let heartNum = 1;  //initialize our heart numbering used to check if the heart has been picked up
    let enemyNum = 1; //initialize our enemy numbering used to check if the enemy has been killed
    let demonNum = 1; //initialize our demon numbering used to check if the demon has been killed
    let slimeNum = 1; //initialize our slime numbering used to check if the slime has been killed
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
          potNum += 1;
        }
        if (object.type === 'jug') {
          //check the registry to see if the jug has already been picked. If not create the jug in the level and register it with the game
          regName = `${level}_Jug_${jugNum}`;
          if (this.registry.get(regName) !== 'picked') {
            let jug = new Jug({
              scene: this,
              x: object.x + 8, 
              y: object.y - 8,
              number: jugNum
            });
            this.pickups.add(jug);
            this.registry.set(regName, 'active');
          }
          jugNum += 1;
        }
        if (object.type === 'heart') {
          //check the registry to see if the heart has already been picked. If not create the heart in the level and register it with the game
          regName = `${level}_Heart_${heartNum}`;
          if (this.registry.get(regName) !== 'picked') {
            let heart = new Heart({
              scene: this,
              x: object.x + 8, 
              y: object.y - 8,
              number: heartNum
            });
            this.pickups.add(heart);
            this.registry.set(regName, 'active');
          }
          heartNum += 1;
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
        if (object.type === "demon") {
          //check the registry to see if the demon has already been killed. If not create the demon in the level and register it with the game
          regName = `${level}_Demon_${demonNum}`;
          if (this.registry.get(regName) !== 'dead') {
            let demon = new Demon({
              scene: this,
              x: object.x + 8, 
              y: object.y - 8,
              number: demonNum
            });
            this.enemies.add(demon);
            this.registry.set(regName, 'active');
          }
          demonNum += 1;
        }
        if (object.type === "slime") {
          //check the registry to see if the slime has already been killed. If not create the slime in the level and register it with the game
          regName = `${level}_Slime_${slimeNum}`;
          if (this.registry.get(regName) !== 'dead') {
            let slime = new Slime({
              scene: this,
              x: object.x + 8, 
              y: object.y - 8,
              number: slimeNum
            });
            this.enemies.add(slime);
            this.registry.set(regName, 'active');
          }
          slimeNum += 1;
        }
      });
}

playerEnemy(player, enemy){
  if (enemy.alive){
    player.damage(enemy.attack);
  }
}

fireballWall(fireball, wall)
{
  if (fireball.active) {
    fireball.wallCollide();
  }
}

fireballEnemy(fireball, enemy)
{
  if (fireball.active){
    fireball.enemyCollide(enemy);
  }
}

fireballPlayer(player, fireball)
{
  if (fireball.active) {
    fireball.playerCollide(player);
  }
}

fireballFireball(fireball1, fireball2)
{
  if (fireball1.active && fireball2.active) {
    fireball1.fireballCollide();
    fireball2.fireballCollide();
  }
}

newGame() 
{
  this.registry.set('newGame', false);
  this.text = this.add.bitmapText(this.player.x, this.player.y - 32, 'minecraft', 'Press UP, DOWN, LEFT, and RIGHT to move.');
  this.text.setOrigin(.5);
  this.time.addEvent({ delay: 6000, 
    callback: () => {
      this.changeText(this.textCall);
      this.textCall += 1;
    },
    callbackScope: this,
    repeat: 5
  });
}

changeText(number)
{
  let coins = this.registry.get('coins_max');
  let text = this.text;
  let centerText = this.centerText;
  if (number === 1) {
    let alpha = 1;
    this.tweens.addCounter({
      from: 0,
      to: 10,
      duration: 2000,
      onUpdate: function ()
      {
        text.setAlpha(alpha);
        alpha -= .1;
      },
      onComplete: () => {
        text.setAlpha(0);
        text.setText('POINT and CLICK to attack.');
      }
    });
  } else if (number === 2) {
    let alpha = 0;
    this.tweens.addCounter({
      from: 0,
      to: 10,
      duration: 2000,
      onUpdate: function ()
      {
        text.setAlpha(alpha);
        alpha += .1;
      },
      onComplete: () => {
        text.setAlpha(1);
      }
    });
  } else if (number === 3) {
    let alpha = 1;
    this.tweens.addCounter({
      from: 0,
      to: 10,
      duration: 2000,
      onUpdate: function ()
      {
        text.setAlpha(alpha);
        alpha -= .1;
      },
      onComplete: () => {
        text.setAlpha(0);
        text.setText(`Collect ${coins} coins!`);
      }
    });
  } else if (number === 4) {
    let alpha = 0;
    this.tweens.addCounter({
      from: 0,
      to: 10,
      duration: 2000,
      onUpdate: function ()
      {
        text.setAlpha(alpha);
        alpha += .1;
      },
      onComplete: () => {
        text.setAlpha(1);
      }
    });
  } else if (number === 5) {
    let alpha = 1;
    this.tweens.addCounter({
      from: 0,
      to: 10,
      duration: 2000,
      onUpdate: function ()
      {
        text.setAlpha(alpha);
        alpha -= .1;
      },
      onComplete: () => {
        text.setAlpha(0);
        centerText = false;
        text.destroy();
      }
    });
  }
}

end(type)
{
    //restart the scene. You can place additional cleanup functions in here
    this.music.stop();
    if (type === 'restart') {
      this.scene.restart();
    } else if (type === 'gameOver') {
      this.cameras.main.fade(1000, 16.5, 2.0, 1.2);
      this.events.emit('gameOver');
      this.time.addEvent({ delay: 1000, callback: () => {this.scene.start('GameOver', 'lose');}, callbackScope: this });
    } else if (type === 'win') {
      this.cameras.main.fade(1000, 16.5, 2.0, 1.2);
      this.events.emit('gameOver');
      this.time.addEvent({ delay: 1000, callback: () => {this.scene.start('GameOver', 'win');}, callbackScope: this });
    }
  }

}
