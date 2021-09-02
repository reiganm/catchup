import { ShooterObject } from "./ShooterObject";
import { BBox } from "../../util/BBox";
import { Vector } from "../../util/Vector";
import { Bullet } from "./Bullet";
import { Timer } from "../../util/Timer";

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

export class PlayerShip extends ShooterObject {
    activeDirections: Set<PlayerControlDirection>;
    maximumSpeed: number;
    shootingTimer: Timer;

    constructor() {
        super(20, 150, new BBox(
            -3, -24, 24, 48
        ));

        this.maximumSpeed = 250;
        this.activeDirections = new Set();

        this.shootingTimer = new Timer("repeat", 250, () => {
            const box = this.effectiveBBox;
            const bullet = new Bullet(
                box.minX + box.width,
                box.minY + box.height / 2
            );
            // please don't do this
            //bullet.velocity = bullet.velocity.adding(this.velocity.scaled(0.1));
            this.spawner.spawn(bullet);
        });
        this.shootingTimer.isHolding = true;

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

    startShooting() {
        this.shootingTimer.isHolding = false;
    }

    stopShooting() {
        this.shootingTimer.isHolding = true;
    }

    update(dt: number) {
        this.shootingTimer.update(dt);

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
}