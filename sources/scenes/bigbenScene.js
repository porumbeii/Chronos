"use strict";
import { Assets } from '../assets/assets.js';
import { Scene, WebGLRenderer, DirectionalLight, Box3, AmbientLight, Color, FogExp2, Vector3, MeshStandardMaterial, Box3Helper } from '../../libs/three.module.js';
import { Player } from '../entities/player.js';
import { ThirdPersonCamera } from '../core/thirdPersonCamera.js';
import { Hod } from '../core/hod.js';
import { Chronos } from '../entities/chronos.js';
import { Explosion } from '../particles/explosion.js';
import { TypeWriter } from "../controls/typewriter.js";
import { HealthBumps } from '../entities/healthbumps.js';

import { EndingScene } from './endingScene.js';
import { SceneManager } from "./sceneManager.js";
export class BigBenScene {
    constructor(level) {
        Assets.BigbenSceneMusic.PlayBackgroundMusic();

        this.Scene = new Scene();
        this.Scene.background = new Color(0x46c0ef);
        this.Scene.fog = new FogExp2(0x46c0ef, 0.05);
        this.Scene.add(new DirectionalLight(0xFFFFFF, 1.0));
        this.Scene.add(new AmbientLight(0x404040));

        this.Renderer = new WebGLRenderer();
        this.Renderer.setPixelRatio(window.devicePixelRatio);
        this.Renderer.setSize(window.innerWidth, window.innerHeight);

        this.Player = new Player(this.Scene, true);
        // this.Player.Mesh.position.set(13, 60, 2);
        this.Player.Mesh.position.set(0, 3, 0);
        //this.Player.Mesh.rotation.y = Math.PI / 2;
        this.Scene.add(this.Player.Mesh);

        this.Chronos = new Chronos(this.Scene);

        this.Hod = new Hod(this.Player);

        this.Level = Assets.BigBen;
        this.Scene.add(this.Level.GLBScene);
        this.CreateLevelCollisionBoxes();

        this.ThirdPersonCamera = new ThirdPersonCamera(this.Player.Mesh);
        this.ThirdPersonCamera.Camera.position.y = 2;
        this.ThirdPersonCamera.Camera.position.z = 25;
        this.Enemies = [];
        this.Pendulum = [];
        this.Explosions = [];

        this.TypeWriter = new TypeWriter(window.innerWidth / 2, window.innerHeight - 100, "center");
        this.Counter = 0;

        this.HealthBumps = new HealthBumps(this.Scene, [new Vector3(17, 36.5, 0), new Vector3(13, 60.5, 0)]);
    }

    Update(deltaTime) {
        this.Counter++;
        if (this.Counter === 50)
            this.TypeWriter.ShowText("What happened?!");
        if (this.Counter === 300)
            this.TypeWriter.ShowText("Chronos have found out that I have the sword?");
        if (this.Counter === 800)
            this.TypeWriter.ShowText("What is happening with the time?");
        if (this.Counter === 1200)
            this.TypeWriter.ShowText("");
        this.TypeWriter.Update(deltaTime);

        this.Chronos.Update(deltaTime, this.Player, this.ThirdPersonCamera.Camera)

        this.LevelCollisionHelperBoxes = [];
        this.LevelCollisionBoxes = [];
        for (let index = 0; index < this.Level.GLBScene.children.length; index++) {
            const child = this.Level.GLBScene.children[index];
            if (!child.NoCollision)
                this.LevelCollisionBoxes.push(new Box3().setFromObject(child));

            if (child.name.indexOf('Pendulum') == 0) {
                child.rotation.z = Math.sin(Date.now() / 200) * 1.5
            }

            if (child.name.indexOf('Hand') == 0) {
                child.rotation.y += Math.sin(Date.now()) ** 4 * deltaTime * 3;
            }
            if (child.name.indexOf('Danger') > -1) {
                child.position.z += Math.sin(Date.now() / 500) * .1;
                if (this.Player.Mesh.position.distanceTo(child.position) < 1.2) {
                    this.Player.Mesh.position.z += Math.sin(Date.now() / 500) * .1;
                }
            }
            if (child.children[0] && child.children[0].name.indexOf('PendulumWeight') == 0) {
                const boundingBox = new Box3();
                boundingBox.setFromObject(child);
                if (boundingBox.intersectsBox(this.Player.CollisionBox)) {
                    if (this.Player.CanBeHit) {
                        this.Player.Health -= 5;
                        this.Player.IsHit = true;
                        Assets.DamageSound.Play();
                        this.Explosions.push(new Explosion(this.Scene, this.Player.Mesh.position, .5));
                    }
                }
            }
        }

        this.HealthBumps.Update(deltaTime, this.Scene, this.Player);

        this.Player.Update(deltaTime, this.Scene, this.LevelCollisionBoxes);

        for (let enemy of this.Enemies)
            enemy.Update(deltaTime, this.Player, this.LevelCollisionBoxes);

        this.ThirdPersonCamera.Update(deltaTime, this.Level.GLBScene.children);

        if (this.Player.Mesh.position.y < -3 && !SceneManager.IsInTransition) {
            Assets.EasySound.Play();
            this.Player.IsActive = false;
            SceneManager.ShowScene(new BigBenScene(), true);
        }

        this.Explosions.forEach((explosion, index) => {
            explosion.Update(deltaTime);
            if (explosion.Particles.length === 0) {
                this.Explosions.splice(index, 1);
            }
        });

        let swordBox = new Box3().setFromObject(this.Player.Sword);
        if (this.Player.Sword) {
            if (swordBox.intersectsBox(this.Chronos.CollisionBox)) {
                if (this.Chronos.CanBeHit) {
                    this.Chronos.Health -= 30;
                    this.Chronos.IsHit = true;
                    Assets.HitChronosSound.Play();
                }
            }
        }

        if (this.Player.Health <= 0 && !SceneManager.IsInTransition) {
            this.Player.IsActive = false;
            SceneManager.ShowScene(new BigBenScene(), true);
        }

        if (this.Chronos.Health <= 0 && !SceneManager.IsInTransition) {
            this.Player.IsActive = false;
            SceneManager.ShowScene(new EndingScene(), true);
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