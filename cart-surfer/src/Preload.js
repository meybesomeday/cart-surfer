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

        this.load.spritesheet("MineStraight", "sprites/Sprite_26/sheet.png", { frameWidth: 760, frameHeight: 480 });
        this.load.spritesheet("MineTurn", "sprites/Sprite_326/sheet.png", { frameWidth: 760, frameHeight: 480 });
        this.load.spritesheet("MineTurnSigns", "sprites/Sprite_329/sheet.png", { frameWidth: 760, frameHeight: 480 });
        this.load.spritesheet("MineEnd", "sprites/Sprite_333/sheet.png", { frameWidth: 760, frameHeight: 480 });

        this.load.multiatlas("Cart", "sprites/cart/cart.json", "assets/sprites/cart");
    }

    create ()
    {
        this.scene.start("Game");
    }
}