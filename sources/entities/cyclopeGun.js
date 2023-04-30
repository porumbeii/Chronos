import { Assets } from '../assets/assets.js';
import { Box3, Vector3, Color, AnimationMixer, AnimationClip, LoopOnce } from '../../libs/three.module.js';
import { Explosion } from '../particles/explosion.js';

export class CyclopeGun {
    constructor(scene, x, y, z) {
        this.Mesh = Assets.Cyclope.GLBScene.clone();
        this.Mesh.children.forEach((child => {
            if (child.name === "arrow")
                this.Arrow = child;
            if (child.name === "top")
                this.Top = child;
        }).bind(this));

        this.ArrowPosition = new Vector3();
        this.ArrowPosition.copy(this.Arrow.position);

        this.TopColor = this.Top.material.color;

        this.Mesh.position.set(x, y, z);
        this.Mesh.rotation.set(0, 0, 0);
        scene.add(this.Mesh);

        this.ArrowDistance = 0;
        this.CollisionBox = new Box3().setFromObject(this.Mesh);
        this.ArrowCollisionBox = new Box3();

        this.State = CyclopeGunState.CanShoot;
        this.PreparingToShootCounter = 0;

        this.Explosion = null;
        this.PlayerIsHit = false;
        this.PreviousAngle = 0;

        this.MeshRotationAngle = 0;

        this.Mixer = new AnimationMixer(this.Mesh);
        this.Clips = Assets.Cyclope.Animations;

        this.RotateClip = AnimationClip.findByName(this.Clips, 'rotate');
        this.RotateAction = this.Mixer.clipAction(this.RotateClip);
        this.RotateAction.setLoop(LoopOnce);
    }


    Update(deltaTime, player, scene) {
        this.MeshRotationAngle = Math.atan2(this.Mesh.position.x - player.Mesh.position.x, this.Mesh.position.z - player.Mesh.position.z);
        if (this.Mesh.rotation.y !== this.MeshRotationAngle) {
            this.Mesh.rotation.y = this.MeshRotationAngle;
            if (!this.RotateAction.isRunning()) {
                this.RotateAction.reset();
                this.RotateAction.play();
            }
        }
        let distancetoPlayer = this.Mesh.position.distanceTo(player.Mesh.position);

        this.CollisionBox.setFromObject(this.Mesh);

        if (distancetoPlayer < 15) {
            if (this.State === CyclopeGunState.CanShoot) {
                this.State = CyclopeGunState.PreparingToShoot;
                this.PreparingToShootCounter = 0;
                this.PlayerIsHit = false;
                this.ArrowDistance = 0;
            }
        }

        if (this.State === CyclopeGunState.PreparingToShoot) {
            this.PreparingToShootCounter += 1;

            if (this.PreparingToShootCounter % 8 === 0)
                this.Top.material.color = new Color(255, 255, 255);
            else
                this.Top.material.color = this.TopColor;

            if (this.PreparingToShootCounter > 64) {
                this.State = CyclopeGunState.IsShooting;
                this.Top.material.color = this.TopColor;
                this.CosArrowAngle = Math.cos(this.Mesh.rotation.y * 0.0174 + Math.PI);
                this.SinArrowAngle = Math.sin(this.Mesh.rotation.y * 0.0174 + Math.PI);
            }
        }

        if (this.State === CyclopeGunState.IsShooting) {
            this.ArrowDistance += deltaTime;
            this.Arrow.position.z += this.ArrowDistance * this.CosArrowAngle;
            this.Arrow.position.x += this.ArrowDistance * this.SinArrowAngle;

            this.ArrowCollisionBox.setFromObject(this.Arrow);
            if (this.ArrowCollisionBox.intersectsBox(player.CollisionBox) && !this.PlayerIsHit) {
                Assets.DamageSound.Play();
                player.Health -= 50;
                this.PlayerIsHit = true;
                this.Explosion = new Explosion(scene, player.Mesh.position, .5);
            }

            if (this.ArrowDistance > 5) {
                this.State = CyclopeGunState.CanShoot;
                this.Arrow.position.copy(this.ArrowPosition);
                this.ArrowDistance = 0;
            }
        }
        if (this.Explosion)
            this.Explosion.Update(deltaTime);

        this.Mixer.update(deltaTime);

    }
}
const CyclopeGunState = { CanShoot: 0, PreparingToShoot: 1, IsShooting: 2 };
