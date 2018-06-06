import Enemy from './enemy';
import Meat from './meat';
import Potion from './potion';

export default class Demon extends Enemy {
	constructor(config) 
	{
		super(config);
		this.setFrame('slime');
		this.number
		this.health = 2;
		this.deathSound = this.scene.sound.add('slimeDeathSFX');
    	this.deathSound.setVolume(.4);
    	this.detectionDistance = 48;
    	this.walk = 8;
    	this.run = 16;
	}

	deathRegister()
  	{
    	this.scene.registry.set(`${this.scene.registry.get('load')}_Slime_${this.number}`, 'dead');
  	}

  	dropLoot() 
	{
	    let decision = Phaser.Math.RND.integerInRange(1, 20);
	    if (decision <= 2) {
	      let potion = new Potion({
	        scene: this.scene,
	        x: this.x, 
	        y: this.y,
	        number: 0
	      });
	      this.scene.pickups.add(potion);
	      this.dropSound.play();
	    } else if (decision > 2 && decision <= 4) {
	      let meat = new Meat({
	        scene: this.scene,
	        x: this.x, 
	        y: this.y,
	        number: 0
	      });
	      this.scene.pickups.add(meat);
	      this.dropSound.play();
	    }
	}


	
}