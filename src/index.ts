import { elt } from "./util/elt";
import { Game } from "./engine/Game";

const canvas = elt.canvas(400, 300);
const game = new Game(canvas);
document.appendChild(canvas);
game.run(10);