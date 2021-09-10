import { Stage } from "../engine/Stage";
import { Vector } from "../util/Vector";
import { ImageLibrary } from "../ImageLibrary";

const LINE_HEIGHT = 15;
const SCROLL_SPEED = 25;

const CREDITS: string[] = [
    `CAT-CHING IS A CAT THING`,
    ``,
    ``,
    `Story, code, SFX, and artwork by`,
    `Maria Reigan`,
    ``,
    ``,
    `Character Design & Credits Artwork by`,
    `SwitchSugar`,
    ``,
    ``,
    `Music`,
    ``,
    `Title Screen theme`,
    `"Street Life :Crusaders"`,
    `by`,
    `lasombra`,
    ``,
    `Level 1 theme`,
    `"No Jazz"`,
    `by`,
    `asikwus`,
    ``,
    `Level 2 theme`,
    `"Satisfaccion"`,
    `by`,
    `K. Jose`,
    ``,
    `Level 3 theme`,
    `"The ARYX Experience"`,
    `by`,
    `Katie Cadet`,
    ``,
    `Boss Battle theme`,
    `"Go emergency"`,
    `by`,
    `The GMC`,
    ``,
    `Final Boss Battle theme`,
    `"Additional Discomfort"`,
    `by`,
    `Pip Malt`,
    ``,
    `Ending theme`,
    `"Mr Pat's Cat"`,
    `by`,
    `lemonade`,
    ``,
    ``,
    `Tomato Valac designed by`,
    `Mishuy from pngtree.com`,
    ``,
    ``,
    `This silly little game was`,
    `developed in September of 2021`,
    `for Narrative Driven Jam #4`,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    `Thank you for playing!`,
];

export class CreditsStage extends Stage {
    image: HTMLImageElement;
    scrollProgress: number;
    canSkip: boolean;
    onSkip: () => void;

    constructor(screenDimensions: Vector, onSkip: () => void) {
        super(screenDimensions);

        this.image = ImageLibrary.instance.credits;
        this.scrollProgress = -320;
        this.canSkip = false;
        this.onSkip = onSkip;
    }

    update(dt: number) {
        if (
            (CREDITS.length * LINE_HEIGHT - this.scrollProgress)
            <= this.screenDimensions.y / 2
        ) {
            this.canSkip = true;
            return;
        }
        this.scrollProgress += SCROLL_SPEED * dt / 1000;
    }

    render(context: CanvasRenderingContext2D) {
        context.drawImage(this.image, 0, 0);

        context.fillStyle = "white";
        context.textAlign = "center";
        context.font = "8px amiga4ever";

        const enumeratedCredits: [string, number][] = CREDITS.map(
            (x, i) => [x, i]
        );
        for (const [line, i] of enumeratedCredits) {
            context.fillText(
                line,
                this.screenDimensions.x / 2,
                i * LINE_HEIGHT - this.scrollProgress
            )
        }

        context.textAlign = "left";
    }

    input() {
        if (this.canSkip) {
            this.onSkip();
        }
    }
}