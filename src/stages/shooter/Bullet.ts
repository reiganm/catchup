import { ShooterObject } from "./ShooterObject";
import { BBox } from "../../util/BBox";
import { Vector } from "../../util/Vector";

export class Bullet extends ShooterObject {
    constructor(x: number, y: number) {
        super(x, y, new BBox(
            0, -2, 8, 4
        ));

        this.velocity = new Vector(500, 0);

        this.collisionGroup = "playerbullet";
        this.targetCollisionGroup = "enemy";
    }

    collideWithObject(object: ShooterObject) {
        object.destroy();
        this.destroy();
    }
}