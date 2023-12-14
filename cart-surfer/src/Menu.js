export default class Menu extends Phaser.Scene
{
    constructor ()
    {
        super("Menu");
    }

    create ()
    {
        const width = 380;
        const height = 240;
        this.add.image(0, 0, "menu").setOrigin(0, 0);
        const instructionsScreen = this.add.image(width, height, "instructions");
        instructionsScreen.visible = false;

        const playIcon = this.add.image(width + 155, height + 118, "playButton").setOrigin(0, 0);
        playIcon.setInteractive();

        playIcon.on(Phaser.Input.Events.POINTER_OVER, () => {
            this.input.setDefaultCursor("pointer");
        });

        playIcon.on(Phaser.Input.Events.POINTER_OUT, () => {
            this.input.setDefaultCursor("default");
        });

        playIcon.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.scene.start("Game");
        });

        const instructionsIcon = this.add.image(width + 155, height + 173, "instructionsButton").setOrigin(0, 0);
        instructionsIcon.setInteractive();

        instructionsIcon.on(Phaser.Input.Events.POINTER_OVER, () => {
            this.input.setDefaultCursor("pointer");
        });

        instructionsIcon.on(Phaser.Input.Events.POINTER_OUT, () => {
            this.input.setDefaultCursor("default");
        });

        const instructionsPlayIcon = this.add.image(588, 394, "instructionsPlayButton").setOrigin(0, 0);
        instructionsPlayIcon.setInteractive();
        instructionsPlayIcon.visible = false;

        instructionsPlayIcon.on(Phaser.Input.Events.POINTER_OVER, () => {
            this.input.setDefaultCursor("pointer");
        });

        instructionsPlayIcon.on(Phaser.Input.Events.POINTER_OUT, () => {
            this.input.setDefaultCursor("default");
        });
        instructionsPlayIcon.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.scene.start("Game");
        });

        instructionsIcon.on(Phaser.Input.Events.POINTER_DOWN, () => {
            playIcon.visible = false;
            instructionsIcon.visible = false;
            instructionsScreen.visible = true;
            instructionsPlayIcon.visible = true;
        });
    }
}