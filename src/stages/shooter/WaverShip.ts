import { Bullet } from "./Bullet";
import { BBox } from "../../util/BBox";
import { Vector } from "../../util/Vector";
import { ShooterObject } from "./ShooterObject";
import { Gunner } from "./Gunner";
import { elt } from "../../util/elt";
import { Timer } from "../../util/Timer";
import { ImageLibrary } from "../../ImageLibrary";

export class WaverShip extends Gunner {
    image: HTMLImageElement;
    waveTimer: Timer;

    constructor(x: number, y: number) {
        super(x, y, new BBox(
            -22, -10, 45, 20
        ), {
            bulletAllegiance: "enemy",
            shotsPerSecond: 1,
            shouldRandomizeShootingTimer: true,
            canShootWhenTooFarLeft: false,
        });

        this.velocity = new Vector(-200, 0);

        this.collisionGroup = "enemy";
        this.targetCollisionGroup = "player";
        this.image = ImageLibrary.instance.waver;
        this.waveTimer = new Timer("repeat", 1000, () => {});
    }

    collideWithObject(player: ShooterObject) {
        player.hurt();
    }

    get gunpoint(): Vector {
        return new Vector(this.x + 10, this.y + 1);
    }

    setupBullet(bullet: Bullet) {
        bullet.velocity = this.aimer
            .vectorTowardsPlayer(this.position)
            .scaled(50);
    }

    update(dt: number) {
        this.waveTimer.update(dt);
        this.velocity = this.velocity.adding(new Vector(
            0, 4 * (Math.abs(this.waveTimer.progress - 0.5) - 0.25) * 10
        ));
        super.update(dt);
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