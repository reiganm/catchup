import { elt } from "./util/elt";
import { Game } from "./engine/Game";
import { SplashScreenStage } from "./stages/SplashScreenStage";
import { ShooterStage } from "./stages/ShooterStage";
import { CutsceneStage } from "./stages/CutsceneStage";
import { FadeTransition } from "./transitions/FadeTransition";
import { Vector } from "./util/Vector";
import { loadImage } from "./util/loadImage";
import { sampleEnemyScript } from "./stages/shooter/EnemyScript";
import { enableInvincibilityCheat } from "./stages/ShooterStage";

Object.defineProperty(window, "CATMODE", { get() {
    enableInvincibilityCheat();
    return "The cat now has infinite lives.";
}});
function main() {
    const screenDimensions = new Vector(400, 300);
    const canvas = elt.canvas(screenDimensions.x, screenDimensions.y);
    document.body.appendChild(canvas);

    const game = new Game(canvas);
    Promise.all([
        loadImage("img/title.png"),
        loadImage("img/bathroom.png"),
    ]).then(([image1, image2]) => {
        const splash = new SplashScreenStage(screenDimensions, image1, () => {
            const cutscene = new CutsceneStage([{
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
            }].slice(0, 1), screenDimensions, () => {
                image2.style.imageRendering = "pixelated";
                const shooter = new ShooterStage({ 
                    background: image2,
                    screenDimensions: screenDimensions,
                    level: {
                        cameraHeight: 20,
                        cameraCenter: 200,
                        closeness: 10,
                        ceilHeight: 90,
                        totalHeight: 300,
                        ambientBrightness: 0.2,
                    },
                    enemyScript: sampleEnemyScript,
                    lives: 9,
                }, (result) => {
                    console.log("wow cool", result); 
                });

                game.transition((stage) => {
                    return new FadeTransition(stage, shooter, 1000, screenDimensions);
                }, "replace");

            });

            game.transition((stage) => {
                return new FadeTransition(stage, cutscene, 200, screenDimensions);
            }, "replace");
        });

        game.pushStage(splash);
        game.run(10);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    main();
});
