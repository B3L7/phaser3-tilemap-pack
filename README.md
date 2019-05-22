# Phaser 3 Tilemap & File Pack Project Template

![Screenshot](https://github.com/B3L7/phaser3-tilemap-pack/raw/master/screenshot.png "Template Screenshot")

A Phaser 3 Project Template with Webpack, Tilemap, and File Pack. This template was created to illustrate the conecept of having a single Level Class (Extended from the Scene Class) which generates the game level from dynamically loaded tilemaps.

Try the [demo!](https://b3l7.github.io/phaser3-tilemap-pack/)

### Requirements

We need [Node.js](https://nodejs.org) to install and run scripts.

[Tiled](https://www.mapeditor.org/) needed to make and edit tilemaps.

[Littera](http://kvazars.com/littera/) to make bitmap font.

[Leshy Spritetool](https://www.leshylabs.com/apps/sstool/) used to make atlas.

[Tile Extruder](https://github.com/sporadic-labs/tile-extruder) to extrude tileset and prevent bleed.

## Install and run

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm start` | Build project and open web server running project |
| `npm run build` | Builds code bundle with production settings (minification, uglification, etc..) |

## References
Based on Project Template by Richard Davey:
[Phaser 3 Webpack Project Template](https://github.com/photonstorm/phaser3-project-template)

and 

[Generic Platformer and Phaser Bootstrap Project](https://github.com/nkholski/phaser3-es6-webpack)

## Graphics and Sound

[16x16 Fantasy tileset](https://opengameart.org/content/16x16-fantasy-tileset)

[Generic 8-bit JRPG Soundtrack](https://opengameart.org/content/generic-8-bit-jrpg-soundtrack)

[512 Sound Effects (8-bit style)](https://opengameart.org/content/512-sound-effects-8-bit-style)

[Minecraft Font](https://www.dafont.com/minecraft.font)



## Change Log

### Version 1.2.1 - May 22, 2019

* Fireballl collision fix

### Version 1.2.0 - May 21, 2019

* Upgrade to Phaser 3.17.0
* Implemented pools for player and enemy fireballs
* Added scaling to game config
* Updated to babel and webpack 4 to be in line with Phaser 3 Webpack Project Template

### Version 1.1.0 - September 6, 2018

* Upgrade to Phaser 3.12.0
* Minor fixes for 3.12 compatibility
