let debug = false;

export default class Game extends Phaser.Scene
{
    constructor ()
    {
        super("Game");

        this.gameOverCalled = false;
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

        this.isStraight = true; // couldn't be me // THIS ISN'T ANYWHERE ELSE IN THE CODE SO I HAVE TO TAKE THIS JOKE OUT NOOOOOO
                                // oh well it's my code, so I'll leave it in for one commit so I can hold onto it's memory
                                // TODO remove this from existence.


        this.maxCounter = {
            GrindMove: 28,
            SlideMove: 32,
            Move: 38
        };
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
        

        const mineHolder = [
            [1,1,4,2,1,5,3,1,1,4,2,5,3,1,1,1,4,2,4,2,1,1,5,3,5,3,1,1,6],
            [1,1,5,3,1,4,2,5,3,1,4,2,1,1,1,4,2,1,5,3,4,2,1,1,5,3,1,1,6],
            [1,1,1,5,3,1,1,1,4,2,1,4,2,1,5,3,4,2,1,5,3,1,4,2,5,3,1,1,6],
            [1,1,5,3,1,4,2,1,1,4,2,1,5,3,1,4,2,5,3,5,3,1,1,4,2,4,2,1,1,6],
            [1,1,1,5,3,4,2,1,4,2,1,1,5,3,1,5,3,4,2,1,5,3,1,1,4,2,1,1,6]
        ];
        this.mineArray = mineHolder[Math.floor(Math.random() * 5)];
        this.mineSegments = [];
        console.log(this.mineArray);

        this.mySeg = 0; 
        this.myLastSafeSeg = 0;
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
        this.mineAnims = [];
        this.#generateAnims();
        this.wKey = this.input.keyboard.addKey("S");
        this.downKey = this.input.keyboard.addKey("DOWN");
        this.paused = false;
        
        this.startGame();
        this.mine.anims.play("MineStraight", true);

        if (debug) PhaserGUIAction(this);
    }

    update()
    {
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
            if (this.isCorner)
            {
                if (this.isTrick) this.crash();
                else {
                    if (this.mineArray[this.currentSeg] == 2 && this.turnDirection != "right") this.crash();
                    else if (this.mineArray[this.currentSeg] == 3 && this.turnDirection != "left") this.crash();
                }
            }
        }
    }

    startGame()
    {
        
        this.isGameOver = false;
        this.isCrashed = false;
        this.stance = "none";

        this.isTrick = false;
        this.trick = undefined;
        this.spinDir = "none";
        this.lastTrick = undefined;
        this.numTricksInCart = 0; 
        this.isMove = false;
        this.move = undefined;
        this.moveCounter = 0;
        this.wobbling = false;
        this.isCorner = false;
        this.currentSeg = this.myLastSafeSeg
        this.input.keyboard.removeAllListeners();
        this.input.keyboard.on('keydown', function (ev) {
            let key = ev.key;
            let scene = this.scene;
            if (key == "0") scene.paused = !scene.paused;
            if (key == "a" || key == "ArrowLeft") scene.turnDirection = "left";
            if (key == "d" || key == "ArrowRight") scene.turnDirection = "right";
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
            if (!scene.isCrashed && !scene.paused)
            {
                if (scene.move == "grind" | scene.move == "spin" | scene.move == "lean" | scene.move == "backflip") scene.noStance();
                if (scene.move == "slide") scene.cartAnims.CartSurfingStance.play();
                scene.stopMove();
                this.turnDirection = undefined;
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
                        if (!scene.isCorner && (anim.key == "CartGrindLeft" || anim.key == "CartGrindRight")) scene.crash();
                        break;
                    case "jumping":
                        scene.noStance();
                        scene.cartAnims.CartStraight.play({chain:true});
                        break;
                    case "none":
                        if (!scene.isCorner && (anim.key == "CartLeanLeft" || anim.key == "CartLeanRight")) scene.crash();
                        else scene.cartAnims.CartStraight.play({chain:true});
                        break;
                }
            }
        })
        this.cart.on("animationstart", function(anim) {
            let scene = this.scene;
            if (scene.paused) {scene.cart.anims.stop(); return; }
        })
        this.cart.on("animationupdate", function(anim, frame, sprite, key) {
            let scene = this.scene;
            //if (scene.paused) {scene.cart.anims.stop(); scene.mine.anims.stop(); return; }
            if (anim.key == "CartOlie" && key == "Sprite_101_20.png") scene.stopTrick();
            else if (anim.key == "CartSlideLeft" && scene.isCorner && key == "Sprite_122_21.png") scene.cart.anims.setCurrentFrame(anim.getFrameAt(3));
            else if (anim.key == "CartSlideLeft" && !scene.isCorner && key == "Sprite_122_32.png") scene.crash();
            else if (anim.key == "CartSlideRight" && scene.isCorner && key == "Sprite_139_23.png") scene.cart.anims.setCurrentFrame(anim.getFrameAt(3));
            else if (anim.key == "CartSlideRight" && !scene.isCorner && key == "Sprite_139_32.png") scene.crash();
            else if (anim.key == "CartJump" && key == "Sprite_225_21.png") scene.noStance();
            else if (anim.key == "CartFlapWings" && key == "Sprite_251_27.png") scene.stopTrick();
            else if (anim.key == "CartHandstand" && key == "Sprite_268_17.png") scene.stopTrick();
        })
        this.mine.on("animationcomplete", function(anim) {
            let scene = this.scene;
            if (anim.key != "MineEnd") scene.nextSeg();
            else scene.gameOver();
        })
        this.mine.on("animationupdate", function(anim, frame, sprite, key) {
            let scene = this.scene;
            if ((anim.key == "MineTurnRight" || anim.key == "MineTurnLeft") && (key == "Sprite_326_10.png")) {
                scene.isCorner = true;
            }
            if ((anim.key == "MineTurnRight" || anim.key == "MineTurnLeft") && (key == "Sprite_326_22.png")) {
                scene.stopCorner();
            }
        })

        this.cartAnims.CartStart.play();
        if (debug) this.cartAnims.CartStart.play({sprite:this.cart2});

    }

    stopTrick()
    {
        if (this.isTrick && !this.isCrashed)
        {
            this.isTrick = false;
            this.stance = (this.trick == "olie" || this.trick == "handstand") ? "surfing" : "none";
            if (this.trick == "backflip") this.numFlipsInRow++;
            else this.numFlipsInRow = 0;
            // TODO points
            this.lastTrick = this.trick;
            this.trick = undefined;
            this.numTricks += 1;
        }
        this.wobbling = false;
    }

    stopMove()
    {
        if (this.isMove)// && !this.isCrashed && (this.moveCounter > 10 || this.bonusPoints > 0))
        {
            // TODO points
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

    nextSeg()
    {
        if (this.mineArray[this.currentSeg] == 1) {
            this.myLastSafeSeg = this.currentSeg;
        }
        if (this.isCrashed || this == undefined || this.isGameOver) {
            this.currentSeg = this.myLastSafeSeg;
        }
        else {
            this.currentSeg++;
        }
        console.log(this.currentSeg);
        this.mineAnims[this.mineArray[this.currentSeg]-1].play({chain:true});
    }

    stopCorner()
    {
        this.isCorner = false;
        if (!this.isCrashed) {
            // TODO points
        }
    }

    crash()
    {
        this.numFlipsInRow = 0;
        this.isCrashed = true;
        this.cartAnims.CartCrash.play();
        this.reduceLives();
        this.stopGame();
    }

    reduceLives()
    {
        this.myLives -= 1;
        // TODO lives sprite
    }

    stopGame()
    {
        if (!this.isGameOver) {
            if (this.myLives > 0) {
                this.input.keyboard.removeAllListeners();
                this.input.keyboard.on("keydown-SPACE", () => this.startGame())
            }
        }
        else {
            this.gameOver();
        }
    }

    gameOver()
    {
        if (!this.gameOverCalled)
        {
            this.gameOverCalled = true;
            this.isGameOver = true;
            this.input.keyboard.removeAllListeners();
            this.cart.removeAllListeners();
            this.mine.removeAllListeners();
        }
    }

    #animPlayWrapper({sprite=undefined, posX=undefined, posY=undefined, flipX=false, flipY=false, displayWidth=undefined, displayHeight=undefined, ignoreIfPlaying=true, chain=false, name=undefined}) {
        // TODO possibly: modify to use chain instead of play and allow argument arrays
        if (posX) sprite.setX(posX);
        if (posY) sprite.setY(posY);
        if (!(displayWidth && displayHeight)) sprite.setScale(1, 1);
        else sprite.setDisplaySize(displayWidth, displayHeight);
        sprite.setFlip(flipX, flipY);
        if (chain == true) sprite.anims.chain(name, ignoreIfPlaying);
        else sprite.anims.play(name, ignoreIfPlaying);
    }

    #animCreator(name="CartDefault", sheet="Cart", spriteid=0, start=1, count=1, ...{...params})
    {
        this.anims.create({
            key: name,
            frames: this.anims.generateFrameNames(sheet, { prefix: "Sprite_"+spriteid+"_", suffix: ".png", start: start,  end: count }),
            frameRate: 24,
            repeat: 0
        });
        if (params[0] != undefined)
        {
            let item;
            if (sheet == "Cart") item = this.cartAnims[name] = {};
            else if (sheet == "Mine") item = this.mineAnims[this.mineAnims.push({})-1];
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
        this.#animCreator("MineStraight", "Mine", 26, 0, 47, {sprite:this.mine, posX:380, posY:240});
        this.#animCreator("MineTurnRight", "Mine", 326, 0, 25, {sprite:this.mine, posX:380, posY:240});
        this.#animCreator("MineTurnLeft", "Mine", 326, 0, 25, {sprite:this.mine, posX:380, posY:240, flipX:true});
        this.#animCreator("MineTurnSignsRight", "Mine", 329, 0, 47, {sprite:this.mine, posX:380, posY:240});
        this.#animCreator("MineTurnSignsLeft", "Mine", 329, 0, 47, {sprite:this.mine, posX:380, posY:240, flipX:true});
        this.#animCreator("MineEnd", "Mine", 333, 0, 27, {sprite:this.mine, posX:380, posY:240});
        this.#animCreator("CartStraight", "Cart", 35, 1, 1, {sprite:this.cart, posX:381, posY:352});
        this.#animCreator("CartLeanLeft", "Cart", 59, 1, 40, {sprite:this.cart, posX:273, posY:323});
        this.#animCreator("CartLeanRight", "Cart", 60, 1, 40, {sprite:this.cart, posX:491, posY:323, flipX:true});
        this.#animCreator("CartSurfing", "Cart", 84, 1, 17, {sprite:this.cart, posX:372, posY:321});
        this.#animCreator("CartSurfingStance", "Cart", 85, 1, 9, {sprite:this.cart, posX:379, posY:328});
        this.#animCreator("CartOlie", "Cart", 101, 1, 20, {sprite:this.cart, posX:380, posY:274});
        this.#animCreator("CartSlideLeft", "Cart", 122, 1, 41, {sprite:this.cart, posX:298, posY:312});
        this.#animCreator("CartSlideRight", "Cart", 139, 1, 41, {sprite:this.cart, posX:501, posY:326});
        this.#animCreator("CartWheelie", "Cart", 150, 1, 25, {sprite:this.cart, posX:381, posY:364});
        this.#animCreator("CartWheelieStance", "Cart", 151, 1, 23, {sprite:this.cart, posX:381, posY:370});
        this.#animCreator("CartBackflip", "Cart", 174, 1, 21, {sprite:this.cart, posX:381, posY:308});
        this.#animCreator("CartGrindLeft", "Cart", 198, 1, 28, {sprite:this.cart, posX:382, posY:397});
        this.#animCreator("CartGrindRight", "Cart", 212, 1, 27, {sprite:this.cart, posX:382, posY:397, flipX:true});
        this.#animCreator("CartJump", "Cart", 225, 1, 25, {sprite:this.cart, posX:383, posY:302});
        this.#animCreator("Cart360Left", "Cart", 249, 1, 17, {sprite:this.cart, posX:384, posY:304});
        this.#animCreator("Cart360Right", "Cart", 250, 1, 17, {sprite:this.cart, posX:379, posY:304, flipX:true});
        this.#animCreator("CartFlapWings", "Cart", 251, 1, 30, {sprite:this.cart, posX:380, posY:310});
        this.#animCreator("CartHandstand", "Cart", 268, 1, 24, {sprite:this.cart, posX:381, posY:317});
        this.#animCreator("CartSlam", "Cart", 279, 1, 7, {sprite:this.cart, posX:398, posY:337});
        this.#animCreator("CartRunWithCart", "Cart", 295, 1, 22, {sprite:this.cart, posX:381, posY:245}); // not perfect position since I don't have a perfect reference
        this.#animCreator("CartCrash", "Cart", 302, 1, 24, {sprite:this.cart, posX:381, posY:352}); //todo
        this.#animCreator("CartStart", "Cart", 304, 1, 28, {sprite:this.cart, posX:374, posY:606});
    }
}