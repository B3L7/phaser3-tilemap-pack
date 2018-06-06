export default class GameOver extends Phaser.Scene {
  constructor() 
  {
    super({
      key: 'GameOver'
    });
  }

  init(condition)
  {
    this.condition = condition;
  }
      
  create() 
  {
    this.cameras.main.setBackgroundColor(0x2a0503);
    if (this.condition === 'win') {
      this.overText = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2 - 64, 'atlas', 'win');
      this.music = this.sound.add(`winMusic`);
    } else if (this.condition === 'lose') {
      this.overText = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2 - 64, 'atlas', 'gameOver');
      this.music = this.sound.add(`overMusic`);
    }
    this.text = this.add.bitmapText(this.cameras.main.width / 2, this.cameras.main.height / 2 + 64, 'minecraft', 'Press ENTER to Continue');
    this.text.setOrigin(.5);
    this.music.setLoop(true);
    this.music.play();
    this.input.keyboard.on('keydown_ENTER', function (event) {
        location.reload();
    });
  }

 
}
