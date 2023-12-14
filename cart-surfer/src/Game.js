export default class Game extends Phaser.Scene
{
    constructor ()
    {
        super("Game");
    }

    create()
    {
        this.mine = this.add.sprite(0, 0, "Mine").setOrigin(457, 138); // Something about the position, origin, or size of the image here is pushing it off-screen. I may need to adjust the image itself.
        this.cart = this.add.sprite(360, 240, "Cart");

        this.anims.create({
            key: "MineStraight",
            frames: this.anims.generateFrameNumbers("Mine", { start: 0, end: 47 }),
            framerate: 60,
            repeat: -1
        });

        this.anims.create({
            key: "CartRun",
            frames: this.anims.generateFrameNumbers("Cart", { start: 0, end: 39 }),
            framerate: 30,
            repeat: -1
        });
    }

    update()
    {
        this.mine.anims.play("MineStraight", true);
        this.cart.anims.play("CartRun", true);
    }
}