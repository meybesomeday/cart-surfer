export default class Preload extends Phaser.Scene
{
    constructor ()
    {
        super("Preload");
    }

    preload ()
    {
        this.load.setPath("assets/");

        this.load.image("menu", "sprites/Sprite_431/1.png");
        this.load.image("playButton", "sprites/Sprite_451/1.png");
        this.load.image("instructions", "sprites/Sprite_430/1.png");
        this.load.image("instructionsButton", "sprites/Sprite_452/1.png");
        this.load.image("instructionsPlayButton", "sprites/Sprite_453/1.png");

        // TODO game over screen to create in Game scene and make visible at game over
        // PLANNED modify the Menu scene to add custom options and gamemodes

        this.load.multiatlas("Mine", "sprites/mine/mine.json", "assets/sprites/mine");
        this.load.multiatlas("Cart", "sprites/cart/cart.json", "assets/sprites/cart");
    }

    create ()
    {
        this.scene.start("Menu");
    }
}