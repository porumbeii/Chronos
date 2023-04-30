"use strict";
import { Scene, WebGLRenderer, DirectionalLight, AmbientLight, Color, FogExp2, Box3, MeshStandardMaterial } from '../../libs/three.module.js';
import { Assets } from "../assets/assets.js";
import { TypeWriter } from "../controls/typewriter.js";
import { Player } from '../entities/player.js';
import { ThirdPersonCamera } from '../core/thirdPersonCamera.js';

export class EndingScene {
    constructor() {
        Assets.OlympusTopSceneMusic.PlayBackgroundMusic();
        this.Scene = new Scene();
        this.Scene.background = new Color(0x33ccff);
        this.Scene.fog = new FogExp2(0x46c0ef, 0.02);
        this.Scene.add(new DirectionalLight(0xFFFFFF, 1.0));
        this.Scene.add(new AmbientLight(0x404040));

        this.Renderer = new WebGLRenderer();
        this.Renderer.setPixelRatio(window.devicePixelRatio);
        this.Renderer.setSize(window.innerWidth, window.innerHeight);

        this.Player = new Player(this.Scene, true);
        this.Player.Mesh.position.set(-5, 80, -5);
        this.Player.Mesh.rotation.y = Math.PI / 2;
        this.Player.CanMove = false;
        this.Scene.add(this.Player.Mesh);

        this.ThirdPersonCamera = new ThirdPersonCamera(this.Player.Mesh);
        this.ThirdPersonCamera.Camera.position.y = 2;
        this.ThirdPersonCamera.Camera.position.z = 25;

        this.Level = Assets.OlympusBase;
        this.Scene.add(this.Level.GLBScene);
        this.CreateLevelCollisionBoxes();

        this.TypeWriter = new TypeWriter(window.innerWidth / 2, window.innerHeight - 100, "center");
        this.Counter = 0;
        this.Coins = [];
    }
    Update(deltaTime) {
        this.Counter++;
        if (this.Counter === 100)
            this.TypeWriter.ShowText("Wow!");
        if (this.Counter === 300)
            this.TypeWriter.ShowText("Chronos is now gone forever!");
        if (this.Counter === 500)
            this.TypeWriter.ShowText("You've made history, Hercules!");
        this.TypeWriter.Update(deltaTime);
        this.Player.Update(deltaTime, this.Scene, this.LevelCollisionBoxes, this.Coins);
        this.ThirdPersonCamera.Update(deltaTime, this.Player.Mesh.position, this.Level.GLBScene.children);
    }

    Draw(context) {
        this.Renderer.render(this.Scene, this.ThirdPersonCamera.Camera);
        context.drawImage(this.Renderer.domElement, 0, 0);
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
}