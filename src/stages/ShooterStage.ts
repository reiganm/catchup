import { GameInputEvent } from "../engine/GameInputEvent";
import { Stage } from "../engine/Stage";
import { Vector } from "../util/Vector";
import { ShooterObject } from "./shooter/ShooterObject";
import { PlayerShip } from "./shooter/PlayerShip";
import { EnemyShip } from "./shooter/EnemyShip";
import { Timer } from "../util/Timer";
import { randomFromRange } from "../util/random";

type ShooterStageConfig = {
    background: HTMLImageElement,
    screenDimensions: Vector,
};

const BACKGROUND_SCROLL_SPEED = 10;

export class ShooterStage extends Stage {
    player: PlayerShip;
    objects: ShooterObject[];
    background: HTMLImageElement;
    backgroundScrollTimer: Timer;
    enemySpawnTimer: Timer;

    constructor(config: ShooterStageConfig) {
        super(config.screenDimensions);
        
        this.player = new PlayerShip();
        this.objects = [];
        this.background = config.background;

        this.backgroundScrollTimer = new Timer("repeat", 1000 * BACKGROUND_SCROLL_SPEED, () => {
            
        });

        this.enemySpawnTimer = new Timer("repeat", 1000, () => {
            const randomY = randomFromRange(50, 250);
            const enemy = new EnemyShip(420, randomY);
            this.addObject(enemy);
        });

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
        this.enemySpawnTimer.update(dt);

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

        context.globalAlpha = 0.5;
        const backgroundOffset = -Math.floor(this.background.width * this.backgroundScrollTimer.progress);
        context.drawImage(this.background, backgroundOffset, 0);
        context.drawImage(this.background, this.background.width + backgroundOffset, 0);
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