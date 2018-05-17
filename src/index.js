import 'phaser';

import Preload from './scenes/Preload'
import Level from './scenes/Level'

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [
        Preload,
        Level
    ]
};

const game = new Phaser.Game(config);
