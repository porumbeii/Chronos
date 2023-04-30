"use strict";
import { Assets } from "../assets/assets.js";
import { Vector3 } from '../../libs/three.module.js';
import { SpeachBubble } from "../controls/speachBubble.js";
import { Keyboard } from "../core/input.js";

export class Blacksmith {
    constructor(scene, position, rotation = new Vector3(0, 0, 0)) {
        this.mesh = Assets.Blacksmith.GLBScene;
        this.mesh.position.copy(position);
        this.mesh.rotation.copy(rotation);
        scene.add(this.mesh);

        this.SpeachBubbleLines = [
            "Welcome Hercules!",
            "I heard you had the dream.",
            "Everyone here had it!",
            "Chronos is comming!",
            "Did you find Anaklusmos sword?",
            "Go to Agnes with 10 coins.",
            "She will make the bridge apear.",
            "You are our last hope!"
        ];

        this.SpeachBubble = new SpeachBubble(scene, position, new Vector3(0, 2, 0));
        this.CurrentSpeachLine = 0;
    }

    Update(player, camera) {

        if (this.mesh.position.distanceTo(player.position) < 7) {
            if (this.CurrentSpeachLine === 0) {
                this.SpeachBubble.ShowText(this.SpeachBubbleLines[0]);
                this.CurrentSpeachLine++;
            }

            if (Keyboard.Say && this.CurrentSpeachLine < this.SpeachBubbleLines.length) {
                if (this.SpeachBubble.IsShown) {
                    this.SpeachBubble.ShowText(this.SpeachBubbleLines[this.CurrentSpeachLine]);
                    this.CurrentSpeachLine++;
                }
            }
        }
        this.SpeachBubble.Update(this.mesh.position, camera);
    }
}