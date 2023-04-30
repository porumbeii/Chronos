import { BoxGeometry, MeshBasicMaterial, Mesh, Color } from '../../libs/three.module.js';

export class Lava {
    static PerlinSeed = Math.ceil(Math.random() * 100);
    constructor(scene) {
        this.Rows = 20;
        this.Columns = 40;
        this.Boxes = [];

        for (let row = 0; row < this.Rows; row++) {
            this.Boxes.push([]);
            for (let column = 0; column < this.Columns; column++) {
                let height = Math.abs(Math.trunc(this.perlinNoise(Lava.PerlinSeed, column / this.Columns, row / this.Columns) / 200)) + 1;
                let color = this.lerpColor(0xff0000, 0xffff00, height / 10 + .5);
                let angle = height + Math.random();
                this.Boxes[row].push(new LavaBox(scene, column, row, height, color, angle));
            }
        }
    }

    Update(deltaTime) {
        for (let row = 0; row < this.Rows; row++) {
            for (let column = 0; column < this.Columns; column++) {
                this.Boxes[row][column].Update();
            }
        }
    }

    perlinNoise(seed, x, y) {
        // Hashing function to generate a random gradient vector
        function hash(n) {
            return Math.sin(seed + n) * 10000;
        }

        // Interpolation function to smooth out the noise
        function smoothStep(t) {
            return t * t * (3 - 2 * t);
        }

        // Determine the grid cell coordinates
        var xi = Math.floor(x);
        var yi = Math.floor(y);

        // Determine the position within the grid cell
        var xf = x - xi;
        var yf = y - yi;

        // Generate gradient vectors for each corner of the cell
        var gradientTL = [hash(xi + yi * 31), hash(xi + 1 + yi * 31)];
        var gradientBL = [hash(xi + (yi + 1) * 31), hash(xi + 1 + (yi + 1) * 31)];
        var gradientTR = [hash(xi + 1 + yi * 31), hash(xi + 2 + yi * 31)];
        var gradientBR = [hash(xi + 1 + (yi + 1) * 31), hash(xi + 2 + (yi + 1) * 31)];

        // Dot product between gradient vectors and distance vectors
        var dotTL = (xf * gradientTL[0]) + (yf * gradientTL[1]);
        var dotBL = (xf * gradientBL[0]) + ((yf - 1) * gradientBL[1]);
        var dotTR = ((xf - 1) * gradientTR[0]) + (yf * gradientTR[1]);
        var dotBR = ((xf - 1) * gradientBR[0]) + ((yf - 1) * gradientBR[1]);

        // Smooth out the dot products with interpolation functions
        var smoothX = smoothStep(xf);
        var smoothY = smoothStep(yf);

        var top = dotTL + smoothX * (dotTR - dotTL);
        var bottom = dotBL + smoothX * (dotBR - dotBL);
        var result = top + smoothY * (bottom - top);

        return result;
    }

    lerpColor(color1, color2, t) {
        const r1 = (color1 >> 16) & 0xFF;
        const g1 = (color1 >> 8) & 0xFF;
        const b1 = color1 & 0xFF;

        const r2 = (color2 >> 16) & 0xFF;
        const g2 = (color2 >> 8) & 0xFF;
        const b2 = color2 & 0xFF;

        const r = Math.round(r1 * (1 - t) + r2 * t);
        const g = Math.round(g1 * (1 - t) + g2 * t);
        const b = Math.round(b1 * (1 - t) + b2 * t);

        return (r << 16) | (g << 8) | b;
    }
}

class LavaBox {
    constructor(scene, x, y, height, color, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.Mesh = new Mesh(new BoxGeometry(1, 1 + height / 3, 1), new MeshBasicMaterial({ color: color }));
        this.Mesh.position.set(x, 0, y);
        scene.add(this.Mesh);
    }

    Update() {
        this.angle += .01;
        this.Mesh.position.y = Math.cos(this.angle + this.x) * Math.sin(this.angle + this.y);
    }
}