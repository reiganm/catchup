import { Bullet } from "./Bullet";
import { BBox } from "../../util/BBox";
import { Vector } from "../../util/Vector";
import { ShooterObject } from "./ShooterObject";
import { Gunner } from "./Gunner";
import { elt } from "../../util/elt";

export class NibblerShip extends Gunner {
    image: HTMLImageElement;

    constructor(x: number, y: number) {
        super(x, y, new BBox(
            -12, -12, 24, 24
        ), {
            bulletAllegiance: "enemy",
            shotsPerSecond: 0.3,
            shouldRandomizeShootingTimer: true,
            canShootWhenTooFarLeft: false,
        });

        this.velocity = new Vector(-200, 0);

        this.collisionGroup = "enemy";
        this.targetCollisionGroup = "player";
        this.image = elt.image("img/nibbler.png", () => {}, () => {});
    }

    get gunpoint(): Vector {
        return new Vector(this.x + 3, this.y + 2);
    }

    collideWithObject(player: ShooterObject) {
        player.hurt();
    }

    setupBullet(bullet: Bullet) {
        bullet.velocity = this.aimer
            .vectorTowardsPlayer(this.position)
            .scaled(100);
    }

    render(context: CanvasRenderingContext2D) {
        const ebbox = this.effectiveBBox;
        context.drawImage(
            this.image,
            Math.floor(ebbox.minX),
            Math.floor(ebbox.minY)
        );
    }
}