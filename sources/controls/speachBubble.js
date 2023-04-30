import { PlaneGeometry, CanvasTexture, MeshBasicMaterial, Mesh, BoxGeometry, DoubleSide, Vector3 } from '../../libs/three.module.js';

export class SpeachBubble {
    constructor(scene, targetPosition, offset = new Vector3(0, 5, 2)) {
        this.Canvas = document.createElement('canvas');
        this.Context = this.Canvas.getContext('2d');
        this.Canvas.width = 720;
        this.Canvas.height = 52;
        this.Texture = new CanvasTexture(this.Canvas);
        this.Geometry = new PlaneGeometry(7.2, 0.52);
        this.Material = new MeshBasicMaterial({ map: this.Texture, transparent: true, alphaTest: 1 });
        this.Mesh = new Mesh(this.Geometry, this.Material);

        const boxGeometry = new BoxGeometry(1, 1, 1);;
        const material = new MeshBasicMaterial({ color: 0xffff00 });
        const mesh = new Mesh(boxGeometry, material);
        scene.add(mesh);

        this.Offset = offset;
        // mesh.position.copy(position);
        this.Mesh.position.copy(targetPosition.clone()).add(offset);

        scene.add(this.Mesh);
        this.Text = ""
        this.CurrentText = "";
        this.Counter = 0;
        this.IsShown = false;
    }

    ShowText(text) {
        this.Text = text;
        this.CurrentText = "";
        this.Counter = 0;
        this.IsShown = false;
    }

    Update(targetPosition, camera) {
        this.Mesh.position.copy(targetPosition.clone()).add(this.Offset);

        if (!((this.Counter++) % 5)) {

            this.Context.clearRect(0, 0, 720, 52);

            if (this.CurrentText != this.Text) {
                this.CurrentText += this.Text[this.CurrentText.length];
                this.Texture.needsUpdate = true;
            } else this.IsShown = true;

            this.Context.textBaseline = 'middle';
            this.Context.textAlign = 'center';
            this.Context.font = "30px 'Default'";
            let currentTextSize = this.Context.measureText(this.CurrentText);
            let width = currentTextSize.width + 40;

            let height = 45;

            this.Context.fillStyle = 'white';
            this.Context.fillRect(360 - width / 2, 26 - height / 2, width, height);
            this.Context.lineWidth = 5;
            this.Context.lineCap = "square"
            this.Context.strokeStyle = 'black';
            this.Context.strokeRect(360 - width / 2, 26 - height / 2, width, height);

            this.Context.fillStyle = "black";
            this.Context.fillText(this.CurrentText, 360, 26);

            this.Context.clearRect(360 - width / 2 - 7, 26 - height / 2 - 3, 10, 6);
            this.Context.clearRect(360 - width / 2 - 3 + width, 26 - height / 2 - 3, 6, 6);
            this.Context.clearRect(360 - width / 2 - 3 + width, 26 - height / 2 - 3 + height, 6, 6);
            this.Context.clearRect(360 - width / 2 - 3, 26 - height / 2 - 3 + height, 6, 6);

        }
        this.Mesh.lookAt(camera.position);
    }
}