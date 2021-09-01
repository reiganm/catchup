import { BBox } from "../../util/BBox";
import { Vector } from "../../util/Vector";
import { PlayerShip } from "./PlayerShip";
import { ShooterObject } from "./ShooterObject";

export class EnemyShip extends ShooterObject {
    constructor(x: number, y: number) {
        super(x, y, new BBox(
            -12, -12, 24, 24
        ));

        this.velocity = new Vector(-200, 0);

        this.collisionGroup = "enemy";
        this.targetCollisionGroup = "player";
    }

    collideWithObject(object: ShooterObject) {
        object.destroy();
    }
}