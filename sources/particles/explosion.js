"use striect";
import { Vector3, BoxGeometry, MeshStandardMaterial, Mesh } from '../../libs/three.module.js';

class Explosion {
    constructor(scene, position, power) {
        this.Scene = scene;
        this.position = position.clone();
        let geometry = new BoxGeometry(0.3, 0.3, 0.3);
        let material = new MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });

        this.Particles = [];
        for (var p = 0; p < 20; p++) {
            const particle = new Mesh(geometry, material);
            particle.speed = new Vector3(
                (Math.random() * power) - (power / 2),
                (Math.random() * power),
                (Math.random() * power) - (power / 2)
            );
            particle.position.copy(this.position);
            particle.scaleFactor = .89 + Math.random() * .1;
            scene.add(particle);
            this.Particles.push(particle);
        }
    }

    Update(deltaTime) {
        for (let i = 0; i < this.Particles.length; i++) {
            let particle = this.Particles[i];
            particle.scale.multiplyScalar(particle.scaleFactor);
            particle.position.add(particle.speed);            // add gravity
            particle.speed.y -= .08
            // if hitting the ground then reverse y and make speed on z and z slower.
            if (particle.position.y < this.position.y) {
                particle.speed.y *= -0.9;
                particle.speed.z *= .8;
                particle.speed.x *= .8;
            }

            if (particle.scale.x < 0.2) {
                this.Scene.remove(particle);
                particle.geometry.dispose();
                particle.material.dispose();
                particle = undefined;
                this.Particles.splice(i, 1);
            }
        }
    }
}
export { Explosion };