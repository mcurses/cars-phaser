// scenes/BootScene.js

import Phaser from 'phaser';

class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Load your assets here
        // this.load.image('car', 'assets/car.png');
        // this.load.image('map', 'assets/map.png');
    }

    create() {
        // Go to the next scene (e.g., the menu)
        this.scene.start('MenuScene');
    }
}

export default BootScene;

