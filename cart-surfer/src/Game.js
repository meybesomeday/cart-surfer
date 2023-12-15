export default class Game extends Phaser.Scene
{
    constructor ()
    {
        super("Game");
    }

    preload()
    {
        this.input.setDefaultCursor("default");
    }

    create()
    {
        const width = 380;
        const height = 240;
        this.mine = this.add.sprite(width, height, "Mine"); // TODO: replace all vertical spritesheets with packed spritesheets in Aseprite
        this.cart = this.add.image(270, 320, "Cart"); // TODO: figure out positioning of all cart sprites in scene
        this.wobble = this.add.sprite(270, 320, "Wobble");
        this.wobble.visible = false;

        this.anims.create({
            key: "MineStraight",
            frames: this.anims.generateFrameNumbers("Mine", { start: 0, end: 25 }),
            framerate: 1,
            repeat: -1
        });

        this.anims.create({
            key: "CartWobble",
            frames: this.anims.generateFrameNumbers("Wobble", { start: 0, end: 39 }),
            framerate: 30,
            repeat: -1
        });
        PhaserGUIAction(this);
    }

    update()
    {
        this.mine.anims.play("MineStraight", true);
        // this.cart.anims.play("CartWobble", true);
    }
}