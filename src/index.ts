import { elt } from "./util/elt";
import { Game } from "./engine/Game";
import { SplashScreenStage } from "./stages/SplashScreenStage";
import { 
    ShooterStage,
    ShooterStageConfig,
    ShooterStageCompleteResult,
    LevelConfig
} from "./stages/ShooterStage";
import { CutsceneStage, SceneDefinition } from "./stages/CutsceneStage";
import { FadeTransition } from "./transitions/FadeTransition";
import { Vector } from "./util/Vector";
import { loadImage } from "./util/loadImage";
import { EnemyScript, sampleEnemyScript } from "./stages/shooter/EnemyScript";
import { enableInvincibilityCheat } from "./stages/ShooterStage";
import { Stage } from "./engine/Stage";
import { Transition } from "./engine/Transition";

const SCREEN_DIMENSIONS = new Vector(400, 300);

Object.defineProperty(window, "CATMODE", { get() {
    enableInvincibilityCheat();
    return "The cat now has infinite lives.";
}});

type LevelDefinition = {
    shooterBackgroundSrc: string
    levelConfig: LevelConfig
    introCutscene: SceneDefinition[]
    enemyScript: string[]
};

class GameController {
    game: Game;
    levels: LevelDefinition[];
    finalCutscene: SceneDefinition[];

    constructor(
        game: Game,
        levels: LevelDefinition[],
        finalCutscene: SceneDefinition[]
    ) {
        this.game = game;
        this.levels = levels;
        this.finalCutscene = finalCutscene;
    }

    private fadeInto(toStage: Stage, duration: number) {
        if (this.game.hasStages) {
            this.game.transition((fromStage) => {
                return new FadeTransition(fromStage, toStage, duration, SCREEN_DIMENSIONS);
            }, "replace");
        } else {
            this.game.pushStage(toStage);
        }
    }

    private playCutscene(
        scenes: SceneDefinition[]
    ): Promise<void> {
        return new Promise((resolve ) => {
            const cutscene = new CutsceneStage(scenes, SCREEN_DIMENSIONS, resolve);
            this.fadeInto(cutscene, 1000);
        });
    }

    private playLevel(
        config: ShooterStageConfig 
    ): Promise<{
        result: ShooterStageCompleteResult,
        remainingLives: number
    }> {
        return new Promise((resolve) => {
            const shooter = new ShooterStage(config, (result) => {
                resolve({ result, remainingLives: shooter.lives });
            });
            this.fadeInto(shooter, 1000);
        });
    }

    private playSplash(
        imageSrc: string
    ): Promise<void> {
        return loadImage(imageSrc)
            .then((image) => {
                return new Promise((resolve) => {
                    const splash = new SplashScreenStage(SCREEN_DIMENSIONS, image, resolve);
                    this.fadeInto(splash, 1000);
                });
            });
    }

    async playGame() {
        this.game.run(10);
        while (true) {
            await this.playSplash("img/title.png");
            for (const level of this.levels) {
                await this.playCutscene(level.introCutscene);

                let lives = 9;
                while (true) {
                    const background = await loadImage(level.shooterBackgroundSrc);
                    const result = await this.playLevel({
                        background,
                        screenDimensions: SCREEN_DIMENSIONS,
                        level: level.levelConfig,
                        lives,
                        enemyScript: level.enemyScript
                    }); 
                    if (result.result === "victory") {
                        lives = result.remainingLives;
                        break;
                    } else {
                        lives = 9;
                    }
                }
            }
            await this.playCutscene(this.finalCutscene);
        }
    }
}

const TEST_CUTSCENE: SceneDefinition[] = [{
    imageSrc: "img/test-scene-1.png",
    dialogues: [
        "meow meow meow",
    ]
}, {
    imageSrc: "img/test-scene-2.png",
    dialogues: [
        "this should scroll from left to right",
        "it looks cool that way",
        "if it doesn't, you probably need to make it scroll, meow...",
    ]
}];


function main() {
    const canvas = elt.canvas(SCREEN_DIMENSIONS.x, SCREEN_DIMENSIONS.y);
    document.body.appendChild(canvas);

    const game = new Game(canvas);
    const controller = new GameController(game, [{
        introCutscene: TEST_CUTSCENE,
        shooterBackgroundSrc: "img/bathroom.png",
        levelConfig: {
            cameraHeight: 20,
            cameraCenter: 200,
            closeness: 10,
            ceilHeight: 90,
            totalHeight: 300,
            ambientBrightness: 0.2,
        },
        enemyScript: sampleEnemyScript
    }], TEST_CUTSCENE);

    controller.playGame();
}

document.addEventListener("DOMContentLoaded", () => {
    main();
});
