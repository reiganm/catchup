import { GameInputEvent } from "../engine/GameInputEvent";
import { Stage } from "../engine/Stage";
import { Vector } from "../util/Vector";
import { BBox } from "../util/BBox";

type ShooterStageConfig = {
    background: HTMLImageElement
};

/** Object that ShooterObjects can request to spawn other objects like bullets */
interface ObjectSpawner {
    spawn(object: ShooterObject)
    despawn(object: ShooterObject)
}

/** Generic class for shooter stage objects: ships, bullets, powerups, etc. */
class ShooterObject {
    x: number;
    y: number;
    velocity: Vector;
    bbox: BBox;
    spawner: ObjectSpawner;

    constructor(x: number, y: number, bbox: BBox) {
        this.x = x;
        this.y = y;
        this.velocity = new Vector(0, 0);
        this.bbox = bbox;
    }

    /** BBox of the object but in world coordinates */
    get effectiveBBox(): BBox {
        return this.bbox.translated(this.x, this.y);
    }

    render(context: CanvasRenderingContext2D) {
        const box = this.effectiveBBox;
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
    isShooting: boolean;
    shootingTimer: number;
    shootingTimerResetValue: number;

    constructor() {
        super(20, 150, new BBox(
            -3, -24, 24, 48
        ));

        this.maximumSpeed = 250;
        this.activeDirections = new Set();
        this.isShooting = false;
        this.shootingTimer = 0;
        this.shootingTimerResetValue = 250;
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

    startShooting() {
        this.isShooting = true;
    }

    stopShooting() {
        this.isShooting = false;
    }

    update(dt: number) {
        this.shootingTimer = Math.max(this.shootingTimer - dt, 0);
        if (this.isShooting && this.shootingTimer === 0 ) {
            this.shootingTimer = this.shootingTimerResetValue;
            const box = this.effectiveBBox;
            this.spawner.spawn(new Bullet(
                box.minX + box.width,
                box.minY + box.height / 2
            ));
        }

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

class Bullet extends ShooterObject {
    constructor(x: number, y: number) {
        super(x, y, new BBox(
            0, -2, 8, 4
        ));

        this.velocity = new Vector(500, 0);
    }
}

export class ShooterStage extends Stage {
    player: PlayerShip;
    objects: ShooterObject[];

    constructor(config: ShooterStageConfig) {
        super();
        
        this.player = new PlayerShip();
        this.player.velocity = new Vector(20, 40);
        this.objects = [];

        this.addObject(this.player);
    }

    private addObject(object: ShooterObject) {
        this.objects.push(object);
        const stage = this;
        object.spawner = {
            spawn(object: ShooterObject) {
                stage.addObject(object);
            },
            despawn(object: ShooterObject) {
                stage.removeObject(object);
            }
        };
    }

    private removeObject(object: ShooterObject) {
        const index = this.objects.findIndex(x => x === object);
        if (index === -1) {
            console.warn("attempting to remove non-spawned object:", object);
            return;
        }
        const [removedObject] = this.objects.splice(index);
        removedObject.spawner = null;
    }

    update(dt: number) {
        for (const object of this.objects) {
            object.update(dt);
        }
    }

    render(context: CanvasRenderingContext2D) {
        context.fillStyle = "black";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        for (const object of this.objects) {
            object.render(context);
        }

        context.fillStyle = "white";
        context.font = "8px amiga4ever"
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
            case " ":
                if (event.state === "down") {
                    this.player.startShooting();
                } else if (event.state === "up") {
                    this.player.stopShooting();
                }
                break;
        }
    }
}