"use strict";

export class Loader {
    constructor(width, height) {
        this.Width = width;
        this.Height = height;
        this.Size = 30;
        this.Timer = 0;
        this.Hue = 0;
        this.Color = null;
        this.Hexagons = [];
    }

    Update(timestamp) {
        this.Hue += 1;
        if (this.Hue > 360) this.Hue = 0;
        this.Color = `hsl(${this.Hue}, 50%, 50%)`;

        this.Timer += .1;
        if (this.Timer < 1)
            this.Size += 1 - (1 - this.Timer) * (1 - this.Timer);
        if (this.Timer > 8) {
            this.Size = 30;
            this.Timer = 0;
            this.Hexagons.push({ size: 40, color: this.Color });
        }

        for (let i = 0; i < this.Hexagons.length; i++) {
            this.Hexagons[i].size *= 1.02;
            if (this.Hexagons[i].size > this.Width / 2)
                this.Hexagons.splice(i, 1);
        }
    }

    Draw(context) {
        this.DrawHexagon(context, this.Size, this.Color, 15);
        for (let i = 0; i < this.Hexagons.length; i++) {
            this.DrawHexagon(context, this.Hexagons[i].size, this.Hexagons[i].color, 1);
        }
    }

    DrawHexagon(context, size, color, lineWidth) {
        context.lineCap = 'round';
        context.beginPath();
        context.moveTo(this.Width / 2 + size * Math.cos(Math.PI / 6), this.Height / 2 + size * Math.sin(Math.PI / 6));
        for (let i = 1; i <= 6; i += 1) {
            context.lineTo(this.Width / 2 + size * Math.cos(i * 2 * Math.PI / 6 + Math.PI / 6), this.Height / 2 + size * Math.sin(i * 2 * Math.PI / 6 + Math.PI / 6));
        }
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        context.stroke();
    }
}