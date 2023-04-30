"use strict";
import { Assets } from "../assets/assets.js";
import { Vector3 } from '../../libs/three.module.js';
import { SpeachBubble } from "../controls/speachBubble.js";
import { Keyboard } from "../core/input.js";

export class Agnes {
    constructor(scene, position, rotation = new Vector3(0, 0, 0)) {
        this.mesh = Assets.Agnes.GLBScene;
        this.mesh.position.copy(position);
        this.mesh.rotation.copy(rotation);
        scene.add(this.mesh);

        this.SpeachBubbleLinesBridgeIsNotShown = [
            "Collect 10 coins!",
            "The bridge will apear.",
            "There is a time portal there.",
            "But nobody dared to go through it."
        ];

        this.SpeachBubbleLinesBridgeIsShown = [
            "Beware Hercules!",
            "That portal is dangerous."
        ]

        this.SpeachBubble = new SpeachBubble(scene, position, new Vector3(0, 3, 0));
        this.CurrentSpeachLine = 0;
        this.CurrentSpeachNegativeLine = 0;
    }

    Update(player, camera, bridgeIsShown) {

        if (!bridgeIsShown) {
            if (this.mesh.position.distanceTo(player.position) < 3) {
                if (this.CurrentSpeachLine === 0) {
                    this.SpeachBubble.ShowText(this.SpeachBubbleLinesBridgeIsNotShown[0]);
                    this.CurrentSpeachLine++;
                }

                if (Keyboard.Say && this.CurrentSpeachLine < this.SpeachBubbleLinesBridgeIsNotShown.length) {
                    if (this.SpeachBubble.IsShown) {
                        this.SpeachBubble.ShowText(this.SpeachBubbleLinesBridgeIsNotShown[this.CurrentSpeachLine]);
                        this.CurrentSpeachLine++;
                    }
                }
            }
        } else {
            if (this.mesh.position.distanceTo(player.position) < 3) {
                if (this.CurrentSpeachNegativeLine === 0) {
                    this.SpeachBubble.ShowText(this.SpeachBubbleLinesBridgeIsShown[0]);
                    this.CurrentSpeachNegativeLine++;
                }

                if (Keyboard.Say && this.CurrentSpeachNegativeLine < this.SpeachBubbleLinesBridgeIsShown.length) {
                    if (this.SpeachBubble.IsShown) {
                        this.SpeachBubble.ShowText(this.SpeachBubbleLinesBridgeIsShown[this.CurrentSpeachNegativeLine]);
                        this.CurrentSpeachNegativeLine++;
                    }
                }
            }
        }
        this.SpeachBubble.Update(this.mesh.position, camera);
    }
}