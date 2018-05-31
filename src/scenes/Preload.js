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
    Phaser.GameObjects.BitmapText.ParseFromAtlas(this, 'minecraft', 'atlas', 'minecraft', 'minecraftXML');  //assemble the bitmap font from the atlas
    this.initRegistry(); //initialize the starting registry values.
    this.scene.launch('HUD'); //launch HUD
    this.scene.start('Level');
  }

  initRegistry() 
  {
    //the game registry provides a place accessible by all scenes to set and get data.
    //Here we store our key that tells the LevelScene what map to load.
    this.registry.set('health_max', 4);
    this.registry.set('health_current', 4);
    this.registry.set('coins_max', 4);
    this.registry.set('coins_current', 0);
    this.registry.set('load', 'Level1');
    this.registry.set('spawn', 'spawnCenter');
  }
}
