"use strict";
import { Assets } from '../assets/assets.js';
import { Scene, WebGLRenderer, DirectionalLight, Box3, AmbientLight, Color, FogExp2, Vector3, MeshStandardMaterial } from '../../libs/three.module.js';
import { Player } from '../entities/player.js';
import { ThirdPersonCamera } from '../core/thirdPersonCamera.js';
import { Hod } from '../core/hod.js';
import { Coins } from "../entities/coins.js";
import { RisingBubbles } from "../particles/risingBubbles.js";
import { Fountain } from '../particles/fountain.js';
import { TimePortal } from '../controls/timePortal.js';
import { SceneManager } from "../scenes/sceneManager.js";
import { TravelThroughTimeScene } from '../scenes/travelThroughTimeScene.js';
import { Blacksmith } from '../entities/blacksmith.js';
import { Agnes } from '../entities/agnes.js';
import { Tutorial } from '../controls/tutorial.js';

export class OlympusBaseScene {
    constructor() {
        this.Scene = new Scene();
        this.Scene.background = new Color(0x33ccff);
        this.Scene.fog = new FogExp2(0x46c0ef, 0.05);
        this.Scene.add(new DirectionalLight(0xFFFFFF, 1.0));
        this.Scene.add(new AmbientLight(0x404040));

        this.Renderer = new WebGLRenderer();
        this.Renderer.setPixelRatio(window.devicePixelRatio);
        this.Renderer.setSize(window.innerWidth, window.innerHeight);

        this.Player = new Player();
        this.Player.Mesh.position.set(60, 3, 22);
        this.Player.Mesh.rotation.y = Math.PI / 2;
        this.Scene.add(this.Player.Mesh);

        this.ThirdPersonCamera = new ThirdPersonCamera(this.Player.Mesh);
        this.ThirdPersonCamera.Camera.position.y = 2;
        this.ThirdPersonCamera.Camera.position.z = 25;

        this.Level = Assets.OlympusBase;
        this.Scene.add(this.Level.GLBScene);
        this.CreateLevelCollisionBoxes();

        this.Coins = new Coins(this.Scene, [new Vector3(34, 1, 20.8), new Vector3(33, 1, 20.8), new Vector3(32, 1, 20.8), new Vector3(15, 1, 0), new Vector3(15, 1, 1), new Vector3(15, 1, 2), new Vector3(21, 1, -28), new Vector3(-10, 1, -12), new Vector3(-4.5, 1, 3.5), new Vector3(-18, 1, 29)]);
        this.Hod = new Hod(this.Player);
        this.Tutorial = new Tutorial(this.Hod);
        this.BridgeIsShown = false;
        this.Bridge = Assets.Bridge.GLBScene;
        this.WaterFall = new RisingBubbles(this.Scene, 20, new Vector3(11, 0, -4), 2, .2, new Vector3(1, 0, 3), .02, 0x6ABDE7, 0xffffff);
        this.Fire = new RisingBubbles(this.Scene, 20, new Vector3(8, 1.6, -11.5), 1, .2, new Vector3(1, 0, 2), .007, 0xff0033, 0xd9ff00);
        this.Fountain = new Fountain(this.Scene, 20, new Vector3(43, 1.5, 18.1));
        this.TimePortal = new TimePortal(this.Scene, new Vector3(-25, 2, -61), 0);
        this.Blacksmith = new Blacksmith(this.Scene, new Vector3(11, .2, -9));
        this.Agnes = new Agnes(this.Scene, new Vector3(-25, 0, -25))

        Assets.OlympusBaseSceneMusic.PlayBackgroundMusic();
    }

    Update(deltaTime) {
        this.Player.Update(deltaTime, this.Scene, this.LevelCollisionBoxes, this.Coins);
        this.ThirdPersonCamera.Update(deltaTime, this.Player.Mesh.position, this.Level.GLBScene.children);
        this.WaterFall.Update(deltaTime);
        this.Fire.Update(deltaTime);
        this.Fountain.Update(deltaTime);
        this.Hod.Update(deltaTime);
        this.TimePortal.Update(deltaTime);
        this.Blacksmith.Update(this.Player.Mesh, this.ThirdPersonCamera.Camera);
        this.Agnes.Update(this.Player.Mesh, this.ThirdPersonCamera.Camera, this.BridgeIsShown);
        this.Coins.Update(deltaTime, this.Scene, this.Player);
        if (!this.Tutorial.IsEnded) this.Tutorial.Update(deltaTime);
        if (this.Player.CollisionBox.intersectsBox(this.TimePortal.CollisionBox) && !SceneManager.IsInTransition) { this.Player.IsActive = false; SceneManager.ShowScene(new TravelThroughTimeScene(), true) };
        if (this.Player.Coins === 10 && !this.BridgeIsShown) {
            this.Bridge.position.set(-25, 0, -41.3);
            this.Scene.add(this.Bridge);
            this.LevelCollisionBoxes.push(new Box3().setFromObject(this.Bridge));
            this.BridgeIsShown = true;
            this.ThirdPersonCamera.Target = this.Bridge;
            this.Player.IsActive = false;
            this.Hod.ShowBlackBars();
            setTimeout(() => { this.ThirdPersonCamera.Target = this.Player.Mesh; this.Hod.HideBlackBars(); this.Player.IsActive = true; }, 4000);
        }
        if (this.Player.Mesh.position.y < -3 && !SceneManager.IsInTransition) {
            this.Player.IsActive = false;
            Assets.EasySound.Play();
            SceneManager.ShowScene(new OlympusBaseScene(), true);
        }
    }

    Draw(context) {
        this.Renderer.render(this.Scene, this.ThirdPersonCamera.Camera);
        context.drawImage(this.Renderer.domElement, 0, 0);
        this.Hod.Draw(context);
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