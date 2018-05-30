export default class Preload extends Phaser.Scene {
  constructor() 
  {
    super({
      key: 'Preload'
    });
  }

  preload()
  {
    this.load.pack('Preload', 'assets/pack.json', 'Preload');
  }
      
  create() 
  {
    this.initRegistry(); //initialize the starting registry values.
    this.scene.start('Level');
  }

  initRegistry() 
  {
    //the game registry provides a place accessible by all scenes to set and get data.
    //Here we store our key that tells the LevelScene what map to load.
    this.registry.set('player_health_max', 4);
    this.registry.set('player_health_current', 4);
    this.registry.set('load', 'Level1');
  }
}
