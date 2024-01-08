let debug = false

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
        // this.trickDone = {
        //     olie: "surfing",
        //     handstand: "surfing",
        //     backflip: "none",
        //     spin: "none",
        //     flap: "none",
        //     slam: "none",
        //     running: "none"
        // };
        
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
        this.mine = this.add.sprite(width, height, "MineStraight"); // TODO: replace all vertical spritesheets with packed spritesheets in Aseprite or use texture packer
        this.cart = this.add.sprite(width, height, "Cart", "Sprite_304_1.png");
        if (debug) this.cart2 = this.add.sprite(width, height, "Cart", "Sprite_304_1.png");
        if (debug) this.cart2.alpha = 0.3;

        this.cartAnims = {};
        this.#generateAnims();
        this.play = true;
        this.wKey = this.input.keyboard.addKey("S");
        this.downKey = this.input.keyboard.addKey("DOWN");
        this.paused = false;
        this.input.keyboard.on('keydown', function (ev) {
            let key = ev.key;
            let scene = this.scene;
            if (key == "0") scene.paused = !scene.paused;
            if (!scene.isTrick && !scene.isCrashed && ev.repeat == false)
            {
                if (scene.stance == "surfing")
                {
                    switch (key) {
                        case "a":
                        case "ArrowLeft":
                            scene.isMove = true;
                            scene.move = "slide";
                            scene.cartAnims.CartSlideLeft.play();
                            break;
                        case "d":
                        case "ArrowRight":
                            scene.isMove = true;
                            scene.move = "slide";
                            scene.cartAnims.CartSlideRight.play();
                            break;
                        case " ":
                            scene.isTrick = true;
                            scene.trick = "olie";
                            scene.cartAnims.CartOlie.play();
                            break;
                        case "w":
                        case "ArrowUp":
                            scene.isTrick = true;
                            scene.trick = "handstand";
                            scene.cartAnims.CartHandstand.play();
                            break;
                        case "s":
                        case "ArrowDown":
                            scene.noStance();
                            break;
                    }
                }
                else if (scene.stance == "wheelie")
                {
                    switch (key) {
                        case "a":
                        case "ArrowLeft":
                            scene.isMove = true;
                            scene.move = "grind";
                            scene.cartAnims.CartGrindLeft.play();
                            break;
                        case "d":
                        case "ArrowRight":
                            scene.isMove = true;
                            scene.move = "grind";
                            scene.cartAnims.CartGrindRight.play();
                            break;
                        case " ":
                            scene.isTrick = true;
                            scene.trick = "backflip";
                            scene.cartAnims.CartBackflip.play();
                            break;
                        case "s":
                        case "ArrowDown":
                            scene.isTrick = true;
                            scene.trick = "running";
                            scene.cartAnims.CartRunWithCart.play();
                            break;
                        case "w":
                        case "ArrowUp":
                            scene.noStance();
                            break;
                    }
                }
                else if (scene.stance == "jumping")
                {
                    switch (key) {
                        case "a":
                        case "ArrowLeft":
                            scene.isTrick = true;
                            scene.trick = "spin";
                            scene.cartAnims.Cart360Left.play();
                            break;
                        case "d":
                        case "ArrowRight":
                            scene.isTrick = true;
                            scene.trick = "spin";
                            scene.cartAnims.Cart360Right.play();
                            break;
                        case "w":
                        case "ArrowUp":
                            scene.isTrick = true;
                            scene.trick = "flap";
                            scene.cartAnims.CartFlapWings.play();
                            break;
                        case "s":
                        case "ArrowDown":
                            scene.isTrick = true;
                            scene.move = "slam";
                            scene.cartAnims.CartSlam.play();
                            break;
                    }
                }
                else {
                    switch (key) {
                        case "a":
                        case "ArrowLeft":
                            scene.isMove = true;
                            scene.move = "lean";
                            scene.cartAnims.CartLeanLeft.play();
                            break;
                        case "d":
                        case "ArrowRight":
                            scene.isMove = true;
                            scene.move = "lean";
                            scene.cartAnims.CartLeanRight.play();
                            break;
                        case "w":
                        case "ArrowUp":
                            scene.stance = "surfing";
                            scene.cartAnims.CartSurfing.play();
                            break;
                        case "s":
                        case "ArrowDown":
                            scene.stance = "wheelie";
                            scene.cartAnims.CartWheelie.play();
                            break;
                        case " ":
                            scene.stance = "jumping";
                            scene.cartAnims.CartJump.play();
                            break;
                    }
                }
                this.stanceCounter = 0;
            }
        })
        this.input.keyboard.on("keyup", function(ev) {
            let scene = this.scene;
            if (!scene.isCrashed)
            {
                if (scene.move == "grind" | scene.move == "spin" | scene.move == "lean" | scene.move == "backflip") scene.noStance();
                if (scene.move == "slide") scene.cartAnims.CartSurfingStance.play();
                scene.stopMove();
            }
        })
        this.cart.on("animationcomplete", function(anim) {
            let scene = this.scene;
            if (scene.isTrick) scene.stopTrick();
            if (scene.paused) {scene.cart.anims.stop(); return; }
            if (!scene.isCrashed && !["CartSurfingStance", "CartStraight"].includes(anim.key)) {
                switch (scene.stance) {
                    case "surfing":
                        scene.cartAnims.CartSurfingStance.play({chain:true});
                        break;
                    case "wheelie":
                        if (scene.wKey.isDown || scene.downKey.isDown) scene.cartAnims.CartWheelieStance.play({chain:true});
                        else { scene.cartAnims.CartStraight.play({chain:true}); scene.noStance(); }
                        break;
                    case "jumping":
                        scene.noStance();
                        scene.cartAnims.CartStraight.play({chain:true});
                        break;
                    case "none":
                        scene.cartAnims.CartStraight.play({chain:true});
                        break;
                }
            }
        })
        this.cart.on("animationstart", function(anim) {
            let scene = this.scene;
            if (scene.paused) {scene.cart.anims.stop(); return; }
        })

        PhaserGUIAction(this);
    }

    update()
    {
        if (this.play == true) {
            //this.mine.anims.play("MineStraight", true);
            this.cartAnims.CartStart.play();
            if (debug) this.cartAnims.CartStart.play({sprite:this.cart2});
            this.play = false;
        }
        if (!this.isCrashed)
        {
            if (this.isMove && !this.isCorner)
            {
                this.moveCounter += 1;
                if (this.moveCounter > this.maxCounter.Move)
                {
                    //this.isCrashed = true;
                    //reduceLives();
                    //this.stopGame();
                    //if (this.)
                }
            }
        }
    }

    stopTrick()
    {
        if (this.isTrick && !this.isCrashed)
        {
            this.isTrick = false;
            this.stance = (this.trick == "olie" || this.trick == "handstand") ? "surfing" : "none";
            if (this.trick == "backflip") this.numFlipsInRow++;
            else this.numFlipsInRow = 0;
            this.lastTrick = this.trick;
            this.trick = undefined;
            this.numTricks += 1;
        }
    }

    stopMove()
    {
        if (this.isMove)// && !this.isCrashed && (this.moveCounter > 10 || this.bonusPoints > 0))
        {
            this.isMove = false;
            this.moveCounter = 0;
            this.move = undefined;
        }
        this.wobbling = false;
    }

    noStance()
    {
        this.isTrick = false;
        this.trick = undefined;
        this.isMove = false;
        this.move = undefined;
        this.moveCounter = 0;
        this.stance = "none";
        this.cartAnims.CartStraight.play();
    }

    gameOver()
    {
        if (!this.gameOverCalled)
        {
            this.gameOverCalled = true;
            this.isGameOver = true;
        }
    }

    #animPlayWrapper({sprite=undefined, posX=undefined, posY=undefined, flipX=false, flipY=false, displayWidth=undefined, displayHeight=undefined, ignoreIfPlaying=true, chain=false, name=undefined}) {
        // TODO possibly: modify to use chain instead of play and allow argument arrays
        if (posX) sprite.setX(posX);
        if (posY) sprite.setY(posY);
        if (!(displayWidth && displayHeight)) sprite.setScale(1, 1);
        else sprite.setDisplaySize(displayWidth, displayHeight);
        sprite.FlipX = flipX;
        sprite.FlipY = flipY;
        if (chain == true) sprite.anims.chain(name,ignoreIfPlaying);
        else sprite.anims.play(name, ignoreIfPlaying);
    }

    #animCreator(name="CartDefault", sheet="Cart", spritenum=0, count=1, ...{...params})
    {
        this.anims.create({
            key: name,
            frames: this.anims.generateFrameNames(sheet, { prefix: "Sprite_"+spritenum+"_", suffix: ".png", start: 1,  end: count }),
            frameRate: 30,
            repeat: 0
        });
        if (sheet == "Cart" && params[0] != undefined)
        {
            let item = this.cartAnims[name] = {};
            item.params = params[0];
            if (item.params != undefined) item.params.name = name;
            item.play = (...{...params}) => {
                let mParams = Object.assign({}, item.params);
                if (params[0] != undefined) {for (let key in params[0]) {mParams[key] = params[0][key]}}
                this.#animPlayWrapper(mParams);
            }
        }
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
        this.#animCreator("CartStraight", "Cart", 35, 1, {sprite:this.cart, posX:381, posY:352});
        this.#animCreator("CartLeanLeft", "Cart", 59, 40, {sprite:this.cart, posX:273, posY:323});
        this.#animCreator("CartLeanRight", "Cart", 60, 40, {sprite:this.cart, posX:272, posY:323, flipX:true});
        this.#animCreator("CartSurfing", "Cart", 84, 17, {sprite:this.cart, posX:372, posY:321});
        this.#animCreator("CartSurfingStance", "Cart", 85, 9, {sprite:this.cart, posX:379, posY:328});
        this.#animCreator("CartOlie", "Cart", 101, 20, {sprite:this.cart, posX:380, posY:274});
        this.#animCreator("CartSlideLeft", "Cart", 122, 41, {sprite:this.cart, posX:298, posY:312});
        this.#animCreator("CartSlideRight", "Cart", 139, 41, {sprite:this.cart, posX:501, posY:326});
        this.#animCreator("CartWheelie", "Cart", 150, 25, {sprite:this.cart, posX:381, posY:364});
        this.#animCreator("CartWheelieStance", "Cart", 151, 23, {sprite:this.cart, posX:381, posY:370});
        this.#animCreator("CartBackflip", "Cart", 174, 25, {sprite:this.cart, posX:381, posY:308});
        this.#animCreator("CartGrindLeft", "Cart", 198, 28, {sprite:this.cart, posX:382, posY:397});
        this.#animCreator("CartGrindRight", "Cart", 212, 27, {sprite:this.cart, posX:382, posY:397, flipX:true});
        this.#animCreator("CartJump", "Cart", 225, 25, {sprite:this.cart, posX:383, posY:302});
        this.#animCreator("Cart360Left", "Cart", 249, 21, {sprite:this.cart, posX:384, posY:304});
        this.#animCreator("Cart360Right", "Cart", 250, 21, {sprite:this.cart, posX:384, posY:304, flipX:true});
        this.#animCreator("CartFlapWings", "Cart", 251, 30, {sprite:this.cart, posX:380, posY:310});
        this.#animCreator("CartHandstand", "Cart", 268, 24, {sprite:this.cart, posX:381, posY:317});
        this.#animCreator("CartSlam", "Cart", 279, 7, {sprite:this.cart, posX:398, posY:337});
        this.#animCreator("CartRunWithCart", "Cart", 295, 22, {sprite:this.cart, posX:381, posY:245}); // not perfect position since I don't have a perfect reference
        this.#animCreator("CartCrash", "Cart", 302, 24, {sprite:this.cart, posX:381, posY:352}); //todo
        this.#animCreator("CartStart", "Cart", 304, 28, {sprite:this.cart, posX:374, posY:606});
    }
}