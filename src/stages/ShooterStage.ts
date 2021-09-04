import { GameInputEvent } from "../engine/GameInputEvent";
import { Stage } from "../engine/Stage";
import { Vector } from "../util/Vector";
import { ShooterObject } from "./shooter/ShooterObject";
import { PlayerShip } from "./shooter/PlayerShip";
import { Timer } from "../util/Timer";
import { randomFromRange } from "../util/random";
import { EnemyScript } from "./shooter/EnemyScript";
import { ObjectSpawner } from "./shooter/ObjectSpawner";


type LevelConfig = {
    cameraHeight: number,
    cameraCenter: number,
    closeness: number,
    ceilHeight: number,
    totalHeight: number,
    ambientBrightness: number,
};

type ShooterStageConfig = {
    background: HTMLImageElement,
    screenDimensions: Vector,
    level: LevelConfig,
    enemyScript: string[]
};

const BACKGROUND_SCROLL_SPEED = 10;

export class ShooterStage extends Stage {
    levelConfig: LevelConfig;
    player: PlayerShip;
    objects: ShooterObject[];
    background: HTMLImageElement;
    backgroundScrollTimer: Timer;
    enemyScript: EnemyScript;

    constructor(config: ShooterStageConfig) {
        super(config.screenDimensions);
        
        this.levelConfig = config.level;
        this.player = new PlayerShip();
        this.objects = [];
        this.background = config.background;

        this.backgroundScrollTimer = new Timer("repeat", 1000 * BACKGROUND_SCROLL_SPEED, () => {
            // do nothing
        });

        this.enemyScript = new EnemyScript(
            this.makeObjectSpawner(),
            this.screenDimensions,
            config.enemyScript
        );

        this.addObject(this.player);
    }

    private makeObjectSpawner(): ObjectSpawner {
        const stage = this;
        return {
            spawn(object: ShooterObject) {
                stage.addObject(object);
            },
            despawn(object: ShooterObject) {
                stage.removeObject(object);
            }
        };
    }

    private addObject(object: ShooterObject) {
        this.objects.push(object);
        object.spawner = this.makeObjectSpawner();
    }

    private removeObject(object: ShooterObject) {
        const index = this.objects.findIndex(x => x === object);
        if (index === -1) {
            console.warn("attempting to remove non-spawned object:", object);
            return;
        }
        const [removedObject] = this.objects.splice(index, 1);
        removedObject.spawner = null;
    }

    private shouldRemoveObject(object: ShooterObject): boolean {
        if (object === this.player) return false;
        return object.x < -100 || object.x > this.screenDimensions.x + 100;
    }

    /** If object is outside of screen, puts it on the screen's edge  */
    private forceIntoScreen(object: ShooterObject) {
        const ebbox = object.effectiveBBox;
        if (ebbox.minX < 0) {
            object.x = -object.localBBox.minX;
        }
        if (ebbox.minY < 16) {
            object.y = -object.localBBox.minY + 16;
        }
        if (ebbox.maxX >= this.screenDimensions.x) {
            object.x = this.screenDimensions.x - object.localBBox.width - object.localBBox.minX;
        }
        if (ebbox.maxY >= this.screenDimensions.y) {
            object.y = this.screenDimensions.y - object.localBBox.height - object.localBBox.minY;
        }
    }

    update(dt: number) {
        this.backgroundScrollTimer.update(dt);
        this.enemyScript.update(dt);

        for (const object of this.objects.slice()) {
            if (this.shouldRemoveObject(object)) {
                this.removeObject(object);
                continue;
            }
            object.update(dt);

            if (object.targetCollisionGroup !== null) {
                const ebbox = object.effectiveBBox;
                const collidedObjects = this.objects.filter(
                    x => (
                        x.collisionGroup == object.targetCollisionGroup
                        && ebbox.isIntersecting(x.effectiveBBox)
                    )
                );
                for (const collidedObject of collidedObjects) {
                    object.collideWithObject(collidedObject);
                }
            }
        }

        this.forceIntoScreen(this.player);
    }

    render(context: CanvasRenderingContext2D) {
        context.fillStyle = "black";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        const blockHeight = 3;
        for (let i = 0; i < this.screenDimensions.y; i+=blockHeight) {
            const level = this.levelConfig;
            const backgroundOffset = -Math.floor(this.background.width * this.backgroundScrollTimer.progress);
            const floorLevel = level.totalHeight - level.ceilHeight;
            const rowZoom = ((x) => {
                if (x <= level.ceilHeight) {
                    return -level.closeness/level.ceilHeight*x + level.closeness + 1;
                } else if (x <= floorLevel) {
                    return 1;
                } else {
                    return level.closeness/level.ceilHeight*(x - floorLevel) + 1;
                }
            })(i - level.cameraHeight);
            for (const localOffset of [-this.background.width, 0, +this.background.width]) {
                context.globalAlpha = 1 - 1 / rowZoom + level.ambientBrightness;
                context.drawImage(
                    this.background,
                    0, i, this.background.width, blockHeight,
                    rowZoom * (localOffset + backgroundOffset) + level.cameraCenter, i, rowZoom * this.background.width, blockHeight
                );
            }
        }

        context.globalAlpha = 1.0;

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