import { Stage } from "../engine/Stage";
import { Transition } from "../engine/Transition";
import { Vector } from "../util/Vector";

export class FadeTransition extends Transition {
    fillStyle: string;

    constructor(
        fromStage: Stage,
        toStage: Stage,
        duration: number,
        screenDimensions: Vector,
        fillStyle: string,
    ) {
        super(fromStage, toStage, duration, screenDimensions);
        this.fillStyle = fillStyle;
    }

    renderTransition(
        context: CanvasRenderingContext2D,
        fromCanvas: HTMLCanvasElement,
        toCanvas: HTMLCanvasElement,
        progress: number
    ) {
        if (progress <= 0.5) {
            context.globalAlpha = 1.0;
            context.drawImage(fromCanvas, 0, 0);

            context.globalAlpha = progress * 2;
            context.fillStyle = this.fillStyle;
            context.fillRect(0, 0, this.screenDimensions.x, this.screenDimensions.y);
        } else {
            context.globalAlpha = 1.0;
            context.drawImage(toCanvas, 0, 0);
            
            context.globalAlpha = 1 - (progress - 0.5) * 2;
            context.fillStyle = this.fillStyle;
            context.fillRect(0, 0, this.screenDimensions.x, this.screenDimensions.y);
        }
        context.globalAlpha = 1.0;
    }
}