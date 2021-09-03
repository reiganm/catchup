import { elt } from "./util/elt";
import { Game } from "./engine/Game";
import { SplashScreenStage } from "./stages/SplashScreenStage";
import { ShooterStage } from "./stages/ShooterStage";
import { CutsceneStage } from "./stages/CutsceneStage";
import { FadeTransition } from "./transitions/FadeTransition";
import { Vector } from "./util/Vector";
import { loadImage } from "./util/loadImage";

function main() {
    const screenDimensions = new Vector(400, 300);
    const canvas = elt.canvas(screenDimensions.x, screenDimensions.y);
    document.body.appendChild(canvas);

    const game = new Game(canvas);
    Promise.all([
        loadImage("img/test-splash.png"),
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
                    screenDimensions: screenDimensions
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
