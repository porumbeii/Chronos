"use strict";
import { Lava } from "../controls/lava.js";
import { Scene, WebGLRenderer, DirectionalLight, AmbientLight, Color, FogExp2, PerspectiveCamera, SpotLight, Vector3 } from '../../libs/three.module.js';
import { Assets } from "../assets/assets.js";
import { RisingBubbles } from "../particles/risingBubbles.js";
import { Keyboard } from "../core/input.js";
import { SceneManager } from "../scenes/sceneManager.js";
import { SpeachBubble } from "../controls/speachBubble.js";
import { OlympusBaseScene } from "../scenes/olympusBaseScene.js";
import { TypeWriter } from "../controls/typewriter.js";


export class TartarusScene {
    constructor() {
        this.Scene = new Scene();
        this.Scene.background = new Color(0x000000);
        this.Scene.fog = new FogExp2(0x000000, 0.1);
        this.Scene.add(new DirectionalLight(0xFFFFFF, 1.0));
        this.Scene.add(new AmbientLight(0xFFFFFF));

        const spotLight = new SpotLight(0xffffff);
        spotLight.position.set(19, 2, 10);
        this.Scene.add(spotLight);

        this.Camera = new PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.Camera.position.set(20, 5, 22);
        this.Camera.rotation.x = -Math.PI / 8;

        this.Renderer = new WebGLRenderer();
        this.Renderer.setPixelRatio(window.devicePixelRatio);
        this.Renderer.setSize(window.innerWidth, window.innerHeight);

        this.Lava = new Lava(this.Scene);
        this.CurrentLavaRow = this.Lava.Rows - 1;
        this.CurrentPosition = 0;

        this.Chronos = Assets.Chronos.GLBScene;
        this.Chronos.position.set(19, 2, 13)
        this.ChronosAngle = 0;
        this.Scene.add(this.Chronos);

        this.SpeachBubble = new SpeachBubble(this.Scene, this.Chronos.position, new Vector3(0, 5, 2));
        this.Bubbles = new RisingBubbles(this.Scene, 100, this.Chronos.position.clone(), 5, .2, new Vector3(10, 0, 10));

        this.SpeachBubbleLines = [
            "Hello traveler!",
            "Welcome to Tartarus!",
            "Please whatch your step! This is lava!",
            "I'm Chronos, the titan of time.",
            "Is Tartarus unescapable?",
            "No. Wrong!",
            "Once I get out of this damn dungeon...",
            "I will veil the world in darkness and chaos!",
            "You only have one hope: the Anaklusmos sword!",
            "But nobody have seen it for 5000 years!",
            "Anyway, expect me soon...",
            "We will meet again, Hercules, at your funeral!",
            "Press enter to wake up!"
        ];
        this.SpeachBubble.ShowText(this.SpeachBubbleLines[0]);
        this.CurrentSpeachBubbleLine = 1;

        Assets.TartarusSceneMusic.PlayBackgroundMusic();

        this.TypeWriter = new TypeWriter(window.innerWidth / 2, window.innerHeight - 100, "center");
        this.Counter = 0;
    }

    Update(deltaTime) {
        this.Counter++;

        if (this.Counter == 100)
            this.TypeWriter.ShowText("press s to advance text");
        if (this.Counter == 1000 || Keyboard.Say)
            this.TypeWriter.ShowText("");

        this.TypeWriter.Update();
        if (Keyboard.Say && this.CurrentSpeachBubbleLine < this.SpeachBubbleLines.length) {
            if (this.SpeachBubble.IsShown) {
                this.SpeachBubble.ShowText(this.SpeachBubbleLines[this.CurrentSpeachBubbleLine]);
                this.CurrentSpeachBubbleLine++;
            }
        }

        if (Keyboard.Enter && !SceneManager.IsInTransition) {
            SceneManager.ShowScene(new OlympusBaseScene(), true);
        }

        this.CurrentPosition -= 2;
        this.Camera.position.z -= .02;
        //     this.SpeachBubble.Mesh.position.z -= .02;
        this.Bubbles.position.z -= .02;

        if (this.CurrentPosition % 100 === 0) {
            this.Lava.Boxes[this.CurrentLavaRow].forEach(box => { box.Mesh.position.z -= 20; });
            this.CurrentLavaRow--;
            if (this.CurrentLavaRow < 0)
                this.CurrentLavaRow = this.Lava.Rows - 1;
        }

        this.Lava.Update(deltaTime);

        this.Bubbles.Update(deltaTime);

        this.Chronos.position.z -= .02;
        this.ChronosAngle += .01;
        this.Chronos.position.y = Math.sin(this.ChronosAngle) - 1.5;

        this.SpeachBubble.Update(this.Chronos.position, this.Camera)
    }

    Draw(context) {
        this.Renderer.render(this.Scene, this.Camera);
        context.drawImage(this.Renderer.domElement, 0, 0);
        this.TypeWriter.Draw(context);
    }
};