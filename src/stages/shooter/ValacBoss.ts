import { BBox } from "../../util/BBox";
import { Boss } from "./Boss";
import { elt } from "../../util/elt";
import { Vector } from "../../util/Vector";
import { pickNext } from "../../util/pickNext";
import { Bullet } from "./Bullet";
import { Timer } from "../../util/Timer";

const GUNPOINT_1 = { x: 48 - 50, y: 12 - 50 };
const GUNPOINT_2 = { x: 48 - 50, y: 90 - 50 };

const PATH: Vector[] = [
    new Vector(400 - 50, 50),
    new Vector(50, 50),
    new Vector(50, 300 - 50),
    new Vector(400 - 50, 300 - 50),
];

/** First level boss */
export class ValacBoss extends Boss {
    image: HTMLImageElement;
    rotateTimer: Timer;
    gunRotateTimer: Timer;

    constructor(x: number, y: number) {
        super(x, y, new BBox(
            -75, -75, 150, 150
        ), {
            bulletAllegiance: "enemy",
            shotsPerSecond: 12,
            shouldRandomizeShootingTimer: false,
            canShootWhenTooFarLeft: true,
        });

        this.hp = 130;

        this.image = elt.image("img/boss2.png", () => {}, () => {});
        this.rotateTimer = new Timer("repeat", 333, () => {});
        this.gunRotateTimer = new Timer("repeat", 1000, () => {});
    }

    update(dt: number) {
        super.update(dt);
        this.rotateTimer.update(dt);
        this.gunRotateTimer.update(dt);
    }

    render(context: CanvasRenderingContext2D) {
        const ebbox = this.effectiveBBox;
        const savedTransform = context.getTransform();

        context.translate(ebbox.centerX, ebbox.centerY);
        context.rotate(this.rotateTimer.progress * 2 * Math.PI);
        context.translate(-ebbox.width / 2, -ebbox.height / 2);
        context.drawImage(this.image, 0, 0);

        context.setTransform(savedTransform);
    }

    destinationReached() {
        super.destinationReached();
        if (this.destination === PATH[0]) {
            this.startShooting();
        }
        this.destination = pickNext(this.destination, PATH);
    }

    setupBullet(bullet: Bullet) {
        bullet.velocity = new Vector(-1, 0)
            .rotated(this.gunRotateTimer.progress * 2 * Math.PI)
            .scaled(200);
    }
}