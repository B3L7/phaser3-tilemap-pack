import 'phaser';

import Preload from './scenes/Preload';
import Level from './scenes/Level';
import HUD from './scenes/HUD';

document.body.style.cursor = 'none';    //remove cursor so we can replace it with our crosshair

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-tilemap-pack',
    pixelArt: true,
    clearBeforeRender: false,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade'
    },
    scene: [
        Preload,
        Level,
        HUD
    ]
};

const game = new Phaser.Game(config);
