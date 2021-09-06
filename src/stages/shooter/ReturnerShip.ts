import { Gunner } from "./Gunner";
import { BBox } from "../../util/BBox";
import { Vector } from "../../util/Vector";
import { ShooterObject } from "./ShooterObject";
import { Bullet } from "./Bullet";
import { Timer } from "../../util/Timer";

export class ReturnerShip extends Gunner {
    returnTimer: Timer;

    constructor(x: number, y: number) {
        super(x, y, new BBox(
            -12, -12, 24, 24
        ), {
            bulletAllegiance: "enemy",
            shotsPerSecond: 2,
            shouldRandomizeShootingTimer: true,
        });

        this.stopShooting();

        this.velocity = new Vector(-400, 0);

        this.collisionGroup = "enemy";
        this.targetCollisionGroup = "player";

        this.returnTimer = new Timer("once", 1500, () => {
            
        });

        this.returnTimer.isSleeping = true;
    }

    didSpawn() {
        super.didSpawn();
        this.returnTimer.reset();
    }

    update(dt: number) {
        this.returnTimer.update(dt);
        this.velocity.x = -200 * 2 * (0.5 - this.returnTimer.progress ** 2);
        if (this.returnTimer.progress >= 0.5) {
            this.startShooting();
        }
        super.update(dt);
    }

    collideWithObject(object: ShooterObject) {
        object.explode();
    }

    setupBullet(bullet: Bullet) {
        bullet.velocity = this.aimer
            .vectorTowardsPlayer(this.position)
            .scaled(400);
    }
}