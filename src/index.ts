import { elt } from "./util/elt";
import { Game } from "./engine/Game";
import { SplashScreenStage } from "./stages/SplashScreenStage";
import { ShooterStage } from "./stages/ShooterStage";
import { FadeTransition } from "./transitions/FadeTransition";

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        elt.image(src, (image) => {
            resolve(image);
        }).onerror = reject;
    });
}

function main() {
    const canvas = elt.canvas(400, 300);
    document.body.appendChild(canvas);

    const game = new Game(canvas);
    Promise.all([
        loadImage("img/test-splash.png"),
        loadImage("img/test-splash-2.png"),
    ]).then(([image1, image2]) => {
        const splash = new SplashScreenStage(image1, () => {
            const shooter = new ShooterStage({ 
                background: image2
            });

            game.transition((stage) => {
                return new FadeTransition(stage, shooter, 200);
            }, "replace");
        });

        game.pushStage(splash);
        game.run(10);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    main();
});
