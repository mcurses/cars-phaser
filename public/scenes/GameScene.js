
// scenes/GameScene.js

import Phaser from 'phaser';
import Car from '../classes/Car';
import socket from '../socket';

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.otherPlayers = new Map();
    }

    create() {
        // Create your game world here
        // For now, we'll just create a car in the middle of the screen
        this.car = new Car(this, this.game.config.width / 2, this.game.config.height / 2);

        // Listen for car updates from the server
        socket.on('car-update', (carState) => {
            // Update the player's car based on the server's state
            this.car.x = carState.x;
            this.car.y = carState.y;
            this.car.rotation = carState.rotation;
            this.car.speed = carState.speed;
            this.car.direction = carState.direction;
        });

        // Listen for other players' car updates from the server
        socket.on('other-car-update', (otherCarStates) => {
            otherCarStates.forEach((otherCarState) => {
                if (!this.otherPlayers.has(otherCarState.id)) {
                    // This is a new player, create a new car for them
                    const otherCar = new Car(this, otherCarState.x, otherCarState.y);
                    this.otherPlayers.set(otherCarState.id, otherCar);
                }

                // Update the other player's car based on the server's state
                const otherCar = this.otherPlayers.get(otherCarState.id);
                otherCar.x = otherCarState.x;
                otherCar.y = otherCarState.y;
                otherCar.rotation = otherCarState.rotation;
                otherCar.speed = otherCarState.speed;
                otherCar.direction = otherCarState.direction;
            });
        });

        // Listen for player-joined and player-left events from the server
        socket.on('player-joined', (playerId) => {
            // A new player has joined the game, create a new car for them
            const otherCar = new Car(this, this.game.config.width / 2, this.game.config.height / 2);
            this.otherPlayers.set(playerId, otherCar);
        });

        socket.on('player-left', (playerId) => {
            // A player has left the game, remove their car
            this.otherPlayers.get(playerId).destroy();
            this.otherPlayers.delete(playerId);
        });
    }

    update() {
        // Update your game here
        // For now, we'll just update the car
        this.car.update();
    }
}

export default GameScene;
