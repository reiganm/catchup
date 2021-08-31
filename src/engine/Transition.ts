import { Stage } from "./Stage";

export class Transition extends Stage {
    fromStage: Stage
    toStage: Stage
    duration: number
    timePassed: number

    /**
     * @param {Stage} fromStage Stage to transition from, lower on stack
     * @param {Stage} toStage Stage to transition to, higher on stack
     * @param {number} number How long the transition should play from start to finish
     */
    constructor(fromStage: Stage, toStage: Stage, duration: number) {
        super();
        this.fromStage = fromStage;
        this.toStage = toStage;
        this.duration = duration;
        this.timePassed = 0;
    }

    /** DO NOT redefine `render()` in sub-classes of Transition. */
    render() {

    }

    update(dt: number) {
        
    }

    /** Redefine this method in sub-classes of Transition.
     * @param {Stage} fromStage Stage to transition from
     * @param {Stage} fromStage Stage to transition from
     * @param {number} progress Number in the range of [0, 1]
     */
    renderTransition(fromStage: Stage, toStage: Stage, progress: number) {
        
    }
}