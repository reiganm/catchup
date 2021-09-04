import { BBox } from "../../util/BBox";
import { Vector } from "../../util/Vector";
import { ShooterObject } from "./ShooterObject";
import { Gunner } from "./Gunner";

export class EnemyShip extends Gunner {
    constructor(x: number, y: number) {
        super(x, y, new BBox(
            -12, -12, 24, 24
        ), {
            bulletAllegiance: "enemy",
            shotsPerSecond: 2,
        });

        this.velocity = new Vector(-200, 0);

        this.collisionGroup = "enemy";
        this.targetCollisionGroup = "player";
    }

    collideWithObject(object: ShooterObject) {
        object.destroy();
    }
}