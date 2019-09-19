import { Game } from "./src/Game.js";

const stageElement = document.getElementById("stage");
const game = new Game({ stageElement });
game.setUp();
