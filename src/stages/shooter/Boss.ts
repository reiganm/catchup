import { BBox } from "../../util/BBox";
import { Vector } from "../../util/Vector";
import { Gunner, GunnerConfig } from "./Gunner";

export class Boss extends Gunner {
    speed: number;
    destination: Vector;
    onDestinationReached: (Vector) => void;

    constructor(x: number, y: number, bbox: BBox, config: GunnerConfig) {
        super(x, y, bbox, config);
        this.speed = 100;
    }

    update(dt: number) {
        // Bosses move at a constant rate to specific points on screen
        const path = this.destination
            .subtracting(this.position);

        const direction = path
            .normalized()
            .scaled(this.speed * dt / 1000);

        if (path.measure >= direction.measure) {
            this.x = this.destination.x;
            this.y = this.destination.y; 
            this.onDestinationReached?.(this.destination);
        }
    }
}