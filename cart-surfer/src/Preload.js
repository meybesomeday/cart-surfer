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

        this.load.spritesheet("Mine", "sprites/Sprite_326/sheet.png", { frameWidth: 760, frameHeight: 480 });
        this.load.spritesheet("Cart", "sprites/Sprite_59/sheet.png", { frameWidth: 326, frameHeight: 260 });
    }

    create ()
    {
        this.scene.start("Menu");
    }
}