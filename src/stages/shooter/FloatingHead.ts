import { ImageLibrary } from "../../ImageLibrary";
import { BBox } from "../../util/BBox";
import { elt } from "../../util/elt";
import { Vector } from "../../util/Vector";
import { ShooterObject } from "./ShooterObject";

export class FloatingHead extends ShooterObject {
    initialXPos: number;
    didArriveToDestination: boolean;
    onArrivedToDestination: () => void;
    image: HTMLImageElement;

    constructor(x: number, y: number, onArrivedToDestination: () => void) {
        super(x, y, new BBox(
            -20, -20, 41, 42
        ));

        this.velocity = new Vector(-100, 0);

        this.initialXPos = x;
        this.didArriveToDestination = false;
        this.onArrivedToDestination = onArrivedToDestination;
        this.image = ImageLibrary.instance.cathead;
    }

    update(dt: number) {
        super.update(dt);

        if (!this.didArriveToDestination && this.x <= this.initialXPos - 175) {
            this.velocity = new Vector(0, 0); 
            this.didArriveToDestination = true;
            this.onArrivedToDestination();
        }
    }

    render(context: CanvasRenderingContext2D) {
        const ebbox = this.effectiveBBox;
        context.drawImage(
            this.image,
            Math.floor(ebbox.minX),
            Math.floor(ebbox.minY)
        ) 
    }
}