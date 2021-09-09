import { ImageLibrary } from "../../ImageLibrary";
import { BBox } from "../../util/BBox";
import { elt } from "../../util/elt";
import { Vector } from "../../util/Vector";
import { ShooterObject } from "./ShooterObject";

type HeadKind = "cat" | "tomato";

export class FloatingHead extends ShooterObject {
    initialXPos: number;
    didArriveToDestination: boolean;
    onArrivedToDestination: () => void;
    image: HTMLImageElement;
    altImage: HTMLImageElement;
    kind: HeadKind;

    constructor(
        x: number,
        y: number,
        kind: HeadKind,
        onArrivedToDestination: () => void
    ) {
        super(x, y, new BBox(
            -20, -20, 41, 42
        ));

        this.velocity = new Vector(-100, 0);

        this.kind = kind;
        this.onArrivedToDestination = onArrivedToDestination;

        this.initialXPos = x;
        this.didArriveToDestination = false;
        this.image = ImageLibrary.instance.cathead;
        this.altImage = ImageLibrary.instance.boss3;
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
        const image = (this.kind === "cat") ? this.image : this.altImage;
        context.drawImage(
            image,
            Math.floor(ebbox.minX),
            Math.floor(ebbox.minY),
            ebbox.width,
            ebbox.height
        ) 
    }
}