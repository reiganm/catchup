import { GameInputEvent } from "./GameInputEvent";

export class Stage {
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