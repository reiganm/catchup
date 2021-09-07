import { BBox } from "../../util/BBox";
import { Boss } from "./Boss";
import { elt } from "../../util/elt";
import { Vector } from "../../util/Vector";
import { pickNext } from "../../util/pickNext";
import { Bullet } from "./Bullet";

const PATH: Vector[] = [
    new Vector(400, 150),
    new Vector(0, 150),
];

/** Third level boss */
export class HaborymBoss extends Boss {
    image: HTMLImageElement;

    constructor(x: number, y: number) {
        super(x, y, new BBox(
            -50, -150, 300, 300
        ), {
            bulletAllegiance: "enemy",
            shotsPerSecond: 5,
            shouldRandomizeShootingTimer: false,
            canShootWhenTooFarLeft: true,
        });
        this.stopShooting();

        this.hp = 1000;
        this.speed = 5;

        this.image = elt.image("img/boss3.png", () => {}, () => {});
    }

    get gunpoint(): Vector {
        return this.position;
    }

    render(context: CanvasRenderingContext2D) {
        const ebbox = this.effectiveBBox;
        context.drawImage(this.image, ebbox.minX, ebbox.minY);
    }

    destinationReached() {
        super.destinationReached();
        if (this.destination === PATH[0]) {
            this.startShooting();
        }
        this.destination = pickNext(this.destination, PATH);
    }

    setupBullet(bullet: Bullet) {
        bullet.velocity = this.aimer
            .vectorTowardsPlayer(this.position)
            .scaled(150)
            .adding(new Vector(
                0, Math.random() * 200 - 100
            ))
    }

    hurt() {
        if (this.hp <= 800) {
            this.hp = 1;
        }
        super.hurt();
    }
}