export default class Game extends Phaser.Scene
{
    constructor ()
    {
        super("Game");
    }

    create()
    {
        this.mine = this.add.sprite(380, 240, "Mine"); // why won't this work. even if I load and add the sheet as an image with no anims it just shows black. help.
        this.cart = this.add.sprite(380, 240, "Cart");

        this.anims.create({
            key: "MineStraight",
            frames: this.anims.generateFrameNumbers("Mine", { start: 0, end: 25 }),
            framerate: 1,
            repeat: -1
        });

        this.anims.create({
            key: "CartRun",
            frames: this.anims.generateFrameNumbers("Cart", { start: 0, end: 39 }),
            framerate: 30,
            repeat: -1
        });
        PhaserGUIAction(this);
    }

    update()
    {
        this.mine.anims.play("MineStraight", true);
        this.cart.anims.play("CartRun", true);
    }
}