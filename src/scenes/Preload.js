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
    this.cameras.main.setBackgroundColor(0x2a0503);
    this.fullBar = this.add.graphics();
    this.fullBar.fillStyle(0xda7a34, 1);
    this.fullBar.fillRect((this.cameras.main.width / 4)-2,(this.cameras.main.height /2) - 18, (this.cameras.main.width / 2) + 4, 20);
    this.progress = this.add.graphics();

    //pass loading progress as value to loading bar and redraw as files load
    this.load.on('progress', function (value) {
        this.progress.clear();
        this.progress.fillStyle(0xfff6d3, 1);
        this.progress.fillRect((this.cameras.main.width / 4), (this.cameras.main.height /2) - 16, (this.cameras.main.width / 2) * value, 16);
    }, this);

    //cleanup our graphics on complete
    this.load.on('complete', function () {
        this.progress.destroy();
        this.fullBar.destroy();
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
    this.registry.set('newGame', true);
    this.registry.set('health_max', 4);
    this.registry.set('health_current', 4);
    this.registry.set('magic_max', 20);
    this.registry.set('magic_current', 20);
    this.registry.set('coins_max', 50);
    this.registry.set('coins_current', 0);
    this.registry.set('load', 'Level1');
    this.registry.set('spawn', 'spawnCenter');
  }
}
