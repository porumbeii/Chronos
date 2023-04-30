"use strict";
import { Assets } from '../assets/assets.js';
import { Box3 } from '../../libs/three.module.js';

export class HealthBumps {
    constructor(scene, positions) {
        this.CoinsArray = [];
        for (let index = 0; index < positions.length; index++) {
            let mesh = Assets.Health.GLBScene.clone();
            mesh.position.copy(positions[index]);
            mesh.angle = Math.random();
            mesh.CollisionBox = new Box3();
            this.CoinsArray.push(mesh);
            scene.add(mesh);
        }
    }

    Update(deltaTime, scene, player) {
        for (let index = 0; index < this.CoinsArray.length; index++) {
            let coin = this.CoinsArray[index];
            coin.angle += deltaTime * 4;
            coin.position.y += Math.sin(coin.angle) * deltaTime * 2;
            coin.rotation.y = coin.angle;
            coin.CollisionBox.setFromObject(coin);
            if (player.CollisionBox.intersectsBox(coin.CollisionBox)) {
                scene.remove(coin);
                Assets.CoinSound.Play();
                this.CoinsArray.splice(index, 1);
                player.Health = 100;
            }
        }
    }
}
