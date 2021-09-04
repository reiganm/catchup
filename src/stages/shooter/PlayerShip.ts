import { BBox } from "../../util/BBox";
import { Timer } from "../../util/Timer";
import { Vector } from "../../util/Vector";
import { Gunner } from "./Gunner";

export type PlayerControlDirection = "w" | "a" | "s" | "d";

function oppositeDirection(direction: PlayerControlDirection): PlayerControlDirection {
    const opposites: { [key: string]: PlayerControlDirection } = {
        "w": "s",
        "a": "d",
        "s": "w",
        "d": "a",
    };

    return opposites[direction];
}

export class PlayerShip extends Gunner {
    activeDirections: Set<PlayerControlDirection>;
    maximumSpeed: number;
    invincibilityFlickerFlag: boolean;
    invincibilityTimer: Timer;

    constructor() {
        super(20, 150, new BBox(
            -3, -24, 24, 48
        ), {
            bulletAllegiance: "player",
            shotsPerSecond: 4,
            shouldRandomizeShootingTimer: false,
        });

        this.activeDirections = new Set();
        this.maximumSpeed = 250;
        this.invincibilityFlickerFlag = false;
        this.invincibilityTimer = new Timer("once", 4000, () => {
            this.isInvincible = false;
        });
        this.invincibilityTimer.isSleeping = true;

        this.stopShooting();

        this.collisionGroup = "player";
    }

    get directionSymbol(): string {
        return Array.from(this.activeDirections).sort().join("");
    }

    addDirection(direction: PlayerControlDirection) {
        this.activeDirections.add(direction);
        this.activeDirections.delete(oppositeDirection(direction));
    }

    subtractDirection(direction: PlayerControlDirection) {
        this.activeDirections.delete(direction);
    }

    activateTemporaryInvincibility() {
        this.isInvincible = true;
        this.invincibilityTimer.reset(); 
    }

    update(dt: number) {
        this.invincibilityTimer.update(dt);

        switch (this.directionSymbol) {
            case "w":
                this.velocity = new Vector(0, -1);
                break;
            case "a":
                this.velocity = new Vector(-1, 0);
                break;
            case "s":
                this.velocity = new Vector(0, 1);
                break;
            case "d":
                this.velocity = new Vector(1, 0);
                break;
            case "aw":
                this.velocity = new Vector(-1, -1);
                break;
            case "as":
                this.velocity = new Vector(-1, 1);
                break;
            case "ds":
                this.velocity = new Vector(1, 1);
                break;
            case "dw":
                this.velocity = new Vector(1, -1);
                break;
            default:
                this.velocity = new Vector(0, 0);
        }

        if (!this.velocity.isNull) {
            this.velocity = this.velocity
                .normalized()
                .scaled(this.maximumSpeed);
        }

        super.update(dt);
    }

    render(context: CanvasRenderingContext2D) {
        this.invincibilityFlickerFlag = !this.invincibilityFlickerFlag;

        if (this.isInvincible && this.invincibilityFlickerFlag) {
            return;
        }

        super.render(context);
    }
}