import { Gunner } from "./Gunner";
import { BBox } from "../../util/BBox";
import { Vector } from "../../util/Vector";
import { ShooterObject } from "./ShooterObject";
import { Bullet } from "./Bullet";
import { Timer } from "../../util/Timer";
import { elt } from "../../util/elt";

export class ReturnerShip extends Gunner {
    returnTimer: Timer;
    image: HTMLImageElement;

    constructor(x: number, y: number) {
        super(x, y, new BBox(
            -12, -24, 24, 48
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

        this.image = elt.image("img/returner.png", () => {}, () => {});
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

    collideWithObject(player: ShooterObject) {
        player.hurt();
    }

    setupBullet(bullet: Bullet) {
        bullet.velocity = this.aimer
            .vectorTowardsPlayer(this.position)
            .scaled(400);
    }

    render(context: CanvasRenderingContext2D) {
        const ebbox = this.effectiveBBox;
        context.drawImage(
            this.image,
            Math.floor(ebbox.minX),
            Math.floor(ebbox.minY)
        )

        super.render(context);
    }
}