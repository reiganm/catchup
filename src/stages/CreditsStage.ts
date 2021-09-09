import { Stage } from "../engine/Stage";
import { Vector } from "../util/Vector";

const LINE_HEIGHT = 15;
const SCROLL_SPEED = 25;

const CREDITS: string[] = [
    `CAT-CHING IS A CAT THING`,
    ``,
    ``,
    `Story, code, and artwork by`,
    `Maria Reigan`,
    ``,
    ``,
    `Music`,
    ``,
    `Title Screen & Credits theme`,
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
    `Boss Battle theme`,
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
    scrollProgress: number;

    constructor(screenDimensions: Vector) {
        super(screenDimensions);

        this.scrollProgress = -320;
    }

    update(dt: number) {
        if (
            (CREDITS.length * LINE_HEIGHT - this.scrollProgress)
            <= this.screenDimensions.y / 2
        ) {
            return;
        }
        this.scrollProgress += SCROLL_SPEED * dt / 1000;
    }

    render(context: CanvasRenderingContext2D) {
        context.fillStyle = "black";
        context.fillRect(0, 0, this.screenDimensions.x, this.screenDimensions.y);

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
}