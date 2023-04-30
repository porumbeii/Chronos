"use strict";
import { Assets } from "../assets/assets.js";
import { SceneManager } from "../scenes/sceneManager.js";
import { TartarusScene } from "../scenes/tartarusScene.js";

class LoadingScene {
    constructor(loader) {
        Assets.Load();
        this.Loader = loader;
    }

    Update() {
        Assets.CheckLoadProgress();
        if (Assets.AssetsAreLoaded && !SceneManager.IsInTransition) {
            SceneManager.ShowScene(new TartarusScene(), false);
        }
        this.Loader.Update();
    }

    Draw(context) {
        this.Loader.Draw(context);
    }
};
export { LoadingScene };