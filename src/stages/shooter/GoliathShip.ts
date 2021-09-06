import { Gunner } from "./Gunner";
import { BBox } from "../../util/BBox";
import { Vector } from "../../util/Vector";
import { ShooterObject } from "./ShooterObject";
import { Bullet } from "./Bullet";
import { elt } from "../../util/elt";

export class GoliathShip extends Gunner {
    image: HTMLImageElement;

    constructor(x: number, y: number) {
        super(x, y, new BBox(
            -24, -24, 48, 48
        ), {
            bulletAllegiance: "enemy",
            shotsPerSecond: 4,
            shouldRandomizeShootingTimer: true,
            canShootWhenTooFarLeft: false,
        });

        this.velocity = new Vector(-20, 0);
        this.hp = 5;

        this.collisionGroup = "enemy";
        this.targetCollisionGroup = "player";

        this.image = elt.image("img/goliath.png", () => {}, () => {});
    }

    update(dt: number) {
        super.update(dt);
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