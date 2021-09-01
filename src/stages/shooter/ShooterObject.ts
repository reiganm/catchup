import { Vector } from "../../util/Vector";
import { BBox } from "../../util/BBox";
import { ObjectSpawner } from "./ObjectSpawner";

type CollisionGroup = "enemy" | "player" | "enemybullet" | "playerbullet";

/** Generic class for shooter stage objects: ships, bullets, powerups, etc. */
export class ShooterObject {
    x: number;
    y: number;
    velocity: Vector;
    localBBox: BBox;
    spawner: ObjectSpawner;
    /** Collision group this object belongs to */
    collisionGroup: CollisionGroup;
    /** Collision group this object will collide to */
    targetCollisionGroup: CollisionGroup;

    constructor(x: number, y: number, bbox: BBox) {
        this.x = x;
        this.y = y;
        this.velocity = new Vector(0, 0);
        this.localBBox = bbox;
        this.collisionGroup = null;
        this.targetCollisionGroup = null;
    }

    /** BBox of the object but in world coordinates */
    get effectiveBBox(): BBox {
        return this.localBBox.translated(this.x, this.y);
    }

    render(context: CanvasRenderingContext2D) {
        const ebbox = this.effectiveBBox;
        context.fillStyle = "white";
        context.fillRect(
            Math.floor(ebbox.minX),
            Math.floor(ebbox.minY),
            Math.floor(ebbox.width),
            Math.floor(ebbox.height)
        );
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
    }
}