"use strict";
export class TypeWriter {
    constructor(x, y, align = "left") {
        this.x = x;
        this.y = y;
        this.align = align;

        this.Text = ""
        this.CurrentText = "";
        this.Counter = 0;
        this.IsShown = false;
        this.Alpha = 0;
    }

    Update() {
        if (!((this.Counter++) % 5)) {
            if (this.Alpha < 1) this.Alpha += .05;
            if (this.CurrentText != this.Text) {
                this.CurrentText += this.Text[this.CurrentText.length];
            } else this.IsShown = true;
        }
    }

    ShowText(text) {
        this.Text = text;
        this.CurrentText = "";
        this.Counter = 0;
        this.Alpha = 0;
        this.IsShown = false;
    }

    Draw(context) {
        if (this.Alpha < 1) {
            context.strokeStyle = `rgba(255, 255, 255, ${this.Alpha})`;
            context.fillStyle = `rgba(0, 0, 0, ${this.Alpha})`;
        }
        else {
            context.strokeStyle = "white";
            context.fillStyle = "black";
        }
        context.textBaseline = 'middle';
        context.textAlign = this.align;
        context.font = "30px 'Default'";
        context.lineWidth = 3;
        context.strokeText(this.CurrentText, this.x, this.y);
        context.fillText(this.CurrentText, this.x, this.y);
    }
}