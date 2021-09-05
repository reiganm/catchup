import { ShooterObject } from "./ShooterObject";
import { BBox } from "../../util/BBox";
import { Vector } from "../../util/Vector";
import { Timer } from "../../util/Timer";

/** Bullets alleged to the player will destroy enemies and vice versa. */
export type BulletAllegiance = "player" | "enemy";

export class Bullet extends ShooterObject {
    colorTimer: Timer;

    constructor(x: number, y: number, allegiance: BulletAllegiance) {
        super(x, y, new BBox(
            -2, -2, 4, 4
        ));

        this.colorTimer = new Timer("repeat", 1000, () => {
            // Do nothing
        });

        switch (allegiance) {
            case "player":
                this.velocity = new Vector(500, 0);
                this.collisionGroup = "playerbullet";
                this.targetCollisionGroup = "enemy";
                break;
            case "enemy":
                this.velocity = new Vector(-500, 0);
                this.collisionGroup = "enemybullet";
                this.targetCollisionGroup = "player";
                break;
        }
    }

    collideWithObject(object: ShooterObject) {
        object.explode();
        this.destroy();
    }

    update(dt: number) {
        super.update(dt);
        this.colorTimer.update(dt);
    }

    render(context: CanvasRenderingContext2D) {
        const ebbox = this.effectiveBBox;
        const path = new Path2D();
        path.arc(ebbox.centerX, ebbox.centerY, 5, 0, Math.PI * 2);
        path.closePath();
        if (this.collisionGroup === "playerbullet") {
            context.fillStyle = "white";
        } else {
            context.fillStyle = `hsl(${this.colorTimer.progress * 360 - 180}deg, 100%, 80%)`;
        }
        context.fill(path);
        context.strokeStyle = `hsl(${this.colorTimer.progress * 360}deg, 100%, 80%)`;
        context.stroke(path);
    }
}