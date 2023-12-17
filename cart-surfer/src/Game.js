export default class Game extends Phaser.Scene
{
    constructor ()
    {
        super("Game");

        this.gameOverCalled = false;
        this.isGameOver = false;
        this.isCrashed = false;
        this.myLives = 4;
        this.myScore = 0;
        this.screenScore = 0;
        this.points = 0;
        this.bonusPoints = 0;
        this.scores = {
            olie: 20,
            backflip: 100,
            slam: 30,
            spin: 80,
            handstand: 80,
            flap: 50,
            running: 80,
            grind: 80,
            slide: 40,
            lean: 10
        };

        this.stanceCounter = 0;
        this.maxStanceCounter = 24;
        this.isStanceCounterUsed = false;
        this.stance = "none";
        this.returnFrames = {
            none: "CartStraight",
            surfing: "CartSurfingStance",
            wheelie: "CartWheelieStance",
            jump: "CartJump"
        };

        this.isTrick = false;
        this.trick = undefined;
        this.spinDir = "none";
        this.lastTrick = undefined;
        this.isStraight = true; // couldn't be me
        this.numTricks = 0;
        this.numTricksInCart = 0;
        this.numTricksOutCart = 0;
        this.numUniqueTricks = 0;
        this.numGrindCorners = 0;
        this.numSurfCorners = 0;
        this.numFlipsInRow = 0;
        this.trickDone = {
            olie: "surfing",
            handstand: "surfing",
            backflip: "none",
            spin: "none",
            flap: "none",
            slam: "none",
            running: "none"
        };
        
        this.isMove = false;
        this.move = undefined;
        this.moveCounter = 0;
        this.maxCounter = {
            GrindMove: 28,
            SlideMove: 32,
            Move: 38
        };
        this.wobbling = false;

        this.mineSegments = [["MineStraight", /*flipped=*/false], ["MineTurn", false], ["MineTurn", true], ["MineTurnSigns", false], ["MineTurnSigns", true], ["MineEnd", false]];
        let mineHolder = [
            [1,1,4,2,1,5,3,1,1,4,2,5,3,1,1,1,4,2,4,2,1,1,5,3,5,3,1,1,6],
            [1,1,5,3,1,4,2,5,3,1,4,2,1,1,1,4,2,1,5,3,4,2,1,1,5,3,1,1,6],
            [1,1,1,5,3,1,1,1,4,2,1,4,2,1,5,3,4,2,1,5,3,1,4,2,5,3,1,1,6],
            [1,1,5,3,1,4,2,1,1,4,2,1,5,3,1,4,2,5,3,5,3,1,1,4,2,4,2,1,1,6],
            [1,1,1,5,3,4,2,1,4,2,1,1,5,3,1,5,3,4,2,1,5,3,1,1,4,2,1,1,6]
        ];

        this.isCorner = false;
        this.mySeg = 0;
        this.myLastSafeSeg = 0;
        this.currentSeg = this.myLastSafeSeg
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
        this.cart = this.add.sprite(width, height, "Cart", "Sprite_304_1.png");

        this.#generateAnims();
        this.play = true;
        this.input.keyboard.on('keydown', function (ev) {
            let key = ev.key;
            if (!this.isTrick && !this.isCrashed)
            {
                if (key == "w" || key == "ArrowUp") {
                    // do stuff
                }
            }
        })

        PhaserGUIAction(this);
    }

    update()
    {
        if (this.play == true) {
            this.mine.anims.play("MineStraight", true);
            this.#animPlayWrapper(this.cart, "CartStart", 370, 590);
            this.play = false;
        }
        if (!this.isCrashed)
        {
            if (this.isMove && !this.isCorner)
            {
                this.moveCounter += 1;
                if (this.moveCounter > this.maxCounter.Move)
                {
                    this.isCrashed = true;
                    //reduceLives();
                    stopGame();
                    //if (this.)
                }
            }
        }
    }

    gameOver()
    {
        if (!this.gameOverCalled)
        {
            this.gameOverCalled = true;
            this.isGameOver = true;
        }
    }

    #animPlayWrapper(sprite, name="CartDefault", posX=undefined, posY=undefined, flipX=false, flipY=false, displayWidth=undefined, displayHeight=undefined, ignoreIfPlaying=true) {
        if (posX) sprite.setX(posX);
        if (posY) sprite.setY(posY);
        if (!(displayWidth && displayHeight)) sprite.setScale(1, 1);
        else sprite.setDisplaySize(displayWidth, displayHeight);
        sprite.FlipX = flipX;
        sprite.FlipY = flipY;
        sprite.anims.play(name, ignoreIfPlaying);
    }

    #animCreator(name="CartDefault", key="Cart", spritenum=0, count=1, repeatcount=0)
    {
        this.anims.create({
            key: name,
            frames: this.anims.generateFrameNames(key, { prefix: "Sprite_"+spritenum+"_", suffix: ".png", start: 1,  end: count }),
            frameRate: 30,
            repeat: repeatcount
        });
    }

    #generateAnims()
    {
        this.anims.create({
            key: "MineStraight",
            frames: this.anims.generateFrameNumbers("MineStraight", { start: 0, end: 47 }),
            framerate: 1,
            repeat: -1
        });
        this.anims.create({
            key: "MineTurn",
            frames: this.anims.generateFrameNumbers("MineTurn", { start: 0, end: 25 }),
            framerate: 1,
            repeat: 0
        });
        this.anims.create({
            key: "MineTurnSigns",
            frames: this.anims.generateFrameNumbers("MineTurnSigns", { start: 0, end: 47 }),
            framerate: 1,
            repeat: 0
        });
        this.anims.create({
            key: "MineEnd",
            frames: this.anims.generateFrameNumbers("MineEnd", { start: 0, end: 27 }),
            framerate: 1,
            repeat: 0
        });
        this.#animCreator("CartStraight", "Cart", 35, 1);
        this.#animCreator("CartLeanLeft", "Cart", 59, 40);
        this.#animCreator("CartLeanRight", "Cart", 60, 40);
        this.#animCreator("CartSurfing", "Cart", 84, 17);
        this.#animCreator("CartSurfingStance", "Cart", 85, 9);
        this.#animCreator("CartOllie", "Cart", 101, 20);
        this.#animCreator("CartSlideLeft", "Cart", 122, 41);
        this.#animCreator("CartSlideRight", "Cart", 139, 41);
        this.#animCreator("CartWheelie", "Cart", 150, 25);
        this.#animCreator("CartWheelieStance", "Cart", 151, 23);
        this.#animCreator("CartBackflip", "Cart", 174, 25);
        this.#animCreator("CartGrindLeft", "Cart", 198, 28);
        this.#animCreator("CartGrindRight", "Cart", 212, 27);
        this.#animCreator("CartJump", "Cart", 225, 25);
        this.#animCreator("Cart360Left", "Cart", 249, 21);
        this.#animCreator("Cart360Right", "Cart", 250, 21);
        this.#animCreator("CartFlapWings", "Cart", 251, 30);
        this.#animCreator("CartHandstand", "Cart", 268, 24);
        this.#animCreator("CartSlam", "Cart", 279, 7);
        this.#animCreator("CartRunWithCart", "Cart", 295, 22);
        this.#animCreator("CartCrash", "Cart", 302, 24);
        this.#animCreator("CartStart", "Cart", 304, 28);
    }
}