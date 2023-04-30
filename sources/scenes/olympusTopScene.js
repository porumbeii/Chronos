"use strict";
import { Assets } from '../assets/assets.js';
import { Scene, WebGLRenderer, DirectionalLight, Box3, AmbientLight, Color, FogExp2, PointLight, Vector3, MeshStandardMaterial } from '../../libs/three.module.js';
import { Player } from '../entities/player.js';
import { ThirdPersonCamera } from '../core/thirdPersonCamera.js';
import { CyclopeGun } from '../entities/cyclopeGun.js';
import { Hod } from '../core/hod.js';
import { Coins } from '../entities/coins.js';
import { RisingBubbles } from "../particles/risingBubbles.js";
import { SceneManager } from "../scenes/sceneManager.js";
import { BigBenScene } from "../scenes/bigbenScene.js";
import { TypeWriter } from "../controls/typewriter.js";

export class OlympusTopScene {
    constructor() {
        Assets.OlympusTopSceneMusic.PlayBackgroundMusic();

        this.Scene = new Scene();
        this.Scene.background = new Color(0x000000);
        this.Scene.fog = new FogExp2(0x000000, 0.05);
        this.Scene.add(new DirectionalLight(0xFFFFFF, .5));
        this.Scene.add(new AmbientLight(0xFFFFFF, .5));

        this.PointLight = new PointLight(0xffffff, 1, 10);
        this.PointLight.position.set(29.6, 2.5, 0);
        this.Scene.add(this.PointLight);
        this.LightIntensity = 1;

        this.Renderer = new WebGLRenderer();
        this.Renderer.setPixelRatio(window.devicePixelRatio);
        this.Renderer.setSize(window.innerWidth, window.innerHeight);

        this.Player = new Player(this.Scene);
        this.Player.Mesh.position.set(0, 10, 0);
        this.Scene.add(this.Player.Mesh);

        this.Hod = new Hod(this.Player);

        this.Level = Assets.OlympusTop;
        this.Scene.add(this.Level.GLBScene);
        this.CreateLevelCollisionBoxes()

        this.Coins = new Coins(this.Scene, [new Vector3(24, 1, 0), new Vector3(25, 1, 0), new Vector3(26, 1, 0), new Vector3(27, 1, 0)]);

        this.Enemies = [new CyclopeGun(this.Scene, 60, 1.5, 0), new CyclopeGun(this.Scene, 80, 1.5, 20), new CyclopeGun(this.Scene, 80, 1.5, -20), new CyclopeGun(this.Scene, 40, 1.5, 20), new CyclopeGun(this.Scene, 40, 1.5, -20), new CyclopeGun(this.Scene, 82, 1.5, 0)];

        this.Sword = Assets.Sword.GLBScene;
        this.Sword.position.set(110, 7, 0);
        this.Scene.add(this.Sword);
        this.SwordCollisionBox = new Box3().setFromObject(this.Sword);
        this.SwordLight = new PointLight(0xffffff, 1, 10);
        this.SwordLight.position.set(110, 8, 0);
        this.Scene.add(this.SwordLight);

        this.ThirdPersonCamera = new ThirdPersonCamera(this.Player.Mesh);
        this.ThirdPersonCamera.Camera.position.set(0, 0, 25);

        this.FireRight = new RisingBubbles(this.Scene, 20, new Vector3(29.6, 2.5, 2.9), 1, .2, new Vector3(1, 0, 1), .007, 0xff0033, 0xd9ff00);
        this.FireLeft = new RisingBubbles(this.Scene, 20, new Vector3(29.6, 2.5, -3), 1, .2, new Vector3(1, 0, 1), .007, 0xff0033, 0xd9ff00);

        this.TypeWriter = new TypeWriter(window.innerWidth / 2, window.innerHeight - 100, "center");
        this.Counter = 0;
    }

    Update(deltaTime) {
        if (Math.random() < .2) {
            this.LightIntensity = (this.LightIntensity == 1) ? 0.5 : 1;
            this.PointLight.intensity = this.LightIntensity;
        }

        this.Counter++;
        if (this.Counter === 100)
            this.TypeWriter.ShowText("This place looks dangerous!");
        if (this.Counter === 300)
            this.TypeWriter.ShowText("It's probably Olympus!");
        if (this.Counter === 500)
            this.TypeWriter.ShowText("I need to find the Anaklusmos sword!");
        if (this.Counter === 800)
            this.TypeWriter.ShowText("");

        this.TypeWriter.Update();
        this.Player.Update(deltaTime, this.Scene, this.LevelCollisionBoxes, this.Coins);
        this.Coins.Update(deltaTime, this.Scene, this.Player);
        this.Enemies.forEach(enemy => { enemy.Update(deltaTime, this.Player, this.Scene) });
        this.FireRight.Update(deltaTime);
        this.FireLeft.Update(deltaTime);
        this.ThirdPersonCamera.Update(deltaTime, this.Level.GLBScene.children);
        this.Hod.Update(deltaTime);

        this.Sword.rotation.y += .02;

        if ((this.Player.Health <= 0) && !SceneManager.IsInTransition) {
            this.Player.IsActive = false;
            Assets.EasySound.Play();
            SceneManager.ShowScene(new OlympusTopScene(), true);
        }

        if (this.Player.Mesh.position.y < -3 && !SceneManager.IsInTransition) {
            Assets.EasySound.Play();
            this.Player.IsActive = false;
            SceneManager.ShowScene(new OlympusTopScene(), true);
        }
        if (this.Player.CollisionBox.intersectsBox(this.SwordCollisionBox) && !SceneManager.IsInTransition) {
            this.Player.IsActive = false;
            SceneManager.ShowScene(new BigBenScene(), true);
        }
    }

    Draw(context) {
        this.Renderer.render(this.Scene, this.ThirdPersonCamera.Camera);
        context.drawImage(this.Renderer.domElement, 0, 0);
        this.Hod.Draw(context);
        this.TypeWriter.Draw(context);
    }

    CreateLevelCollisionBoxes() {
        this.LevelCollisionBoxes = [];
        for (let index = 0; index < this.Level.GLBScene.children.length; index++) {
            const child = this.Level.GLBScene.children[index];
            this.LevelCollisionBoxes.push(new Box3().setFromObject(child));
            if (child.isMesh) {
                const material = new MeshStandardMaterial();
                material.color = new Color(child.material.color.r, child.material.color.g, child.material.color.b);
                material.transparent = true;
                child.material = material;
            }
            if (child.isGroup) {
                child.children.forEach(groupChild => {
                    if (groupChild.isMesh) {
                        const groupchildmaterial = new MeshStandardMaterial();
                        groupchildmaterial.color = new Color(groupChild.material.color.r, groupChild.material.color.g, groupChild.material.color.b);
                        groupchildmaterial.transparent = true;
                        groupChild.material = groupchildmaterial;
                    }
                });
            }
        }
    }
};