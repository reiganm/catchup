import { elt } from "../util/elt";
import { Vector } from "../util/Vector";
import { Stage } from "./Stage";

export type TransitionType = "replace" | "push";

export class Transition extends Stage {
    fromStage: Stage;
    toStage: Stage;
    duration: number;
    timePassed: number;
    isFinished: boolean;
    onFinished: () => void;

    /**
     * @param {Stage} fromStage Stage to transition from, lower on stack
     * @param {Stage} toStage Stage to transition to, higher on stack
     * @param {number} number How long the transition should play from start to finish
     */
    constructor(fromStage: Stage, toStage: Stage, duration: number, screenDimensions: Vector) {
        super(screenDimensions);
        this.fromStage = fromStage;
        this.toStage = toStage;
        this.duration = duration;
        this.timePassed = 0;
        this.isFinished = false;
    }

    /** DO NOT redefine `render()` in sub-classes of Transition. */
    render(context: CanvasRenderingContext2D) {
        const fromCanvas = elt.canvas(context.canvas.width, context.canvas.height);
        this.fromStage.render(fromCanvas.getContext("2d"));

        const toCanvas = elt.canvas(context.canvas.width, context.canvas.height);
        this.toStage.render(toCanvas.getContext("2d"));

        this.renderTransition(
            context,
            fromCanvas,
            toCanvas,
            Math.min(1, (this.timePassed / this.duration))
        );
    }

    update(dt: number) {
        if (this.isFinished) { return }

        this.timePassed += dt;
        if (this.timePassed >= this.duration) {
            this.isFinished = true;
            this.onFinished();
        }
    }

    /** Redefine this method in sub-classes of Transition.
     * @param {CanvasRenderingContext2D} context Rendering context business as usual
     * @param {HTMLCanvasElement} fromCanvas Canvas with the rendered content of the stage to transition from
     * @param {HTMLCanvasElement} toCanvas Canvas with the rendered content of the stage to transition to
     * @param {number} progress Number in the range of [0, 1]
     */
    renderTransition(
        context: CanvasRenderingContext2D,
        fromCanvas: HTMLCanvasElement,
        toCanvas: HTMLCanvasElement,
        progress: number
    ) {
        
    }
}