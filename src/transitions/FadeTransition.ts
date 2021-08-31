import { Stage } from "../engine/Stage";
import { Transition } from "../engine/Transition";

export class FadeTransition extends Transition {
    renderTransition(
        context: CanvasRenderingContext2D,
        fromCanvas: HTMLCanvasElement,
        toCanvas: HTMLCanvasElement,
        progress: number
    ) {
        context.globalAlpha = 1.0;
        context.drawImage(fromCanvas, 0, 0);

        context.globalAlpha = progress;
        context.drawImage(toCanvas, 0, 0);

        context.globalAlpha = 1.0;
    }
}