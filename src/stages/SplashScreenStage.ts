import { GameInputEvent } from "../engine/GameInputEvent";
import { Stage } from "../engine/Stage";

export class SplashScreenStage extends Stage {
    image: HTMLImageElement;
    onSkip: () => void;

    constructor(image: HTMLImageElement, onSkip: () => void) {
        super();
        this.image = image;
        this.onSkip = onSkip;
    }

    input(event: GameInputEvent) {
        this.onSkip();
    }

    render(context: CanvasRenderingContext2D) {
        context.drawImage(this.image, 0, 0);
    }
}