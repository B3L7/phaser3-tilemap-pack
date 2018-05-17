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
    this.load.pack('pack', 'assets/pack.json', this.global.load.level); //the appropriate section of the asset pack is loaded based on what is currently set globally
    //this.load.tilemapTiledJSON('map', 'assets/maps/level1.json');
  }
      
  create() {
    this.map = this.make.tilemap({ key: 'map' });
    let tileset = this.map.addTilesetImage('tiles');
    this.layer = this.map.createStaticLayer('tileLayer', tileset, 0, 0);
    
  }

}