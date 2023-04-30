import { BoxGeometry, MeshBasicMaterial, Mesh, Group, Vector3, Color } from '../../libs/three.module.js';

export class RisingBubbles {
    constructor(scene, bublesCount, position, risingValue, bubleSize, spred, speed = 0.01, startColor = 0xffffff, endColor = 0xffffff) {
        this.position = position;
        this.spred = spred;
        this.risingValue = risingValue;
        this.speed = speed;

        this.startColor = new Color(startColor);
        this.endColor = new Color(endColor);
        this.ColorIsChanging = startColor !== endColor ? true : false;

        this.Bubbles = new Group();
        for (let i = 0; i < bublesCount; i++) {
            const material = new MeshBasicMaterial({ color: startColor });
            const geometry = new BoxGeometry(bubleSize, bubleSize, bubleSize);
            const bubble = new Mesh(geometry, material);
            this.SpawnBubble(bubble);
            bubble.position.y = Math.random() * (this.position.y + risingValue);
            this.Bubbles.add(bubble);
        }
        scene.add(this.Bubbles);
    }

    Update(deltaTime) {
        this.Bubbles.children.forEach(bubble => {
            bubble.position.y += bubble.speed;
            bubble.angle += .1;
            bubble.position.x = bubble.origin.x + Math.sin(bubble.angle) * bubble.speed * 5;
            bubble.position.z = bubble.origin.z + Math.cos(bubble.angle) * bubble.speed * 5;
            if (this.ColorIsChanging)
                bubble.material.color.lerpColors(this.startColor, this.endColor, bubble.position.y / (bubble.origin.y + bubble.risingValue) - .3);
            if (bubble.position.y > bubble.origin.y + bubble.risingValue) {
                this.SpawnBubble(bubble);
            }
        });
    }

    SpawnBubble(bubble) {
        bubble.position.x = this.position.x + (Math.random() - 0.5) * this.spred.x;
        bubble.position.y = this.position.y;
        bubble.position.z = this.position.z + (Math.random() - 0.5) * this.spred.z;
        bubble.origin = new Vector3(bubble.position.x, bubble.position.y, bubble.position.z);
        bubble.speed = Math.random() * 2 * this.speed + this.speed;
        bubble.angle = Math.random() * Math.PI;
        bubble.risingValue = Math.random() * this.risingValue / 2 + this.risingValue / 2 - .1;
    }
}