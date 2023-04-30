"use strict";
import { BoxGeometry, MeshBasicMaterial, Mesh, Box3, Vector3, Matrix4, AnimationClip, AnimationMixer } from '../../libs/three.module.js';
import { Keyboard } from '../core/input.js';
import { Assets } from '../assets/assets.js';
import { Particle } from '../particles/particle.js';

class Player {
    static States = { Idle: 'idle', Jump: 'jump', Attack: 'attack' };

    constructor(scene, HasSword = false) {
        this.Mesh = Assets.Hercules.GLBScene;
        const cubeGeometry = new BoxGeometry(0.4, 1.2, 0.4);
        const cubeMaterial = new MeshBasicMaterial({ color: 0xff0000 });
        // Create a new mesh with the cube geometry and material
        this.CollisionMesh = new Mesh(cubeGeometry, cubeMaterial);
        this.CollisionMesh.position.y = .601;
        this.CollisionMesh.material.visible = false;
        this.Mesh.add(this.CollisionMesh);

        this.Mesh.rotation.y = -Math.PI / 2;
        this.CollisionBox = new Box3().setFromObject(this.CollisionMesh);

        this.JumpCurrentTime = 0;
        this.JumpDuration = .5;
        this.JumpHeight = 1.2;
        this.JumpStartHeight = 0;

        this.AttackSpeed = 50;
        this.AttackDuration = .5;
        this.AttackCurrentTime = 0;

        this.ForwardSpeed = 10;
        this.RotationSpeed = 2;
        this.Gravity = 8;
        this.MovementDirection = new Vector3();
        this.PreviousPosition = new Vector3();

        this.Particles = [];

        this.IsAlive = true;
        this.IsOnGround = false;

        this.Health = 100;
        this.Coins = 0;

        this.Mixer = new AnimationMixer(this.Mesh);
        this.Animations = {}
        Assets.Hercules.Animations.forEach(animationClip => {
            let clip = AnimationClip.findByName(Assets.Hercules.Animations, animationClip.name);
            this.Animations[animationClip.name.toLowerCase()] = this.Mixer.clipAction(clip);
        });

        this.PreviousState = null;
        this.SetState(Player.States.Idle);
        this.LastJumpFeet = 1;
        this.IsActive = true;

        this.IsHit = false;
        this.CanBeHit = true;
        this.CanBeHitCounter = 0;


        this.HasSword = HasSword;

        this.Sword = Assets.Sword.GLBScene;

        if (this.HasSword) {
            this.Sword.rotation.x = Math.PI;
            this.Sword.position.set(.4, 4.6, -.6)
            this.Mesh.add(this.Sword);
        }
        this.CanMove = true;
    }

    Update(deltaTime, scene, LevelCollisionBoxes, coins) {

        if (!this.IsActive)
            return;

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

        this.PreviousPosition.copy(this.Mesh.position);
        this.MovementDirection.set(0.0, 0.0, 0.0);
        if (!this.IsOnGround)
            this.MovementDirection.y -= this.Gravity * deltaTime;

        if (Keyboard.Left) this.Mesh.rotation.y += this.RotationSpeed * deltaTime;
        if (Keyboard.Right) this.Mesh.rotation.y -= this.RotationSpeed * deltaTime;

        if (Keyboard.Up && this.CanMove) {
            if (this.State === Player.States.Idle && this.IsOnGround) {
                this.SetState(Player.States.Jump);
                Assets.JumpSound.Play();
                this.JumpCurrentTime = 0;
                this.JumpStartHeight = this.Mesh.position.y;
            }
        }

        if (this.State === Player.States.Jump) {
            this.JumpCurrentTime += deltaTime;
            if (this.JumpCurrentTime <= this.JumpDuration) {
                this.MovementDirection.z = -this.ForwardSpeed * deltaTime;
                let jumpHeightOffset = Math.sin((this.JumpCurrentTime / this.JumpDuration) * Math.PI) * this.JumpHeight;
                this.Mesh.position.y = this.JumpStartHeight + jumpHeightOffset;
                if (Math.random() < .4 && this.JumpCurrentTime < this.JumpDuration / 2)
                    this.Particles.push(new Particle(scene, 
                        new Vector3(this.Mesh.position.x + .25 - Math.random() / 2,
                         this.Mesh.position.y + .25 - Math.random() / 2,
                          this.Mesh.position.z + .25 - Math.random() / 2),
                           .3, 0xffffff,
                            new Vector3(0, (Math.random() + 1) * deltaTime, 0),
                             .89 + Math.random() * .1));
            } else {
                this.SetState(Player.States.Idle);
                this.Mesh.position.y = this.JumpStartHeight;
            }
        }

        if (Keyboard.Space && this.CanMove) {
            if (this.State === Player.States.Jump || this.IsOnGround) {
                this.SetState(Player.States.Attack);
                Assets.DashSound.Play();
                this.AttackCurrentTime = 0;
                this.Mesh.position.y += 2;
            }
        }

        if (this.State === Player.States.Attack) {
            this.AttackCurrentTime += deltaTime;
            if (this.AttackCurrentTime < this.AttackDuration) {
                this.MovementDirection.z = -this.AttackSpeed * deltaTime * ((1 - (this.AttackCurrentTime / this.AttackDuration) ** 2));
                if (Math.random() < .7 && this.AttackCurrentTime < this.AttackDuration / 2)
                    this.Particles.push(new Particle(scene, new Vector3(this.Mesh.position.x + .25 - Math.random() / 2, this.Mesh.position.y - .25 + Math.random() / 2, this.Mesh.position.z + .25 - Math.random() / 2), .3, 0xffffff, new Vector3(0, (Math.random() + 1) * deltaTime, 0), .89 + Math.random() * .1));
            } else {
                this.SetState(Player.States.Idle);
            }
        }


        this.MovementDirection.applyQuaternion(this.Mesh.quaternion);
        this.Mesh.position.add(this.MovementDirection);

        this.CollisionBox.setFromObject(this.CollisionMesh);
        for (let i = 0; i < LevelCollisionBoxes.length; i++) {
            const levelBox = LevelCollisionBoxes[i];
            if (this.CollisionBox.intersectsBox(levelBox)) {
                //Need to add sliding on x and y. Currently the player just stop at previous position.
                if (this.CollisionBox.max.y > levelBox.max.y && this.CollisionBox.min.y > levelBox.min.y) {
                    this.Mesh.position.y = levelBox.max.y;
                    this.SetState(Player.States.Idle);
                    this.IsOnGround = true;
                    Assets.HitSound.Play();
                } else {
                    if (this.CollisionBox.max.x > levelBox.max.x && this.CollisionBox.min.x > levelBox.min.x)
                        this.Mesh.position.x = levelBox.max.x + .4;
                    if (this.CollisionBox.min.x < levelBox.min.x)
                        this.Mesh.position.x = levwelBox.min.x - .4;
                    if (this.CollisionBox.max.z > levelBox.max.z && this.CollisionBox.min.z > levelBox.min.z)
                        this.Mesh.position.z = levelBox.max.z + .4;
                    if (this.CollisionBox.min.z < levelBox.min.z)
                        this.Mesh.position.z = levelBox.min.z - .4;
                }
            }
        }

        for (let index = 0; index < this.Particles.length; index++) {
            this.Particles[index].Update(deltaTime);
            if (this.Particles[index].Mesh.scale.x < 0.3) {
                this.Particles[index].CleanUp();
                this.Particles.splice(index, 1);
            }
        }
        this.Mixer.update(deltaTime);
    }

    SetState(state) {
        if (this.PreviousState === null)
            this.PreviousState = Player.States.Idle;
        else {
            this.PreviousState = this.State;
            if (this.PreviousState === Player.States.Jump) {
                if (this.LastJumpFeet === 1) this.Animations["jumpright"].stop(); else this.Animations["jumpleft"].stop();
            }
            else
                this.Animations[this.PreviousState.toString()].stop();
        }
        this.State = state;

        switch (state) {
            case Player.States.Idle:
                this.Animations[state.toString()].play();
                if (this.HasSword) {
                    this.Sword.rotation.x = Math.PI;
                    this.Sword.position.set(.4, 4.6, -.6)
                }
                break;
            case Player.States.Attack:
                this.Animations[state.toString()].play();
                if (this.HasSword) {
                    this.Sword.rotation.x = Math.PI / 2;
                    this.Sword.position.set(.4, .6, -4.6)
                }
                this.IsOnGround = false;
                break;
            case Player.States.Jump:
                this.IsOnGround = false;
                this.LastJumpFeet *= -1;
                if (this.LastJumpFeet === 1) {
                    this.Animations["jumpright"].play();
                    if (this.HasSword) {
                        this.Sword.rotation.x = Math.PI;
                        this.Sword.position.set(.6, 4.4, 0)
                    }
                }
                else {
                    if (this.HasSword) {
                        this.Sword.rotation.x = Math.PI;
                        this.Sword.position.set(.4, 4.4, -.6)
                    }
                    this.Animations["jumpleft"].play();
                }
                break;
            default:
                break;
        }
    }
}

function getGradientColorHex(color1, color2, point) {
    const r = Math.round((1 - point) * color1[0] + point * color2[0]);
    const g = Math.round((1 - point) * color1[1] + point * color2[1]);
    const b = Math.round((1 - point) * color1[2] + point * color2[2]);
    const hex = ((r << 16) | (g << 8) | b).toString(16);
    return '#' + hex.padStart(6, '0');
}



export { Player };