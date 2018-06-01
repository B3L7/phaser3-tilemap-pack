import Enemy from './enemy';
import DarkFireball from './darkFireball'

export default class Demon extends Enemy {
	constructor(config) 
	{
		super(config);
		this.setFrame('demon');
		this.number
		this.health = 6;
		this.exclaimSound = this.scene.sound.add('demonExclaim');
    	this.exclaimSound.setVolume(.2);
		this.deathSound = this.scene.sound.add('demonDeathSFX');
    	this.deathSound.setVolume(.4);
    	this.detectionDistance = 128;
    	this.canFireball = true;

	}

	detectBehavior()
	{
		if ((this.distanceToPlayerX > 32 || this.distanceToPlayerY > 32) && this.canFireball){
			this.canFireball = false;
			this.scene.time.addEvent({ delay: 2000, callback: this.enableFireball, callbackScope: this });
			let fireball = new DarkFireball({
	          scene: this.scene,
	          x: this.x, 
	          y: this.y,
	        });
	        this.scene.enemyAttack.add(fireball);
		} else {
		    if (this.x > this.scene.player.x) {
		      this.moveX = 'left';
		    } else if (this.x < this.scene.player.x) {
		      this.moveX = 'right';
		    } else {
		      this.moveX = 'none';
		    }
		    if (this.y > this.scene.player.y) {
		      this.moveY = 'up';
		    } else if (this.y < this.scene.player.y) {
		      this.moveY = 'down';
		    } else {
		      this.moveY = 'none';
		    }
		}
	}

	enableFireball()
	{
		this.canFireball = true;
	}

	deathRegister()
  	{
    	this.scene.registry.set(`${this.scene.registry.get('load')}_Demon_${this.number}`, 'dead');
  	}


	
}