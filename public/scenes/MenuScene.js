// scenes/MenuScene.js

import Phaser from 'phaser';

class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        // Create your menu here
        // For now, we'll just start the GameScene
        this.scene.start('GameScene');
    }
}

export default MenuScene;

