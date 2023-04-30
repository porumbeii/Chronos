"use strict";
import { BoxGeometry, MeshBasicMaterial, Mesh } from '../../libs/three.module.js';

class Particle {
    constructor(scene, position, size, color, speed, scaleFactor) {
        this.Scene = scene;
        this.BoxGeometry = new BoxGeometry(size, size, size);
        this.ScaleFactor = scaleFactor;
        this.Speed = speed;
        this.Material = new MeshBasicMaterial({ color: color });
        this.Mesh = new Mesh(this.BoxGeometry, this.Material);
        this.Mesh.position.copy(position);
        this.Scene.add(this.Mesh);
    }

    Update(deltaTime) {
        if (this.Mesh) {
            this.Mesh.scale.multiplyScalar(this.ScaleFactor);
            this.Mesh.position.add(this.Speed);
        }
    }

    CleanUp() {
        this.Scene.remove(this.Mesh);
        this.Mesh.geometry.dispose();
        this.Mesh.material.dispose();
        this.Mesh = undefined;
    }
};

export { Particle };