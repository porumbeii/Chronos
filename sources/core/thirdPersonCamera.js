"use strict";
import { PerspectiveCamera, Vector3, Raycaster } from '../../libs/three.module.js';

class ThirdPersonCamera {
    constructor(target) {
        this.Target = target;
        this.Camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.InitialCameraOffset = new Vector3(0, 7, -10).applyAxisAngle(new Vector3(0, 1, 0), Math.PI);
        this.CameraOffset = null;

        this.SeeThrough = [];
        this.Raycaster = new Raycaster();
    }

    Update(deltaTime, sceneMeshes) {
        this.InitialCameraOffset = new Vector3(0, 7, -10).applyAxisAngle(new Vector3(0, 1, 0), Math.PI);
        this.CameraOffset = this.InitialCameraOffset.clone().applyAxisAngle(new Vector3(0, 1, 0), this.Target.rotation.y);
        let cameraPosition = this.Target.position.clone().add(this.CameraOffset);
        this.Camera.position.lerpVectors(this.Camera.position, cameraPosition, 0.5);
        this.Camera.lookAt(this.Target.position);

        if (this.SeeThrough.length > 0) {
            this.SeeThrough.forEach(mesh => {
                mesh.material.transparent = false;
                mesh.material.opacity = 1;
            });
            this.SeeThrough = [];
        }

        this.Raycaster.set(this.Camera.position, this.Target.position.clone().add(new Vector3(0, 1, 0)).sub(this.Camera.position).normalize());

        let intersects = this.Raycaster.intersectObjects(sceneMeshes, true);
        if (intersects.length > 0) {
            this.SeeThrough = [];
            let distance = this.Target.position.distanceTo(this.Camera.position);
            intersects.some(intersect => {
                if (intersect.distance < distance) {
                    intersect.object.material.transparent = true;
                    intersect.object.material.opacity = 0.3;
                    this.SeeThrough.push(intersect.object);
                }
            })
        }
    }
}
export { ThirdPersonCamera }