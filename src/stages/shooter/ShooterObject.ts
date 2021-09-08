import { Aimer } from "./Aimer";
import { Vector } from "../../util/Vector";
import { BBox } from "../../util/BBox";
import { ObjectSpawner } from "./ObjectSpawner";
import { Timer } from "../../util/Timer";
import { Noisemaker } from "./NoiseMaker";

type CollisionGroup = "enemy" | "player" | "enemybullet" | "playerbullet";

/** Generic class for shooter stage objects: ships, bullets, powerups, etc. */
export class ShooterObject {
    x: number;
    y: number;
    velocity: Vector;
    localBBox: BBox;
    hp: number;
    /** Collision group this object belongs to */
    collisionGroup: CollisionGroup;
    /** Collision group this object will collide to */
    targetCollisionGroup: CollisionGroup;
    isInvincible: boolean;
    onDestroyed: () => void;

    spawner: ObjectSpawner;
    aimer: Aimer;
    noisemaker: Noisemaker;

    constructor(x: number, y: number, bbox: BBox) {
        this.x = x;
        this.y = y;
        this.velocity = new Vector(0, 0);
        this.localBBox = bbox;
        this.collisionGroup = null;
        this.targetCollisionGroup = null;
        this.isInvincible = false;
        this.hp = 1;

        this.spawner = null;
        this.aimer = null;
        this.noisemaker = null;
    }

    get position(): Vector {
        return new Vector(this.x, this.y);
    }

    /** BBox of the object but in world coordinates */
    get effectiveBBox(): BBox {
        return this.localBBox.translated(this.x, this.y);
    }

    didSpawn() {
        // no-op
    }

    render(context: CanvasRenderingContext2D) {
        const ebbox = this.effectiveBBox;
        context.strokeStyle = "red";
        context.strokeRect(ebbox.minX, ebbox.minY, ebbox.width, ebbox.height);
    }

    update(dt: number) {
        this.x += this.velocity.x * dt / 1000;
        this.y += this.velocity.y * dt / 1000;
    }

    collideWithObject(object: ShooterObject) {
        // no-op
    }

    destroy() {
        this.spawner.despawn(this);
        this.onDestroyed?.();
    }

    hurt() {
        if (this.isInvincible) return;
        this.hp -= 1; 
        if (this.hp <= 0) {
            this.explode();
        }
    }

    explode() {
        this.spawner.spawn(
            new Explosion(this.x, this.y, this.localBBox)
        );
        this.noisemaker.playExplosionSound();
        this.destroy();
    }
}

export class Explosion extends ShooterObject {
    color: string;
    disappearTimer: Timer;

    constructor(x: number, y: number, bbox: BBox) {
        super(x, y, bbox);
        this.color = "yellow";
        this.disappearTimer = new Timer("once", 500, () => {
            this.spawner.despawn(this);
        });
    }

    didSpawn() {
        super.didSpawn();
        this.disappearTimer.reset();
    }

    render(context: CanvasRenderingContext2D) {
        const progress = this.disappearTimer.progress;
        context.globalAlpha = 1 - progress ** 2;
        const ebbox = this.effectiveBBox;
        this.color = (this.color === "red") ? "yellow" : "red"; 
        context.fillStyle = this.color;
        const path = new Path2D();
        path.moveTo(ebbox.minX + ebbox.width / 2, ebbox.minY);
        path.arc(
            ebbox.centerX,
            ebbox.centerY,
            (this.color === "red" ? ebbox.height : ebbox.height / 2) * (0.5 + 1 - ((1 - progress) ** 2)),
            0, Math.PI * 2
        );
        path.closePath();
        context.fill(path);
        context.globalAlpha = 1.0;
    }

    update(dt: number) {
        super.update(dt);
        this.disappearTimer.update(dt);
    }
}