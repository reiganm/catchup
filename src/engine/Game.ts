import { Stage } from "./Stage";
import { inputEventFromKeyboardEvent } from "./GameInputEvent";

export class Game {
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
    stages: Stage[]
    /** Last recorded value of global */
    timer: number

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.stages = [];
    }

    private listenForInput() {
        for (const eventName of ["keydown", "keyup", "keypress"]) {
            document.addEventListener(eventName, (event) => {
                this.handleInput(event as KeyboardEvent);
            });
        }   
    }

    private handleInput(event: KeyboardEvent) {
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
        this.stages.push(stage);
    }

    popFrontStage() {
        this.stages.pop();
    }

    run(updateInterval: number) {
        this.listenForInput();
        this.timer = performance.now();

        setInterval(() => {
            this.update();
        }, updateInterval);
        
        window.requestAnimationFrame(() => {
            this.render();
        });
    }

    update() {
        const now = performance.now();
        const dt = now - this.timer;
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