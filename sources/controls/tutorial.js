"use strict";
import { Keyboard } from '../core/input.js';

export class Tutorial {
    constructor(hod) {
        this.Hod = hod;
        this.UpWasPressed = false;
        this.RotateWasPressed = false;
        this.SpaceWasPressed = false;

        this.SayWasPressed = false;

        this.hodMessages = [
            "Press w to move forward.",
            "Press a or d to rotate.",
            "Press space to attack",
            "Pres s to talk to people"
        ];
        this.hodcurrentMessage = 0;
        this.Hod.ShowMessage(this.hodMessages[this.hodcurrentMessage]);
        this.IsEnded = false;
    }

    Update() {
        if (Keyboard.Up && !this.UpWasPressed && this.hodcurrentMessage === 0) {
            this.hodcurrentMessage = 1;
            this.Hod.ShowMessage(this.hodMessages[this.hodcurrentMessage]);
            this.UpWasPressed = true;
        }

        if ((Keyboard.Left || Keyboard.Right) && !this.RotateWasPressed && this.hodcurrentMessage === 1) {
            this.hodcurrentMessage = 2;
            this.Hod.ShowMessage(this.hodMessages[this.hodcurrentMessage]);
            this.RotateWasPressed = true;
        }

        if (Keyboard.Space && !this.SpaceWasPressed && this.hodcurrentMessage === 2) {
            this.hodcurrentMessage = 3;
            this.Hod.ShowMessage(this.hodMessages[this.hodcurrentMessage]);
            this.SpaceWasPressed = true;
        }
        if (Keyboard.Say && !this.SayWasPressed && this.hodcurrentMessage === 3) {
            this.IsEnded = true;
            this.Hod.ShowMessage("");
        }
    }
}