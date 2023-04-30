"use strict";

import { Assets } from "./assets.js";

class Sound {
    static PreviousBackgroundMusic = null;

    constructor(source) {
        this.Source = source;
        this.IsLoaded = false;
        this.PercentageLoaded = 0;
        this.Audio = new Audio();
        this.Audio.onloadeddata = (event) => {
            this.IsLoaded = true;
        }
        this.Audio.src = source;
        Assets.Items.push(this);
    }

    Play(loop = false) {
        this.Audio.currentTime = 0;
        this.Audio.play();
        this.Audio.loop = loop;
    }

    PlayBackgroundMusic() {
        if (Sound.PreviousBackgroundMusic !== null) {
            Sound.PreviousBackgroundMusic.Audio.pause();
            Sound.PreviousBackgroundMusic.Audio.currentTime = 0;
        }
        Sound.PreviousBackgroundMusic = this;
        this.Audio.play();
        this.Audio.loop = true;
    }

    Stop() {
        this.Audio.pause();
        this.Audio.currentTime = 0;
    }

    Pause() {
        this.Audio.pause();
    }
};
export { Sound };
