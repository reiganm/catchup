import { BBox } from "../../util/BBox";
import { Boss } from "./Boss";
import { elt } from "../../util/elt";
import { Vector } from "../../util/Vector";
import { pickNext } from "../../util/pickNext";
import { Bullet } from "./Bullet";
import { ImageLibrary } from "../../ImageLibrary";

const GUNPOINT_1 = { x: 48 - 50, y: 12 - 50 };
const GUNPOINT_2 = { x: 48 - 50, y: 90 - 50 };

const PATH: Vector[] = [
    new Vector(300, 150),
    new Vector(300, 50),
    new Vector(300, 250),
];

/** First level boss */
export class AmyBoss extends Boss {
    image: HTMLImageElement;
    currentGunpoint: { x: number, y: number };

    constructor(x: number, y: number) {
        super(x, y, new BBox(
            -50, -50, 100, 100
        ), {
            bulletAllegiance: "enemy",
            shotsPerSecond: 2,
            shouldRandomizeShootingTimer: false,
            canShootWhenTooFarLeft: true,
        });

        this.hp = 100;

        this.image = ImageLibrary.instance.boss1;
        this.currentGunpoint = GUNPOINT_1;
    }

    get gunpoint(): Vector {
        return new Vector(
            this.x + this.currentGunpoint.x,
            this.y + this.currentGunpoint.y
        );
    }

    shoot() {
        // Alternate between two gunpoints for each shot
        if (this.currentGunpoint === GUNPOINT_1) {
            this.currentGunpoint = GUNPOINT_2;
        } else {
            this.currentGunpoint = GUNPOINT_1;
        }
        super.shoot();
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
            .scaled(200);
    }
}