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
import { sampleEnemyScript } from "./stages/shooter/EnemyScript";
import { enableInvincibilityCheat } from "./stages/ShooterStage";
import { Stage } from "./engine/Stage";
import { Transition } from "./engine/Transition";

const CREDITS: string[] = [
    `CAT-CHING IS A CAT THING`,
    ``,
    ``,
    `Written and Directed by`,
    `Maria Reigan`,
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
]

const SCREEN_DIMENSIONS = new Vector(400, 300);

Object.defineProperty(window, "CATMODE", { get() {
    enableInvincibilityCheat();
    return "The cat now has infinite lives.";
}});

function loadAudio(src: string): Promise<HTMLAudioElement> {
    return new Promise((resolve) => {
        const audio = new Audio(src);
        audio.addEventListener("canplaythrough", () => resolve(audio));
    });
}

type LevelDefinition = {
    shooterBackgroundSrc: string
    levelConfig: LevelConfig
    introCutscene: SceneDefinition[]
    enemyScript: string[]
};

class Jukebox {
    currentMusic: HTMLAudioElement;

    constructor() {
        this.currentMusic = null;
    }

    stopMusic() {
        if (this.currentMusic === null) {
            return;
        }

        this.currentMusic.pause();
        this.currentMusic.currentTime = 0;
    }

    playMusic(audio: HTMLAudioElement) {
        this.stopMusic();
        audio.loop = true;
        audio.pause();
        this.currentMusic = audio;
    }
}

class GameController {
    game: Game;
    jukebox: Jukebox;
    levels: LevelDefinition[];
    finalCutscene: SceneDefinition[];

    constructor(
        game: Game,
        jukebox: Jukebox,
        levels: LevelDefinition[],
        finalCutscene: SceneDefinition[]
    ) {
        this.game = game;
        this.jukebox = jukebox;
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
            const audio = await loadAudio("music/title.mp3");
            this.jukebox.playMusic(audio);
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

const FINAL_CUTSCENE: SceneDefinition[] = [{
    imageSrc: "img/test-scene-2.png",
    dialogues: [
        `In a moment of inexplicable rage, detective Tom Catchup suddenly pounces at the suspect tomato and smashes it!`,
        `"Oh no!" Tom exclaims as he sees the deadly injured vegetable. "This is probably very illegal."`,
        `"As a police officer, I'm not supposed to smash suspects with my mighty paw. I truly have turned into a Tomato Hating Monster."`,
    ],
}, {
    imageSrc: "img/test-scene-1.png",
    dialogues: [
        `NEWS FLASH: Interrogator kills a tomato incident suspect! Investigation suggests personal motives.`,
        `Five baby tomatoes go to orphanage!`,
        `Protesters demand stricter mental check-ups for police officers!`,
    ],
}, {
    imageSrc: "img/test-scene-2.png",
    dialogues: [
        `Today former cat detective Tom Catchup serves a life sentence for the first degree murder.`,
        `"I don't regret anything! I hate tomatoes! Screw tomatoes!"`,
        `What a horrible person! Thanks to you, he's got what he deserved.`,
        `                    THE END`,
    ],
}];

const LEVELS: LevelDefinition[] = [{
    introCutscene: FINAL_CUTSCENE,
    shooterBackgroundSrc: "img/test-scene-1.png",
    levelConfig: {
        cameraHeight: 20,
        cameraCenter: 200,
        closeness: 10,
        ceilHeight: 90,
        totalHeight: 300,
        ambientBrightness: 0.2,
    },
    enemyScript: sampleEnemyScript
}, {
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
}];

function main() {
    const canvas = elt.canvas(SCREEN_DIMENSIONS.x, SCREEN_DIMENSIONS.y);
    document.body.appendChild(canvas);

    const game = new Game(canvas);
    const controller = new GameController(game, new Jukebox(), LEVELS, TEST_CUTSCENE);

    controller.playGame();
}

document.addEventListener("DOMContentLoaded", () => {
    main();
});
