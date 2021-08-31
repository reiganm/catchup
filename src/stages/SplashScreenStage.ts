import { GameInputEvent } from "../engine/GameInputEvent";
import { Stage } from "../engine/Stage";

export class SplashScreenStage extends Stage {
    image: HTMLImageElement;
    onSkip: () => void;
    isSkipped: boolean;

    constructor(image: HTMLImageElement, onSkip: () => void) {
        super();
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