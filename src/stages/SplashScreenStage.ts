import { GameInputEvent } from "../engine/GameInputEvent";
import { Stage } from "../engine/Stage";
import { Vector } from "../util/Vector";

export class SplashScreenStage extends Stage {
    image: HTMLImageElement;
    onSkip: () => void;
    isSkipped: boolean;

    constructor(dimensions: Vector, image: HTMLImageElement, onSkip: () => void) {
        super(dimensions);
        this.image = image;
        this.onSkip = onSkip;
        this.isSkipped = false;
    }

    input(event: GameInputEvent) {
        if (event.state === "down" && !this.isSkipped) {
            this.isSkipped = true;
            this.onSkip();
        }
    }

    render(context: CanvasRenderingContext2D) {
        context.drawImage(this.image, 0, 0);
    }
}