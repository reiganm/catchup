import { GameInputEvent } from "../engine/GameInputEvent";
import { Stage } from "../engine/Stage";
import { Vector } from "../util/Vector";
import { BBox } from "../util/BBox";

type ShooterStageConfig = {
    background: HTMLImageElement
};

/** Generic class for shooter stage objects: ships, bullets, powerups, etc. */
class ShooterObject {
    x: number;
    y: number;
    velocity: Vector;
    bbox: BBox;

    constructor(x: number, y: number, bbox: BBox) {
        this.x = x;
        this.y = y;
        this.velocity = new Vector(0, 0);
        this.bbox = bbox;
    }

    render(context: CanvasRenderingContext2D) {
        const box = this.bbox.translated(this.x, this.y);
        context.fillStyle = "white";
        context.fillRect(
            Math.floor(box.minX),
            Math.floor(box.minY),
            Math.floor(box.width),
            Math.floor(box.height)
        );
    }

    update(dt: number) {
        this.x += this.velocity.x * dt / 1000;
        this.y += this.velocity.y * dt / 1000;
    }
}

class PlayerShip extends ShooterObject {
    constructor() {
        super(20, 150, new BBox(
            -3, -24, 24, 48
        ));
    }
}

export class ShooterStage extends Stage {
    player: PlayerShip;

    constructor(config: ShooterStageConfig) {
        super();
        
        this.player = new PlayerShip();
        this.player.velocity = new Vector(20, 40);
    }

    update(dt: number) {
        this.player.update(dt);
    }

    render(context: CanvasRenderingContext2D) {
        context.fillStyle = "black";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        this.player.render(context);
    }

    input(event: GameInputEvent) {
        console.log(event);
    }
}