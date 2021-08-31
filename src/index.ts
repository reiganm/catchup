import { elt } from "./util/elt";
import { Game } from "./engine/Game";
import { SplashScreenStage } from "./stages/SplashScreenStage";

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
            const otherSplash = new SplashScreenStage(image2, () => {
                game.popFrontStage();
            });

            game.popFrontStage();
            game.pushStage(otherSplash);
        });

        game.pushStage(splash);
        game.run(10);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    main();
});
