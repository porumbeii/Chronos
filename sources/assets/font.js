"use strict";
import { Assets } from './assets.js';

class Font {
    constructor(name, source) {
        this.Source = source;
        this.IsLoaded = false;
        this.PercentageLoaded = 0;

        this.XMLHTTPRequest = new XMLHttpRequest();
        this.XMLHTTPRequest.open('GET', source, true);
        this.XMLHTTPRequest.responseType = 'arraybuffer';

        this.XMLHTTPRequest.onload = function () {
            if (this.XMLHTTPRequest.status === 200) {
                var font = new FontFace(name, this.XMLHTTPRequest.response);
                font.load().then(function (loadedFont) {
                    document.fonts.add(loadedFont);
                    this.IsLoaded = true;
                }.bind(this));
            }
        }.bind(this);

        this.XMLHTTPRequest.onprogress = function (event) {
            if (event.lengthComputable)
                this.PercentageLoaded = Math.round((event.loaded / event.total) * 100);
        }.bind(this);

        Assets.Items.push(this);
        this.XMLHTTPRequest.send();
    }
};
export { Font };