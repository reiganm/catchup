import { ShooterObject } from "./ShooterObject";
import { Bullet, BulletAllegiance } from "./Bullet";
import { Timer } from "../../util/Timer";
import { BBox } from "../../util/BBox";

export type GunnerConfig = {
    bulletAllegiance: BulletAllegiance,
    shotsPerSecond: number,
    shouldRandomizeShootingTimer: boolean,
};

/** A base class for game objects that can shoot */
export class Gunner extends ShooterObject {
    private shootingTimer: Timer;

    constructor(x: number, y: number, bbox: BBox, config: GunnerConfig) {
        super(x, y, bbox);

        this.shootingTimer = new Timer("repeat", 1000 / config.shotsPerSecond, () => {
            const ebbox = this.effectiveBBox;
            const bullet = new Bullet(
                ebbox.centerX,
                ebbox.centerY,
                config.bulletAllegiance
            );

            this.setupBullet(bullet);

            this.spawner.spawn(bullet);
        });

        if (config.shouldRandomizeShootingTimer) {
            this.shootingTimer.randomizeProgress();
        }
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

    /** Override this in child classes to specify how you want the bullet to behave or something */
    setupBullet(bullet: Bullet) {
        // do nothing
    }
}
