import { ShooterObject } from "./ShooterObject";
import { Bullet, BulletAllegiance } from "./Bullet";
import { Timer } from "../../util/Timer";
import { BBox } from "../../util/BBox";

export type GunnerConfig = {
    bulletAllegiance: BulletAllegiance,
    shotsPerSecond: number,
};

/** A base class for game objects that can shoot */
export class Gunner extends ShooterObject {
    private shootingTimer: Timer;

    constructor(x: number, y: number, bbox: BBox, config: GunnerConfig) {
        super(x, y, bbox);

        this.shootingTimer = new Timer("repeat", 1000 / config.shotsPerSecond, () => {
            const box = this.effectiveBBox;
            const bullet = new Bullet(
                box.minX + box.width / 2,
                box.minY + box.height / 2,
                config.bulletAllegiance
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
