export default class Preload extends Phaser.Scene {
  constructor() {
    super({
      key: 'Preload'
    });
  }

  preload(){
    this.load.pack('Preload', 'assets/pack.json', 'Preload');
  }
      
  create() {
    this.initGlobals(); //create an object which is passed to the Level scene for storing inter-level data such as spawn info, player heath, etc...
    this.scene.start('Level', this.global);
  }

  initGlobals() {
    this.global = {
      player : {
        heatlh: {
          current: 4,
          max: 4
        }
      },
      load : {
        level: "Level1",
        spawn: "spawn1",
      }
    };
  }
}
