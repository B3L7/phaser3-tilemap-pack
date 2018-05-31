export default class Preload extends Phaser.Scene {
  constructor() 
  {
    super({
      key: 'Preload'
    });
  }

  preload()
  {
    //create a background and prepare loading bar
    this.bg = this.add.graphics();
    this.bg.clear();
    this.bg.fillStyle(0x2a0503, 1);
    this.bg.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
    this.progress = this.add.graphics();

    //pass loading progress as value to loading bar and redraw as files load
    this.load.on('progress', function (value) {
        this.progress.clear();
        this.progress.fillStyle(0xfff6d3, 1);
        this.progress.fillRect(200, 300, 400 * value, 30);
    }, this);

    //cleanup our graphics on complete
    this.load.on('complete', function () {
        this.progress.destroy();
        this.bg.destroy();

    }, this);

    //start loading
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
