"use strict";
import { SceneManager } from "../scenes/sceneManager.js";
import { LoadingScene } from "../scenes/loadingScene.js";
import { Keyboard } from "./input.js";
import { Clock } from "../../libs/three.module.js";

class Game {

    static Initialize(canvas, context, loader) {
        Game.Canvas = canvas;
        Game.Context = context;

        window.addEventListener("resize", Game.ResizeCanvas, false);
        Game.ResizeCanvas();
        SceneManager.ShowScene(new LoadingScene(loader));

        window.onkeydown = function (e) { Keyboard.UpdateKeys(e.keyCode, true); };
        window.onkeyup = function (e) { Keyboard.UpdateKeys(e.keyCode, false); };

        this.Clock = new Clock();
    }

    static Update() {
        SceneManager.Update(this.Clock.getDelta());
    }

    static Draw(context) {
        context.fillStyle = 'white';
        context.fillRect(0, 0, Game.Canvas.width, Game.Canvas.height)
        SceneManager.Draw(context);
    }

    static Loop() {
        Game.Update();
        Game.Draw(Game.Context);
        requestAnimationFrame(Game.Loop);
    }

    static ResizeCanvas() {
        Game.Canvas.width = window.innerWidth;
        Game.Canvas.height = window.innerHeight;
        Game.Canvas.centerX = window.innerWidth / 2;
        Game.Canvas.centerY = window.innerHeight / 2;
    }
};
export { Game };