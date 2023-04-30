import { BoxGeometry, MeshStandardMaterial, Mesh, Vector3, MathUtils } from '../../libs/three.module.js';

export class Fountain {
    constructor(scene, dropsCount, position) {
        this.position = position;

        this.geometry = new BoxGeometry(0.2, 0.2, 0.2);
        this.material = new MeshStandardMaterial({ color: 0x6ABDE7, roughness: 0.1 });

        this.drops = [];
        for (let i = 0; i < dropsCount; i++) {
            const drop = new Mesh(this.geometry, this.material);
            this.resetDrop(drop);
            this.drops.push(drop);
            scene.add(drop);
        }
    }

    resetDrop(drop) {
        drop.position.copy(this.position);
        drop.speed = new Vector3(
            .05 - Math.random() * .1,
            Math.random() * .1 + .1,
            .05 - Math.random() * .1
        );
    }

    Update(deltaTime) {
        for (let i = 0; i < this.drops.length; i++) {
            let drop = this.drops[i];
            drop.speed.y -= .008;
            drop.position.add(drop.speed);
            if (drop.position.y < this.position.y) {
                this.resetDrop(drop);
            }
        }
    }
}

