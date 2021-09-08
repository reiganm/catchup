import { Stage } from "./Stage";
import { inputEventFromKeyboardEvent } from "./GameInputEvent";
import { Transition, TransitionType } from "./Transition";

export class Game {
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
    stages: Stage[]
    currentTransition: Transition
    updateInterval: number;
    currentlyPressedKeys: Set<string>;

    /** Last recorded value of global */
    timer: number

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.stages = [];
        this.currentTransition = null;
        this.updateInterval = 0;
        this.currentlyPressedKeys = new Set();
    }

    private listenForInput() {
        for (const eventName of ["keydown", "keyup", "keypress"]) {
            document.addEventListener(eventName, (event) => {
                this.handleInput(event as KeyboardEvent);
            });
        }   
    }
    private handleInput(event: KeyboardEvent) {
        // Ignore repeated keypresses generated when user is holding the key
        if (event.type === "keydown") {
            if (this.currentlyPressedKeys.has(event.key)) {
                return;
            } else {
                this.currentlyPressedKeys.add(event.key); 
            }
        }

        if (event.type === "keyup") {
            this.currentlyPressedKeys.delete(event.key); 
        }

        const stage = this.getFrontStage();
        if (stage === null) {
            return;
        }

        const inputEvent = inputEventFromKeyboardEvent(event);

        stage.input(inputEvent);
    }

    private getFrontStage(): Stage {
        return this.stages[this.stages.length - 1] ?? null;
    }

    pushStage(stage: Stage) {
        if (this.currentTransition !== null) {
            throw TypeError("attempted to push a stage when a transition is in progress");
        }

        this.stages.push(stage);
        stage.afterPush();
    }

    popFrontStage() {
        if (this.currentTransition !== null) {
            throw TypeError("attempted to pop a stage when a transition is in progress");
        }

        this.stages.pop();
    }

    get hasStages(): boolean {
        return this.stages.length > 0;
    }

    transition( 
        transitionBuilder: (from: Stage) => Transition,
        transitionType: TransitionType
    ) {
        if (this.currentTransition !== null) {
            throw TypeError("transition already in progress, can't initiate a new one");
        }

        const fromStage = this.stages.pop();
        const transition = transitionBuilder(fromStage);
        this.stages.push(transition);

        transition.onFinished = () => {
            this.popFrontStage();
            this.pushStage(transition.toStage);

            this.currentTransition = null;
        };
    }

    run(updateInterval: number) {
        this.listenForInput();
        this.timer = performance.now();
        this.updateInterval = updateInterval;

        setInterval(() => {
            this.update();
        }, updateInterval);
        
        window.requestAnimationFrame(() => {
            this.render();
        });
    }

    update() {
        const now = performance.now();
        const dt = Math.min(now - this.timer, this.updateInterval);
        this.timer = now;

        for (const stage of this.stages) {
            stage.update(dt);
        }
    }

    render() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const stage of this.stages) {
            stage.render(this.context);
        }

        window.requestAnimationFrame(() => {
            this.render();
        });
    }
}