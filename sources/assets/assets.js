"use strict";
import { GLB } from './glb.js';
import { Font } from './font.js';
import { Sound } from './sound.js';

class Assets {
    static Items = [];
    static ItemsLoaded = 0;
    static AssetsAreLoaded = false;

    static Load() {
        Assets.Hercules = new GLB("assets/glb/hercules.glb");
        Assets.Chronos = new GLB("assets/glb/chronos.glb");
        Assets.ChronosAttacking = new GLB("assets/glb/chronosAttacking.glb");
        Assets.Blacksmith = new GLB("assets/glb/blacksmith.glb");
        Assets.Agnes = new GLB("assets/glb/agnes.glb");

        Assets.Cyclope = new GLB("assets/glb/cyclope.glb");
        Assets.Coin = new GLB("assets/glb/coin.glb");
        Assets.Sword = new GLB("assets/glb/sword.glb");
        Assets.Bridge = new GLB("assets/glb/bridge.glb");
        Assets.Health = new GLB("assets/glb/health.glb");

        Assets.OlympusTop = new GLB("assets/glb/olympustop.glb");
        Assets.OlympusBase = new GLB("assets/glb/olympusbase.glb");
        Assets.BigBen = new GLB("assets/glb/bigben.glb");

        Assets.DefaultFont = new Font("Default", "assets/fonts/font.otf");

        Assets.TartarusSceneMusic = new Sound("assets/mp3/tartarus.mp3");
        Assets.OlympusBaseSceneMusic = new Sound("assets/mp3/olympusbase.mp3");
        Assets.OlympusTopSceneMusic = new Sound("assets/mp3/olympustop.mp3");
        Assets.BigbenSceneMusic = new Sound("assets/mp3/bigben.mp3");
        Assets.TravelthroughtimeSceneMusic = new Sound("assets/mp3/travelthroughtime.mp3");

        Assets.CoinSound = new Sound("assets/mp3/coin.mp3");
        Assets.DashSound = new Sound("assets/mp3/dash.mp3");
        Assets.JumpSound = new Sound("assets/mp3/jump.mp3");
        Assets.DamageSound = new Sound("assets/mp3/damage.mp3");
        Assets.EasySound = new Sound("assets/mp3/easy.mp3");
        Assets.TransitionSound = new Sound("assets/mp3/transition.mp3");
        Assets.HitSound = new Sound("assets/mp3/hit.mp3");
        Assets.HitChronosSound = new Sound("assets/mp3/hitchronos.mp3");
    }


    static CheckLoadProgress() {
        Assets.ItemsLoaded = 0;
        let index = 0, length = Assets.Items.length;
        while (index < length) {
            if (Assets.Items[index].IsLoaded === true) {
                Assets.ItemsLoaded++;
            }
            index++;
        }

        if (Assets.ItemsLoaded === Assets.Items.length)
            Assets.AssetsAreLoaded = true;
        else
            Assets.AssetsAreLoaded = false;
    }

    static GetAsset(source) {
        let index = 0;
        let length = Assets.Items.length;
        while (index < length) {
            if (Assets.Items[index].Source === source)
                return Content.Items[index];
            index++;
        }
        return null;
    }
};
export { Assets };