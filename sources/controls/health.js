import { PlaneGeometry, CanvasTexture, MeshBasicMaterial, Mesh, Vector3 } from '../../libs/three.module.js';

export class Health {
    constructor(scene, targetPosition, offset = new Vector3(0, 3.5, 0)) {
        this.Canvas = document.createElement('canvas');
        this.Context = this.Canvas.getContext('2d');
        this.Canvas.width = 100;
        this.Canvas.height = 20;
        this.Texture = new CanvasTexture(this.Canvas);
        this.Geometry = new PlaneGeometry(1, .2);
        this.Material = new MeshBasicMaterial({ map: this.Texture, transparent: true, alphaTest: 1 });
        this.Mesh = new Mesh(this.Geometry, this.Material);
        this.Offset = offset;
        this.Mesh.position.copy(targetPosition.clone()).add(offset);
        scene.add(this.Mesh);
        this.PreviousValue = 0;
    }
    Update(targetPosition, value, camera) {
        this.Mesh.position.copy(targetPosition.clone()).add(this.Offset);
        this.Context.clearRect(0, 0, 100, 20);
        this.Context.fillStyle = 'white';
        this.Context.fillRect(0, 0, 100, 20);
        this.Context.lineWidth = 10;
        this.Context.lineCap = "square"
        this.Context.strokeStyle = 'black';
        this.Context.strokeRect(0, 0, 100, 20);
        this.Context.fillStyle = "green";
        this.Context.fillRect(5, 5, value - 10, 10);
        this.Mesh.lookAt(camera.position);
        this.PreviousValue = value;
        this.Texture.needsUpdate = true;
    }
}