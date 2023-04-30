"use strict";

export class Keyboard {
    static Up = false;
    static Down = false;
    static Left = false;
    static Right = false;
    static Space = false;
    static Escape = false;
    static Enter = false;
    static Say = false;

    static UpdateKeys(code, val) {
        switch (code) {
            case 65: Keyboard.Left = val; break;
            case 87: Keyboard.Up = val; break;
            case 68: Keyboard.Right = val; break;
            case 32: Keyboard.Space = val; break;
            case 27: Keyboard.Escape = val; break;
            case 13: Keyboard.Enter = val; break;
            case 83: Keyboard.Say = val; break;
            default: break;
        }
    }
}
