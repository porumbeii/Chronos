"use strict";
import { Assets } from "../assets/assets.js";
import { Game } from "../core/game.js";

class SceneManager {
    static CurrentScene = null;
    static SceneToHide = null;
    static SceneToShow = null;

    static IsInTransition = false;
    static TransitionCounter = 0;
    static TransitionFadeValue = 0;


    static pivotX = window.innerWidth / 2;
    static pivotY = 0;
    static ballRadius = 40;
    static L = window.innerHeight - SceneManager.ballRadius; // length of the pendulum
    static theta = - Math.PI / 2; // initial angle
    static omega = 0; // initial angular velocity
    static dt = 0.32; // time step
    static ballX = 0;
    static ballY = 0;


    static ShowScene(scene, withTransition = false) {
        if (SceneManager.IsInTransition)
            return;
        if (withTransition) {
            SceneManager.Start = performance.now();
            Assets.TransitionSound.Play();
            SceneManager.SceneToHide = SceneManager.CurrentScene;
            SceneManager.SceneToShow = scene;
            SceneManager.IsInTransition = true;
            SceneManager.TransitionCounter = 0;
            SceneManager.TransitionFadeValue = 0;
        }
        else
            SceneManager.CurrentScene = scene;
    }

    static Update(deltaTime) {
        SceneManager.CurrentScene.Update(deltaTime);
        if (SceneManager.IsInTransition)
            SceneManager.UpdateTransition();
    }

    static Draw(context) {
        SceneManager.CurrentScene.Draw(context);

        if (SceneManager.IsInTransition)
            SceneManager.DrawTransition(context);
    }

    static UpdateTransition() {
        SceneManager.TransitionCounter++;

        let alpha = -(9.81 / SceneManager.L) * Math.sin(SceneManager.theta); // calculate angular acceleration
        SceneManager.omega += alpha * SceneManager.dt; // update angular velocity
        SceneManager.theta += SceneManager.omega * SceneManager.dt; // update angle

        // Calculate position of left edge of the pendulum
        SceneManager.ballX = SceneManager.pivotX + Math.sin(SceneManager.theta) * SceneManager.L;
        SceneManager.ballY = SceneManager.pivotY + Math.cos(SceneManager.theta) * SceneManager.L;

        if (SceneManager.theta >= Math.PI / 2) {
            SceneManager.CurrentScene = SceneManager.SceneToShow;
            SceneManager.SceneToHide = null;
            SceneManager.SceneToShow = null;
        }
        if (SceneManager.theta <= -Math.PI / 2) {
            SceneManager.IsInTransition = false;
            SceneManager.TransitionCounter = 0;
            SceneManager.TransitionFadeValue = 0;
        }
    }

    static DrawTransition(context) {

        context.fillStyle = "#660066";
        context.beginPath();
        context.moveTo(0, 0);
        if (SceneManager.ballX <= Game.Canvas.width / 2) {
            // If pendulum is on left side of screen, fill only above the pendulum
            context.lineTo(SceneManager.pivotX, 0);
            context.lineTo(SceneManager.pivotX + Math.sin(SceneManager.theta) * 2 * SceneManager.L, SceneManager.pivotY + Math.cos(SceneManager.theta) * 2 * SceneManager.L);
            context.lineTo(0, SceneManager.pivotY + Math.cos(SceneManager.theta) * 2 * SceneManager.L);
            context.lineTo(0, 0);
        } else {
            context.lineTo(SceneManager.pivotX, 0);
            context.lineTo(SceneManager.pivotX + Math.sin(SceneManager.theta) * 2 * SceneManager.L, SceneManager.pivotY + Math.cos(SceneManager.theta) * 2 * SceneManager.L);
            context.lineTo(Game.Canvas.width, Game.Canvas.height);
            context.lineTo(0, Game.Canvas.height);
            context.lineTo(0, 0);
        }

        context.closePath();
        context.fill();

        // Draw pendulum
        context.fillStyle = "#ff0066";
        context.beginPath();
        context.arc(SceneManager.ballX, SceneManager.ballY, SceneManager.ballRadius, 0, 2 * Math.PI);
        context.fill();
        context.strokeStyle = "#ff0066";

        context.beginPath();
        context.lineWidth = 5;
        context.moveTo(SceneManager.pivotX, SceneManager.pivotY);
        context.lineTo(SceneManager.ballX, SceneManager.ballY);
        context.stroke();
    }
};
export { SceneManager };