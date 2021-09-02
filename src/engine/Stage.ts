import { GameInputEvent } from "./GameInputEvent";
import { Vector } from "../util/Vector";

export class Stage {
    screenDimensions: Vector;
    constructor(screenDimensions: Vector) {
        this.screenDimensions = screenDimensions;
    }

    /** @param {CanvasRenderingContext2D} context Rendering context. Might belong to an off-screen canvas. */
    render(context: CanvasRenderingContext2D) {
        // do nothing by default
    }

    input(event: GameInputEvent) {
        // do nothing by default
    }

    /** @param {number} dt Milliseconds passed since last call to `update()`. */
    update(dt: number) {
        
    }

    beforePush() {
        // do nothing by default
    }

    afterPush() {
        // do nothing by default
    }

    beforePop() {
        // do nothing by default
    }

    afterPop() {
        // do nothing by default
    }
}