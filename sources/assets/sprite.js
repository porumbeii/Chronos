"use strict";
import { Assets } from "./assets.js";

class Sprite {

    constructor(source) {

        this.Source = source;
        this.PercentageLoaded = 0;
        this.IsLoaded = false;

        this.XMLHttpRequest = new XMLHttpRequest();
        this.XMLHttpRequest.open('GET', source, true);
        this.XMLHttpRequest.responseType = 'blob';

        this.XMLHttpRequest.onload = function (event) {
            if (this.XMLHttpRequest.status === 200) {
                var blob = this.XMLHttpRequest.response;
                var reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = function () {
                    this.Image = new Image();
                    this.Image.src = reader.result;
                    this.IsLoaded = true;
                }.bind(this);
            }
        }.bind(this);

        this.XMLHttpRequest.onprogress = function (event) {
            if (event.lengthComputable)
                this.PercentageLoaded = Math.round((event.loaded / event.total) * 100);
        }.bind(this);

        this.XMLHttpRequest.send();

        Assets.Items.push(this);

    }

};
export { Sprite };