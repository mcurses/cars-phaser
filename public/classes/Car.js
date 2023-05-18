// classes/Car.js

import Phaser from 'phaser';

class Car extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'car');

        // Add this car to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Enable physics for the car
        this.setCollideWorldBounds(true);

        // Add controls for the car
        this.cursors = this.scene.input.keyboard.createCursorKeys();

        // Add properties for the car's speed, direction, and drift state
        this.speed = 0;
        this.direction = 0;
        this.isDrifting = false;

        // Add properties for the car's turning rate and grip
        this.turnRateStatic = 0.1;
        this.turnRateDynamic = 0.08;
        this.turnRate = this.turnRateStatic;
        this.gripStatic = 2;
        this.gripDynamic = 0.5;
        this.DRIFT_CONSTANT = 3;
    }

    update() { 
        // Check for player input and adjust the car's direction and speed
        if (this.cursors.left.isDown) {
            this.direction -= this.turnRate;
        } else if (this.cursors.right.isDown) {
            this.direction += this.turnRate;
        }

        if (this.cursors.up.isDown) {
            this.speed += 0.05;
        } else if (this.cursors.down.isDown) {
            this.speed -= 0.05;
        }

        // Update the car's position and angle based on its speed and direction
        this.x += Math.cos(this.direction) * this.speed;
        this.y += Math.sin(this.direction) * this.speed;
        this.rotation = this.direction;

        // Apply the drifting mechanics
        this.drift();

         socket.emit('car-update', {
            x: this.x,
            y: this.y,
            rotation: this.rotation,
            speed: this.speed,
            direction: this.direction
        });
    }

    drift() {
        // Implement the drifting mechanics here
        // For now, we'll just reduce the car's speed over time
        // this.speed *= 0.99;
      // Calculate the car's body-fixed velocity
        let vB = this.vectWorldToBody(this.body.velocity, this.angle);

        // Determine whether the car is gripping or drifting
        let grip;
        if (Math.abs(vB.x) < this.DRIFT_CONSTANT) {
            grip = this.gripStatic;
            this.turnRate = this.turnRateStatic;
            this.isDrifting = false;
        } else {
            grip = this.gripDynamic;
            this.turnRate = this.turnRateDynamic;
            this.isDrifting = true;
        }

        // Calculate the car's body-fixed drag and update its acceleration
        let bodyFixedDrag = new Phaser.Math.Vector2(vB.x * -grip, vB.y * 0.05);
        let worldFixedDrag = this.vectBodyToWorld(bodyFixedDrag, this.angle);
        this.body.acceleration.add(worldFixedDrag.x, worldFixedDrag.y);
    }
}


    vectBodyToWorld(vect, ang) {
        let vn = new Phaser.Math.Vector2(
            vect.x * Math.cos(ang) - vect.y * Math.sin(ang),
            vect.x * Math.sin(ang) + vect.y * Math.cos(ang)
        );
        return vn;
    }

    vectWorldToBody(vect, ang) {
      let vn = new Phaser.Math.Vector2(
        vect.x * Math.cos(ang) + vect.y * Math.sin(ang),
        vect.y * Math.cos(ang) - vect.x * Math.sin(ang)
      );
      return vn;
    }
}

export default Car;
