import { BBox } from "../../util/BBox";
import { ShooterObject } from "./ShooterObject";
import { Timer } from "../../util/Timer";

/** A floating text to shoot at */
export class Answer extends ShooterObject {
    colorTimer: Timer;
    text: string;

    constructor(x: number, y: number, text: string) {
        super(x, y, new BBox(
            -24, -12, 48, 24
        ));

        this.text = text;
        this.collisionGroup = "enemy";
        this.colorTimer = new Timer("repeat", 1000, () => {
            // Do nothing
        });
    }

    update(dt: number) {
        this.colorTimer.update(dt);
    }

    render(context: CanvasRenderingContext2D) {
        const ebbox = this.effectiveBBox;
        context.font = "8px amiga4ever"
        context.textAlign = "center";
        context.fillStyle = `hsl(${this.colorTimer.progress * 360 - 180}deg, 100%, 80%)`;
        context.fillText(this.text, ebbox.centerX, ebbox.centerY);
        context.textAlign = "left";
    }
    
}