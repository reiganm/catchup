import { Vector } from "../../util/Vector";
import { BBox } from "../../util/BBox";
import { ObjectSpawner } from "./ObjectSpawner";

/** Generic class for shooter stage objects: ships, bullets, powerups, etc. */
export class ShooterObject {
    x: number;
    y: number;
    velocity: Vector;
    bbox: BBox;
    spawner: ObjectSpawner;

    constructor(x: number, y: number, bbox: BBox) {
        this.x = x;
        this.y = y;
        this.velocity = new Vector(0, 0);
        this.bbox = bbox;
    }

    /** BBox of the object but in world coordinates */
    get effectiveBBox(): BBox {
        return this.bbox.translated(this.x, this.y);
    }

    render(context: CanvasRenderingContext2D) {
        const box = this.effectiveBBox;
        context.fillStyle = "white";
        context.fillRect(
            Math.floor(box.minX),
            Math.floor(box.minY),
            Math.floor(box.width),
            Math.floor(box.height)
        );
    }

    update(dt: number) {
        this.x += this.velocity.x * dt / 1000;
        this.y += this.velocity.y * dt / 1000;
    }
}