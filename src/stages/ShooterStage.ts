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

type ControlDirection = "w" | "a" | "s" | "d";

function oppositeDirection(direction: ControlDirection): ControlDirection {
    const opposites: { [key: string]: ControlDirection } = {
        "w": "s",
        "a": "d",
        "s": "w",
        "d": "a",
    };
    return opposites[direction];
}

class PlayerShip extends ShooterObject {
    activeDirections: Set<ControlDirection>;
    maximumSpeed: number;

    constructor() {
        super(20, 150, new BBox(
            -3, -24, 24, 48
        ));

        this.maximumSpeed = 250;
        this.activeDirections = new Set();
    }

    get directionSymbol(): string {
        return Array.from(this.activeDirections).sort().join("");
    }

    addDirection(direction: ControlDirection) {
        this.activeDirections.add(direction);
        this.activeDirections.delete(oppositeDirection(direction));
    }

    subtractDirection(direction: ControlDirection) {
        this.activeDirections.delete(direction);
    }

    update(dt: number) {
        switch (this.directionSymbol) {
            case "w":
                this.velocity = new Vector(0, -1);
                break;
            case "a":
                this.velocity = new Vector(-1, 0);
                break;
            case "s":
                this.velocity = new Vector(0, 1);
                break;
            case "d":
                this.velocity = new Vector(1, 0);
                break;
            case "aw":
                this.velocity = new Vector(-1, -1);
                break;
            case "as":
                this.velocity = new Vector(-1, 1);
                break;
            case "ds":
                this.velocity = new Vector(1, 1);
                break;
            case "dw":
                this.velocity = new Vector(1, -1);
                break;
            default:
                this.velocity = new Vector(0, 0);
        }

        if (!this.velocity.isNull) {
            this.velocity = this.velocity
                .normalized()
                .scaled(this.maximumSpeed);
        }

        super.update(dt);
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

        context.fillStyle = "white";
        context.fillText(`${this.player.directionSymbol}`, 5, 15);
    }

    input(event: GameInputEvent) {
        switch (event.key.toLowerCase()) {
            case "w":
            case "ц":
            case "arrowup":
                if (event.state === "down") {
                    this.player.addDirection("w");
                } else if (event.state === "up") {
                    this.player.subtractDirection("w");
                }
                break;
            case "a":
            case "ф":
            case "arrowleft":
                if (event.state === "down") {
                    this.player.addDirection("a");
                } else if (event.state === "up") {
                    this.player.subtractDirection("a");
                }
                break;
            case "s":
            case "ы":
            case "arrowdown":
                if (event.state === "down") {
                    this.player.addDirection("s");
                } else if (event.state === "up") {
                    this.player.subtractDirection("s");
                }
                break;
            case "d":
            case "в":
            case "arrowright":
                if (event.state === "down") {
                    this.player.addDirection("d");
                } else if (event.state === "up") {
                    this.player.subtractDirection("d");
                }
                break;
        }
    }
}