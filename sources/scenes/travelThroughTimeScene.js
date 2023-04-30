"use strict";
import { OlympusTopScene } from '../scenes/olympusTopScene.js';
import { SceneManager } from "../scenes/sceneManager.js";
import { TypeWriter } from "../controls/typewriter.js";
import { Assets } from '../assets/assets.js';

export class TravelThroughTimeScene {
    constructor() {
        Assets.TravelthroughtimeSceneMusic.Play();
        this.size = 5;
        this.years = [];
        this.Width = window.innerWidth;
        this.Height = window.innerHeight;
        this.HalfWidth = this.Width / 2;
        this.HalfHeight = this.Height / 2;
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                let year = {};
                year.text = Math.trunc(Math.random() * 3000);
                year.position = {
                    x: (i - this.size / 2) * this.size,
                    y: (j - this.size / 2) * this.size,
                    z: Math.random() * this.size * 10
                }
                year.origin = { x: year.position.x, y: year.position.y, z: year.position.z }
                year.speed = Math.random() * 2 + 1;
                year.needsDigitUpdate = Math.round(Math.random() * 5) + 5;
                this.years.push(year);
            }
        }
        this.TypeWriter = new TypeWriter(window.innerWidth / 2, window.innerHeight - 100, "center");
        this.Counter = 0;
    }

    Update(deltatime) {
        this.Counter++;
        if (this.Counter === 200)
            this.TypeWriter.ShowText("Oh, no! The time runs backward!");
        if (this.Counter === 600)
            SceneManager.ShowScene(new OlympusTopScene(), true);
        this.years.forEach(year => {
            year.position.z -= year.speed;
            year.text -= 1;
            year.scale = this.HalfWidth / (this.HalfWidth + year.position.z);
            year.x = (year.position.x * year.scale) + this.HalfWidth;
            year.y = (year.position.y * year.scale) + this.HalfHeight;
            if (year.position.z < -this.HalfWidth / 1.05) {
                year.position.z = Math.random() * this.size;
            }
        });
        this.TypeWriter.Update();

    }

    Draw(context) {
        context.shadowColor = 'black';
        context.shadowOffsetX = 3;
        context.shadowOffsetY = 3;
        context.fillStyle = "rgb(51, 204, 255)";
        context.fillRect(0, 0, this.Width, this.Height);
        context.fillStyle = 'white';
        this.years.sort((a, b) => a.scale - b.scale);
        this.years.forEach(year => {
            context.font = `${year.scale * 10}px 'Default'`
            context.fillText(year.text, year.x, year.y);
        });
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;

        this.TypeWriter.Draw(context);
    }
}