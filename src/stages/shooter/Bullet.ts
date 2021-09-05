import { ShooterObject } from "./ShooterObject";
import { BBox } from "../../util/BBox";
import { Vector } from "../../util/Vector";

/** Bullets alleged to the player will destroy enemies and vice versa. */
export type BulletAllegiance = "player" | "enemy";

export class Bullet extends ShooterObject {
    constructor(x: number, y: number, allegiance: BulletAllegiance) {
        super(x, y, new BBox(
            -3, -3, 6, 6
        ));

        switch (allegiance) {
            case "player":
                this.velocity = new Vector(500, 0);
                this.collisionGroup = "playerbullet";
                this.targetCollisionGroup = "enemy";
                break;
            case "enemy":
                this.velocity = new Vector(-500, 0);
                this.collisionGroup = "enemybullet";
                this.targetCollisionGroup = "player";
                break;
        }
    }

    collideWithObject(object: ShooterObject) {
        object.explode();
        this.destroy();
    }
}