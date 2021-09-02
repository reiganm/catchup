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
        loadImage("img/test-splash-2.png"),
    ]).then(([image1, image2]) => {
        const splash = new SplashScreenStage(screenDimensions, image1, () => {
            // const shooter = new ShooterStage({ 
                // background: image2,
                // dimensions: new Vector(400, 300),
            // });
            const shooter = new CutsceneStage([{
                imageSrc: "img/test-scene-1.png",
                dialogue: [
                    "hello, hello, this is a test dialogue; ".repeat(5),
                    "meow meow meow",
                ]
            }, {
                imageSrc: "img/test-scene-2.png",
                dialogue: [
                    "this should scroll from left to right",
                    "it looks cool that way",
                    "if it doesn't, you probably need to make it scroll, meow...",
                ]
            }], screenDimensions);

            game.transition((stage) => {
                return new FadeTransition(stage, shooter, 200, screenDimensions);
            }, "replace");
        });

        game.pushStage(splash);
        game.run(10);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    main();
});
