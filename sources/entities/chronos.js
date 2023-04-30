import { Assets } from '../assets/assets.js';
import { Mesh, MeshBasicMaterial, BoxGeometry, Box3, AnimationClip, LoopOnce, Vector3, Box3Helper } from '../../libs/three.module.js';
import { Explosion } from '../particles/explosion.js';
import { Health } from '../controls/health.js';

export class Chronos {
    constructor(scene, x = 10, y = 61.5, z = 19) {
        this.Scene = scene;
        this.Mesh = Assets.ChronosAttacking.GLBScene;
        this.Mesh.position.set(x, y, z);
        scene.add(this.Mesh);

        this.Bullets = [];
        this.Counter = 0;
        this.Explosions = [];
        this.CollisionBox = new Box3().setFromCenterAndSize(new Vector3(x, y + 1.5, z), new Vector3(1, 3, 1));
        this.Health = 100;
        this.HealthStatus = new Health(scene, this.Mesh.position);


        this.IsHit = false;
        this.CanBeHit = true;
        this.CanBeHitCounter = 0;
    }


    Update(deltaTime, player, camera) {
        if (this.IsHit) {
            this.CanBeHitCounter++
            this.CanBeHit = false;
            this.Mesh.visible = !this.Mesh.visible;
        }

        if (this.IsHit && !this.CanBeHit && this.CanBeHitCounter === 60) {
            this.IsHit = false;
            this.CanBeHit = true;
            this.CanBeHitCounter = 0;
        }

        this.Bullets.forEach((bullet, index) => {
            if (bullet.Remove) this.Bullets.splice(index, 1);
            bullet.Update(deltaTime, player)
        });

        if (this.Mesh.position.distanceTo(player.Mesh.position) < 17) {
            if (!((this.Counter++) % 120)) {
                this.Bullets.push(new Bullet(this.Scene, new Vector3(this.Mesh.position.x, this.Mesh.position.y + 1, this.Mesh.position.z), this.Mesh.rotation, this))
            }
            this.Mesh.lookAt(player.Mesh.position);
        }

        this.Explosions.forEach((explosion, index) => {
            explosion.Update(deltaTime);
            if (explosion.Particles.length === 0) {
                this.Explosions.splice(index, 1);
            }
        });
        this.HealthStatus.Update(this.Mesh.position, this.Health, camera);
    }

}

class Bullet {
    constructor(scene, position, rotation, chronos) {
        this.Scene = scene;
        this.Chronos = chronos;
        this.Mesh = new Mesh(new BoxGeometry(.5, .5, .5), new MeshBasicMaterial({ color: 0x1C98DA }));
        this.Mesh.position.copy(position);
        this.Mesh.rotation.copy(rotation);
        scene.add(this.Mesh);
    }

    Update(deltaTime, player) {
        this.Mesh.translateZ(15 * deltaTime);
        if (this.Mesh.position.distanceTo(player.Mesh.position) < 1.2) {
            this.Kill();
            player.Health -= 5;
            player.IsHit = true;
            Assets.DamageSound.Play();
            this.Chronos.Explosions.push(new Explosion(this.Scene, player.Mesh.position, .5));
        }

    }

    Kill() {
        this.Remove = true;
        this.Scene.remove(this.Mesh);
    }
}