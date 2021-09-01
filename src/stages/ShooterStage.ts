import { GameInputEvent } from "../engine/GameInputEvent";
import { Stage } from "../engine/Stage";
import { Vector } from "../util/Vector";
import { ShooterObject } from "./shooter/ShooterObject";
import { PlayerShip } from "./shooter/PlayerShip";
import { EnemyShip } from "./shooter/EnemyShip";
import { Timer } from "../util/Timer";
import { randomFromRange } from "../util/random";
import { BBox } from "../util/BBox";

type ShooterStageConfig = {
    background: HTMLImageElement,
    dimensions: Vector,
};

export class ShooterStage extends Stage {
    player: PlayerShip;
    objects: ShooterObject[];
    enemySpawnTimer: Timer;
    screenBBox: BBox;

    constructor(config: ShooterStageConfig) {
        super();
        
        this.player = new PlayerShip();
        this.player.velocity = new Vector(20, 40);
        this.objects = [];
        this.enemySpawnTimer = new Timer(1000, () => {
            const randomY = randomFromRange(50, 250);
            const enemy = new EnemyShip(420, randomY);
            this.addObject(enemy);
        });
        this.screenBBox = new BBox(0, 0, config.dimensions.x, config.dimensions.y);

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

    private shouldRemoveObject(object: ShooterObject): boolean {
        if (object === this.player) return false;
        return object.x < -100 || object.x > this.screenBBox.width + 100;
    }

    /** If object is outside of screen, puts it on the screen's edge  */
    private forceIntoScreen(object: ShooterObject) {
        const ebbox = object.effectiveBBox;
        if (ebbox.minX < 0) {
            object.x = -object.bbox.minX;
        }
        if (ebbox.minY < 16) {
            object.y = -object.bbox.minY + 16;
        }
        if (ebbox.maxX >= this.screenBBox.width) {
            object.x = this.screenBBox.width - object.bbox.width - object.bbox.minX;
        }
        if (ebbox.maxY >= this.screenBBox.height) {
            object.y = this.screenBBox.height - object.bbox.height - object.bbox.minY;
        }
    }

    update(dt: number) {
        this.enemySpawnTimer.update(dt);

        const deletedObjects: Set<ShooterObject> = new Set();
        for (const object of this.objects) {
            if (this.shouldRemoveObject(object)) {
                deletedObjects.add(object);
                continue;
            }
            object.update(dt);
        }
        this.objects = this.objects.filter(x => !deletedObjects.has(x));

        this.forceIntoScreen(this.player);
    }

    render(context: CanvasRenderingContext2D) {
        context.fillStyle = "black";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        for (const object of this.objects) {
            object.render(context);
        }

        context.fillStyle = "white";
        context.font = "8px amiga4ever"
        context.fillText(`${this.player.directionSymbol.padEnd(2, "_")} | ${this.objects.length}`, 5, 15);
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