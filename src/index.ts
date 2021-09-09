import { elt } from "./util/elt";
import { Game } from "./engine/Game";
import { SplashScreenStage } from "./stages/SplashScreenStage";
import { 
    ShooterStage,
    ShooterStageConfig,
    ShooterStageCompleteResult
} from "./stages/ShooterStage";
import { CutsceneStage, SceneDefinition } from "./stages/CutsceneStage";
import { FadeTransition } from "./transitions/FadeTransition";
import { Vector } from "./util/Vector";
import { loadImage } from "./util/loadImage";
import { enableInvincibilityCheat } from "./stages/ShooterStage";
import { Stage } from "./engine/Stage";
import { LoadingStage } from "./stages/LoadingStage";
import { ImageLibrary } from "./ImageLibrary";
import { LevelDefinition, FINAL_CUTSCENE, LEVELS } from "./levels";
import { CreditsStage } from "./stages/CreditsStage";
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

class Jukebox {
    currentMusic: HTMLAudioElement;

    constructor() {
        this.currentMusic = null;
    }

    stopMusic() {
        if (this.currentMusic === null) {
            return;
        }

        this.currentMusic.currentTime = 0;
        this.currentMusic.pause();
    }

    playMusic(audio: HTMLAudioElement) {
        this.stopMusic();
        audio.loop = true;
        audio.play();
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

    private showLoadingScreen(): Promise<void> {
        return this.fadeInto(new LoadingStage(SCREEN_DIMENSIONS), 200);
    }

    private fadeInto(toStage: Stage, duration: number): Promise<void> {
        if (this.game.hasStages) {
            return this.game.transition((fromStage) => {
                return new FadeTransition(fromStage, toStage, duration, SCREEN_DIMENSIONS, "black");
            }, "replace");
        } else {
            this.game.pushStage(toStage);
            return Promise.resolve();
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
        config: ShooterStageConfig,
        bossMusic: HTMLAudioElement
    ): Promise<{
        result: ShooterStageCompleteResult,
        remainingLives: number
    }> {
        return new Promise((resolve) => {
            const shooter = new ShooterStage(
                config,
                () => {
                    this.jukebox.playMusic(bossMusic);
                },
                (result) => {
                    resolve({ result, remainingLives: shooter.lives });
                });
            this.fadeInto(shooter, 200);
        });
    }

    private playSplash(
        imageSrc: string
    ): Promise<void> {
        return loadImage(imageSrc)
            .then((image) => {
                return new Promise((resolve) => {
                    const splash = new SplashScreenStage(SCREEN_DIMENSIONS, image, resolve);
                    this.fadeInto(splash, 200);
                });
            });
    }

    async playCredits() {
        return new Promise((resolve) => {
            const credits = new CreditsStage(
                SCREEN_DIMENSIONS
            );
            this.fadeInto(credits, 200);
        });
    }

    async playGame() {
        this.game.run(10);
        while (true) {
            await this.playSplash("img/quote.png");
            await this.showLoadingScreen();
            await ImageLibrary.instance.loadImages();
            const titleMusic = await loadAudio("music/title.mp3");
            this.jukebox.playMusic(titleMusic);
            await this.playSplash("img/title.png");
            for (const level of this.levels) {
                await this.showLoadingScreen();
                const cutsceneMusic = await loadAudio("music/cutscene.mp3");
                this.jukebox.playMusic(cutsceneMusic);
                await this.playCutscene(level.introCutscene);

                let lives = 9;
                while (true) {
                    await this.showLoadingScreen();
                    const background = await loadImage(level.shooterBackgroundSrc);
                    const music = await loadAudio(level.musicSrc);
                    const bossMusic = await loadAudio(level.bossMusicSrc);
                    const shotSound = await loadAudio("snd/shot.wav");
                    const explosionSound = await loadAudio("snd/explosion.wav");
                    this.jukebox.playMusic(music);
                    const result = await this.playLevel({
                        background,
                        screenDimensions: SCREEN_DIMENSIONS,
                        level: level.levelConfig,
                        lives,
                        enemyScript: level.enemyScript,
                        noisemaker: {
                            playShotSound() {
                                shotSound.pause();
                                shotSound.currentTime = 0;
                                shotSound.play();
                            },
                            playExplosionSound() {
                                explosionSound.pause();
                                explosionSound.currentTime = 0;
                                explosionSound.play();
                            }
                        }
                    }, bossMusic); 
                    if (result.result === "victory") {
                        lives = result.remainingLives;
                        break;
                    } else {
                        lives = 9;
                    }
                }
            }
            await this.showLoadingScreen();
            const endingMusic = await loadAudio("music/ending.mp3");
            this.jukebox.playMusic(endingMusic);
            await this.playCutscene(this.finalCutscene);
            this.jukebox.playMusic(titleMusic);
            await this.playCredits();
        }
    }
}

function main() {
    const canvas = elt.canvas(SCREEN_DIMENSIONS.x, SCREEN_DIMENSIONS.y);
    document.body.appendChild(canvas);

    const game = new Game(canvas);
    const controller = new GameController(game, new Jukebox(), LEVELS, FINAL_CUTSCENE);

    controller.playGame();
}

document.addEventListener("DOMContentLoaded", () => {
    main();
});
