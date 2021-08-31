import { elt } from "./util/elt";
import { Game } from "./engine/Game";
import { SplashScreenStage } from "./stages/SplashScreenStage";

function main() {
    const canvas = elt.canvas(400, 300);
    document.body.appendChild(canvas);

    const game = new Game(canvas);
    const image = elt.image("img/test-splash.png", (image) => {
        const splash = new SplashScreenStage(image, () => {
            console.log("splash finished");
        });

        game.pushStage(splash);
        game.run(10);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    main();
});
