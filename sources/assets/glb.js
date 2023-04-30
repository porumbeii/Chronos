"use strict";
import { GLTFLoader } from '../../libs/gltfoader.js';
import { Assets } from './assets.js';

class GLB {
    constructor(source) {
        this.Source = source;
        this.PercentageLoaded = 0;
        this.IsLoaded = false;

        this.GLBScene;

        let glbLoader = new GLTFLoader();
        glbLoader.load(source, (glb) => {
            this.GLBScene = glb.scene;
            this.Animations = glb.animations;
            this.IsLoaded = true;
        });
        Assets.Items.push(this);

    }
};
export { GLB };