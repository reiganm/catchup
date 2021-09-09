import { Gunner } from "./Gunner";
import { BBox } from "../../util/BBox";
import { Vector } from "../../util/Vector";
import { ShooterObject } from "./ShooterObject";
import { Bullet } from "./Bullet";
import { ImageLibrary } from "../../ImageLibrary";
import { Timer } from "../../util/Timer";

export class GoliathShip extends Gunner {
    image: HTMLImageElement;
    shootWindowTimer: Timer;

    constructor(x: number, y: number) {
        super(x, y, new BBox(
            -24, -24, 48, 48
        ), {
            bulletAllegiance: "enemy",
            shotsPerSecond: 4,
            shouldRandomizeShootingTimer: false,
            canShootWhenTooFarLeft: false,
        });

        this.velocity = new Vector(-20, 0);
        this.hp = 5;

        this.collisionGroup = "enemy";
        this.targetCollisionGroup = "player";

        this.image = ImageLibrary.instance.goliath;
        this.shootWindowTimer = new Timer("repeat", 3600, () => {});
    }

    update(dt: number) {
        super.update(dt);
        this.shootWindowTimer.update(dt);
        if (this.shootWindowTimer.progress >= 0.5) {
            this.stopShooting();
        } else {
            this.startShooting();
        }
    }

    collideWithObject(player: ShooterObject) {
        player.hurt();
    }

    setupBullet(bullet: Bullet) {
        bullet.velocity = this.aimer
            .vectorTowardsPlayer(this.position)
            .scaled(50);
    }

    render(context: CanvasRenderingContext2D) {
        const ebbox = this.effectiveBBox;
        context.drawImage(
            this.image,
            Math.floor(ebbox.minX),
            Math.floor(ebbox.minY)
        )
    }
}