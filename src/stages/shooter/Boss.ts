import { BBox } from "../../util/BBox";
import { Vector } from "../../util/Vector";
import { Gunner, GunnerConfig } from "./Gunner";
import { ShooterObject } from "./ShooterObject";

export class Boss extends Gunner {
    speed: number;
    destination: Vector;

    constructor(x: number, y: number, bbox: BBox, config: GunnerConfig) {
        super(x, y, bbox, config);
        this.speed = 100;
        this.destination = new Vector(x, y);

        this.collisionGroup = "enemy";
        this.targetCollisionGroup = "player";
    }

    update(dt: number) {
        // Bosses move at a constant rate to specific points on screen
        const path = this.destination
            .subtracting(this.position);

        const direction = path
            .normalized()
            .scaled(this.speed * dt / 1000);

        if (path.measure <= direction.measure) {
            this.x = this.destination.x;
            this.y = this.destination.y; 
            this.destinationReached();
        } else {
            this.x += direction.x;
            this.y += direction.y;
        }

        super.update(dt);
    }

    destinationReached() {
        // do nothing
    }

    collideWithObject(player: ShooterObject) {
        player.hurt();
    }
}