import Preload from "./src/Preload.js";
import Menu from "./src/Menu.js";
import Game from "./src/Game.js";

const config = {
    title: "Cart Surfer",
    type: Phaser.AUTO,
    width: 760,
    height: 480,
    scene: [Preload, Menu, Game]
};

const game = new Phaser.Game(config);