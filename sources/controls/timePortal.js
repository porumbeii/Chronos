import { Vector3, BoxGeometry, MeshBasicMaterial, Mesh, Group, Box3 } from "../../libs/three.module.js"

export class TimePortal {
    constructor(scene, position, rotation = Math.PI) {
        this.wallSize = 10;
        this.cubesize = 0.2;
        this.cubes = new Group();
        for (let i = 0; i < this.wallSize; i++) {
            for (let j = 0; j < this.wallSize; j++) {
                const cubeGeometry = new BoxGeometry(this.cubesize, this.cubesize, this.cubesize);
                const cubeMaterial = new MeshBasicMaterial({ color: 0xffffff });
                const cube = new Mesh(cubeGeometry, cubeMaterial);
                cube.position.set(
                    (i - this.wallSize / 2) * .3,
                    (j - this.wallSize / 2) * .3,
                    0
                );
                this.cubes.add(cube);
            }
        }
        this.cubes.position.copy(position);
        this.cubes.rotateX(rotation);
        scene.add(this.cubes);

        this.CollisionBox = new Box3().setFromCenterAndSize(position, new Vector3(this.wallSize*.3, this.wallSize*.3, this.cubesize));
        
        this.maxDistance = Math.sqrt((this.wallSize / 2) ** 2 + (this.wallSize / 2) ** 2);
        this.rippleAmplitude = 0.2;
        this.rippleFrequency = 0.5;
        this.ripplePhase = Math.PI / 2;
    }

    Update(deltatime) {
        
        this.ripplePhase += .1;

        this.cubes.children.forEach((cube) => {
            const i = (cube.position.x / this.cubesize) + this.wallSize / 2;
            const j = (cube.position.y / this.cubesize) + this.wallSize / 2;
            const distanceToCenter = Math.sqrt((i - this.wallSize / 2) ** 2 + (j - this.wallSize / 2) ** 2);

            const waveHeight = this.rippleAmplitude * Math.sin(distanceToCenter * this.rippleFrequency + this.ripplePhase);
            cube.position.setZ(waveHeight);

            const distanceFactor = 1 - (distanceToCenter / this.maxDistance);
            const waveFactor = (1 - Math.abs(waveHeight / this.rippleAmplitude));
            const hue = 0.6 + 0.4 * distanceFactor * waveFactor;
            const saturation = 1 - 0.2 * distanceFactor;
            const lightness = 0.5 + 0.3 * waveFactor;
            cube.material.color.setHSL(hue, saturation, lightness);

            //cube.material.color.setHSL((this.ripplePhase * .1 - distanceToCenter / this.maxDistance), 1, .5);
        });
    }
}