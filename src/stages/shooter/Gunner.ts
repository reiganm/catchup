import { ShooterObject } from "./ShooterObject";
import { Bullet } from "./Bullet";
import { Timer } from "../../util/Timer";
import { BBox } from "../../util/BBox";

/** A base class for game objects that can shoot */
export class Gunner extends ShooterObject {
    private shootingTimer: Timer;

    constructor(x: number, y: number, bbox: BBox) {
        super(x, y, bbox);

        this.shootingTimer = new Timer("repeat", 250, () => {
            const box = this.effectiveBBox;
            const bullet = new Bullet(
                box.minX + box.width,
                box.minY + box.height / 2
            );

            this.spawner.spawn(bullet);
        });
    }

    startShooting() {
        this.shootingTimer.isHolding = false;
    }

    stopShooting() {
        this.shootingTimer.isHolding = true;
    }

    update(dt: number) {
        super.update(dt);
        this.shootingTimer.update(dt);
    }
}
