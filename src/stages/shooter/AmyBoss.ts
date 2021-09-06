import { BBox } from "../../util/BBox";
import { Boss } from "./Boss";
import { elt } from "../../util/elt";
import { Vector } from "../../util/Vector";

const GUNPOINT_1 = { x: 48 - 50, y: 12 - 50 };
const GUNPOINT_2 = { x: 48 - 50, y: 90 - 50 };

enum AmyState {
    intro = "intro",
    flyingAround = "flyingAround",
}

/** First level boss */
export class AmyBoss extends Boss {
    image: HTMLImageElement;
    currentGunpoint: { x: number, y: number };
    state: AmyState;

    constructor(x: number, y: number) {
        super(x, y, new BBox(
            -50, -50, 100, 100
        ), {
            bulletAllegiance: "enemy",
            shotsPerSecond: 4,
            shouldRandomizeShootingTimer: false,
            canShootWhenTooFarLeft: true,
        });

        this.velocity = new Vector(-100, 0);

        this.image = elt.image("img/boss1.png", () => {}, () => {});
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
}