'use strict';
import '../style.css';
import './jquery-3.6.0.js'
import Phaser, { GameObjects } from 'phaser';
import ASSETS_PATH from './assets_path.js';
import AlignGrid from './alignGrid.js';
import Align from './align.js';
import Slime from './slime';
import Coin from './coin';
import RankManager from './regist'

var regist_rank = document.getElementById('regist-rank');
var nick_name = document.getElementById('nick-name').value;
var run_dist = document.getElementById('run-dist');
var submitBtn = document.getElementById('submit');
var aGrid;
var background_sky;
var large_cloud;
var small_cloud;
var background_middle;
var background_front;
var ground;
var restartBtn;
var fullscreenBtn;
var jumpBtn;
var startBtn;
var score;
var runDist = 0;
var rankMng;
var warning;

var coinTimer = 0;
var coinSpeed = 7;
var coinList = [];
var coinSpawnInterval = 200;
var coinPosX = 840;
var coinPosY = 100;

var yuri_anim_sprite;
var slimeList = [];

var warningTimer = 0;
var randSpeed = 0;
var randSlime = 0;
var randCreateType = 0;
var groundSpeed = 5;
var bgfrontSpeed = 0.7;
var bgmiddleSpeed = 0.3;
var largeCloudSpeed = 0.2;
var smallCloudSpeed = 0.4;
var infinity = -1;
var slowAnimRate = 10;
var normalAnimRate = 15;
var fastAnimRate = 20;
var timer = 0;
var slimePosX = 850;
var slimePosY = 360;
var maxSlimeSpeed = 9;
var minSlimeSpeed = 6;
var spawnInterval = 100;

var isStart = false;
var isRanked = false;
var isWarning = false;
var isDead = false;
var isJump = true;
var canSecondJump = false;
var isGround = true;
var isKeyUp = true;
var isSecJump = false;
var isLand = false;
var isFall = true;
var isRise = false;
var isButtonJump = false;
var deathCount = 0;
var slimeKey = [];

class SceneMain extends Phaser.Scene {
    
    constructor() {
        super('SceneMain');
    }
    preload() {
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);

        this.load.on('progress', function (value) {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });

        this.load.on('complete', function () {

            progressBar.destroy();
            progressBox.destroy();
        });

        this.load.atlas("yuri_anim_sprite", ASSETS_PATH.YURI_ANIM_SPRITE, ASSETS_PATH.YURI_ANIM_JSON);
        this.load.image("background_sky", ASSETS_PATH.BACKGROUND_PNG[0]);
        this.load.image("small_cloud", ASSETS_PATH.BACKGROUND_PNG[1]);
        this.load.image("large_cloud", ASSETS_PATH.BACKGROUND_PNG[2]);
        this.load.image("background_middle", ASSETS_PATH.BACKGROUND_PNG[3]);
        this.load.image("background_front", ASSETS_PATH.BACKGROUND_PNG[4]);
        this.load.image("ground", ASSETS_PATH.GROUND_SPRITE_SHEET);
        this.load.atlas("slime_anim_sprite", ASSETS_PATH.SLIME_ANIM_SHEET, ASSETS_PATH.SLIME_ANIM_JSON);
        this.load.image("restart_button", ASSETS_PATH.UI_PNG[0]);
        this.load.image("jump_button", ASSETS_PATH.UI_PNG[1]);
        this.load.image("start_button", ASSETS_PATH.UI_PNG[2]);
        this.load.atlas("coin_anim_sprite", ASSETS_PATH.COIN_SPRITE_SHEET, ASSETS_PATH.COIN_SPRITE_JSON)
        this.load.atlas("fullscreen_icon_sheet", ASSETS_PATH.UI_PNG[3], ASSETS_PATH.UI_PNG[4])
    }

    create() {
        aGrid = new AlignGrid({ scene: this, rows: 11, cols: 11 });
        regist_rank.style.visibility = 'hidden';
        warning = document.getElementById('warning');

        background_sky = this.add.image(0, 0, "background_sky");
        small_cloud = this.add.tileSprite(0, 0, 847, 245, "small_cloud");
        large_cloud = this.add.tileSprite(0, 0, 847, 245, "large_cloud");
        background_middle = this.add.tileSprite(0, 0, 847, 350, "background_middle");
        background_front = this.add.tileSprite(0, 0, 847, 70, "background_front");
        ground = this.add.tileSprite(0, 0, 847, 125, 'ground');
        restartBtn = this.add.image(0, 0, "restart_button");
        jumpBtn = this.add.image(0, 0, "jump_button");
        startBtn = this.add.image(0, 0, "start_button")
        fullscreenBtn = this.add.image(0, 0, "fullscreen_icon_sheet", "fullscreen_on.png");

        score = this.add.text(0, 0, '- m', {
            fontFamily : 'VT323, monospace',
            align : 'justify',
            fontSize : '50px',
            stroke : 'black',
            strokeThickness : 6,
        });
        
        yuri_anim_sprite = this.physics.add.sprite(this.sys.game.config.width / 0, 0, "yuri_anim_sprite");

        this.anims.create({
            key: 'yuri_run',
            frames: this.anims.generateFrameNames('yuri_anim_sprite', { prefix: 'yuri_run_', suffix: '.png', start: 1, end: 4, zeroPad: 0 }),
            frameRate: normalAnimRate,
            repeat: infinity
        });

        this.anims.create({
            key: 'yuri_first_jump',
            frames: this.anims.generateFrameNames('yuri_anim_sprite', { prefix: 'yuri_first_jump_', suffix: '.png', start: 1, end: 4, zeroPad: 0 }),
            frameRate: fastAnimRate,
            repeat: 0,
        });

        this.anims.create({
            key: 'yuri_second_jump',
            frames: this.anims.generateFrameNames('yuri_anim_sprite', { prefix: 'yuri_second_jump_', suffix: '.png', start: 1, end: 4, zeroPad: 0 }),
            frameRate: normalAnimRate,
            repeat: infinity,
        })

        this.anims.create({
            key: 'yuri_fall',
            frames: this.anims.generateFrameNames('yuri_anim_sprite', { prefix: 'yuri_fall_', suffix: '.png', start: 1, end: 4, zeroPad: 0 }),
            frameRate: normalAnimRate,
            repeat: infinity,
        })

        this.anims.create({
            key: 'yuri_dead',
            frames: this.anims.generateFrameNames('yuri_anim_sprite', { prefix: 'yuri_dead_', suffix: '.png', start: 1, end: 4, zeroPad: 0 }),
            frameRate: normalAnimRate,
            repeat: infinity,
        })

        this.anims.create({
            key: 'yellow_slime',
            frames: this.anims.generateFrameNames('slime_anim_sprite', { prefix: 'yellow_slime_', suffix: '.png', start: 1, end: 4, zeroPad: 0 }),
            frameRate: normalAnimRate,
            repeat: infinity,
        })

        this.anims.create({
            key: 'blue_slime',
            frames: this.anims.generateFrameNames('slime_anim_sprite', { prefix: 'blue_slime_', suffix: '.png', start: 1, end: 4, zeroPad: 0 }),
            frameRate: normalAnimRate,
            repeat: infinity,
        })

        this.anims.create({
            key: 'green_slime',
            frames: this.anims.generateFrameNames('slime_anim_sprite', { prefix: 'green_slime_', suffix: '.png', start: 1, end: 4, zeroPad: 0 }),
            frameRate: normalAnimRate,
            repeat: infinity,
        })

        this.anims.create({
            key: 'coin_idle',
            frames: this.anims.generateFrameNames('coin_anim_sprite', { prefix: 'coin_', suffix: '.png', start: 1, end: 4, zeroPad: 0 }),
            frameRate: slowAnimRate,
            repeat: infinity,
        })

        this.anims.create({
            key: 'coin_pop',
            frames: this.anims.generateFrameNames('coin_anim_sprite', { prefix: 'coin_effect_', suffix: '.png', start: 1, end: 4, zeroPad: 0 }),
            frameRate: normalAnimRate,
            repeat: 0,
        })
     
        slimeKey = ['yellow_slime', 'blue_slime', 'green_slime']

        yuri_anim_sprite.play("yuri_run");
        yuri_anim_sprite.depth = 1;
        startBtn.depth = 3;
        fullscreenBtn.depth = 3;
        yuri_anim_sprite.setGravityY(1000);

        aGrid.placeAtIndex(104, ground);
        ground.y += 1;
        aGrid.placeAtIndex(38, large_cloud);
        aGrid.placeAtIndex(38, small_cloud);
        aGrid.placeAtIndex(49, background_middle);
        aGrid.placeAtIndex(82, background_front);
        aGrid.placeAtIndex(49, background_sky);
        aGrid.placeAtIndex(108, jumpBtn);
        aGrid.placeAtIndex(93, restartBtn);
        aGrid.placeAtIndex(49, startBtn);
        aGrid.placeAtIndex(16, score);
        score.x -= 20;
        aGrid.placeAtIndex(67, yuri_anim_sprite);
        aGrid.placeAtIndex(10, fullscreenBtn);
        fullscreenBtn.y += 20;
        fullscreenBtn.x -= 15;

        Align.scaleToGameW(background_sky, this.game, 1.5);
        Align.scaleToGameW(jumpBtn, this.game, 0.25);
        Align.scaleToGameW(restartBtn, this.game, .2);
        Align.scaleToGameW(startBtn, this.game, .2);
        Align.scaleToGameW(yuri_anim_sprite, this.game, .15);
        Align.scaleToGameW(fullscreenBtn, this.game, 0.08);


        this.physics.add.existing(yuri_anim_sprite, false);
        this.physics.add.existing(ground, true);
        this.physics.add.collider(yuri_anim_sprite, ground);
        ground.body.allowGravity = false;
        ground.body.immovable = true;

        startBtn.setInteractive();
        startBtn.on('pointerdown', function(){
            startBtn.setTint(0x7B7B7B);
        })
        startBtn.on('pointerup', function(){
            startBtn.setTint(0xffffff);
            this.scene.startGame();
        })
        
        jumpBtn.setInteractive();
        jumpBtn.on('pointerdown', function(){
            isButtonJump = true;
            jumpBtn.setTint(0x7B7B7B);
            // this.scene.jump();
        })
        jumpBtn.on('pointerup', function(){
            isButtonJump = false;
            jumpBtn.setTint(0xffffff);
            this.scene.keyUp();
        })

        restartBtn.depth = 2;
        restartBtn.setInteractive();
        restartBtn.visible = false;
        restartBtn.on('pointerdown', function(){
            restartBtn.setTint(0x7B7B7B);
        })
        restartBtn.on('pointerup', function(){
            restartBtn.setTint(0x7B7B7B);
            this.scene.restartGame();
        })

        fullscreenBtn.setInteractive();
        fullscreenBtn.on('pointerup', function () {

            if (this.scale.isFullscreen)
            {
                fullscreenBtn.setFrame("fullscreen_on.png");
                this.scale.stopFullscreen();
            }
            else
            {
                fullscreenBtn.setFrame("fullscreen_off.png");

                this.scale.startFullscreen();
            }

        }, this);

        yuri_anim_sprite.body.setSize(30, 80);

        this.input.keyboard.on('keydown-SPACE', this.jump);
        this.input.keyboard.on('keyup-SPACE', this.keyUp);
        submitBtn.addEventListener("click", this.registRank);
        // aGrid.showNumbers();
    }
    startGame(){
        isStart = true;
       
    }
    calcScore() {
        if (isStart && timer != 0 && timer % 120 == 0){
            runDist += 1;
        }
        score.setText(runDist + ' m');
    }

    gameover() {
        if (deathCount == 0){
            deathCount++;
            yuri_anim_sprite.play('yuri_dead');
            yuri_anim_sprite.setVelocityY(-300);
            ground.body.enable = false;
            restartBtn.visible = true;
            regist_rank.style.visibility = 'visible';
            run_dist.innerText = '달린거리 ' + runDist + ' m';
        }
        if (yuri_anim_sprite.y > 370) {
            yuri_anim_sprite.destroy();
        }

        if (isRanked){
            isRanked = false;
            this.restartGame();
        }
    }
    warningCycle() {
        if (isWarning && (warningTimer <= 150)) {
            warningTimer++;
        }
        else {
            warning.style.visibility = 'hidden';
            isWarning = false;
            warningTimer = 0;
        }

    }

    registRank(){
        nick_name = document.getElementById('nick-name').value;
        if (nick_name.length >= 11 || nick_name.length == 0){
            isWarning = true;
            warning.innerText = '1 ~ 10사이의 글자를 입력하세요.';
            warning.style.visibility = 'visible';
            
            return;
        }
        else{
            rankMng = new RankManager(nick_name, runDist);
            rankMng.setData();
            isRanked = true;
        }
    }

    restartGame(){
        isDead = false;
        isWarning = false;
        warningTimer = 0;
        deathCount = 0;
        timer = 0;
        runDist = 0;
        coinTimer = 0;
        for(let i in slimeList){
            slimeList[i].destroy();
            delete slimeList[i];
        }
        for (let j in coinList){
            coinList[j].destroy();
            delete coinList[j];
        }

        coinList.length = 0;
        slimeList.length = 0;
        this.scene.restart();
    }
    coninSpawn() {
        if (isDead) {
            return;
        }
        if (!isStart) {
            return;
        }
        coinTimer++;
        
        if (coinTimer % coinSpawnInterval == 0) {
            this.createCoin();
        }
        this.coinLifeCycle();
    }

    createCoin() {
        let coin = new Coin({ scene: this, x: coinPosX, y: coinPosY}, false);
        Align.scaleToGameW(coin, this.game, 0.02);
        coin.play('coin_idle');
        coinList.push(coin);
    }

    coinLifeCycle() {
        if (coinList.length != 0) {
            for (let i in coinList) {
                coinList[i].x -= coinSpeed;
                if (coinList[i].x <= 0) {
                    coinList[i].destroy();
                    // coinList.splice(0, 1);
                }
                this.physics.add.overlap(yuri_anim_sprite, coinList[i], function (_yuri, _coin) {
                    if (isDead) {
                        return;
                    }
                    if (coinList[i].bool == false) {
                        coinList[i].bool = true;
                        runDist += 2;
                        coinList[i].setScale(1.5, 1.5);
                        coinList[i].play('coin_pop');
                    }
                    // console.log('is coin collision');
                });
            }
        }
    }

    enemySpawn() {
        if (!isStart) {
            return;
        }
        timer++;
        randSpeed = Math.floor((Math.random() * maxSlimeSpeed) + minSlimeSpeed);
        
        if (timer % spawnInterval == 0) {
            randCreateType = Math.floor((Math.random() * 3) + 2);
            for (let n = 1; n < randCreateType; n++) {
                randSlime = Math.floor(Math.random() * 3);
                this.slimeCreate(n);
            }
        }
        this.enemyLifeCycle();
    }
    enemyLifeCycle() {
        if (slimeList.length != 0) {
            for (let i in slimeList) {
                slimeList[i].x -= slimeList[i].speed;
                if (slimeList[i].x <= 0) {
                    slimeList[i].destroy();
                    delete slimeList[i];
                }
                this.physics.add.overlap(yuri_anim_sprite, slimeList[i], function (_yuri, _slime) {
                    if (isDead) {
                        return;
                    }
                    isDead = true;
                    slimeList[i].body.setSize(1, 1);
                    // console.log('is collision');
                });
            }
        }
    }

    
    slimeCreate(count) {
        let slime = new Slime({ scene: this, x: slimePosX, y: (slimePosY - 40 * count) }, randSpeed);
        slime.play(slimeKey[randSlime]);
        slimeList.push(slime);
    }
    keyUp() {
        isKeyUp = true;
    }
    secondJump() {

    }
    jump() {
        if (isDead) {
            return;
        }
        if (isJump && canSecondJump && isKeyUp) {
            canSecondJump = false;
            isJump = false;
            isSecJump = true;
            yuri_anim_sprite.setVelocityY(-400);
            yuri_anim_sprite.play('yuri_second_jump');
        }
        if (!isGround) {
            return;
        }
        yuri_anim_sprite.play('yuri_first_jump');
        yuri_anim_sprite.setVelocityY(-600);
        isKeyUp = false;
        isJump = true;
        isGround = false;
    }
    buttonJump() {
        if (isDead) {
            return;
        }
        if (!isButtonJump){
            return;
        }
        if (isJump && canSecondJump && isKeyUp) {
            canSecondJump = false;
            isJump = false;
            isSecJump = true;
            yuri_anim_sprite.setVelocityY(-400);
            yuri_anim_sprite.play('yuri_second_jump');
        }
        if (!isGround) {
            return;
        }
        yuri_anim_sprite.play('yuri_first_jump');
        yuri_anim_sprite.setVelocityY(-600);
        isKeyUp = false;
        isJump = true;
        isGround = false;
    }
    checkPlayerState() {
        if ((isJump || isSecJump) && yuri_anim_sprite.body.velocity.y < 0) {
            isRise = true;
        }

        if (isRise && yuri_anim_sprite.body.velocity.y > 0) {
            isRise = false;
            isFall = true;
            yuri_anim_sprite.play('yuri_fall');
        }

        if (isFall && yuri_anim_sprite.y >= 290) {
            isFall = false;
            isLand = true;
            yuri_anim_sprite.body.setVelocityY(0);
        }

        if (isLand && !isFall) {
            isLand = false;
            isJump = false;
            canSecondJump = true;
            isGround = true;
            yuri_anim_sprite.play('yuri_run');
        }

        if (isGround && yuri_anim_sprite.y > 305) {
            // console.log('yuri sink!!!');
            yuri_anim_sprite.y = 298;
        }
    }
    backgroundMove() {
        ground.tilePositionX += groundSpeed;
        background_front.tilePositionX += bgfrontSpeed;
        background_middle.tilePositionX += bgmiddleSpeed;
    }

    update() {
        this.warningCycle();
        restartBtn.update();
        large_cloud.tilePositionX += largeCloudSpeed;
        small_cloud.tilePositionX += smallCloudSpeed;

        if (isStart){
            startBtn.destroy();
        }
        
        if (isDead) {
            this.gameover();
            return;
        }
        this.calcScore()
        this.enemySpawn();
        this.coninSpawn();
        this.checkPlayerState();
        this.backgroundMove();
        this.buttonJump();
    }
}


var config = {
    type: Phaser.AUTO,
    width: 847,
    height: 474,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game-box',
    },
    fullScreenTarget: document.getElementById('game-box'),
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 100 },
            debug: false
        }
    },
    scene: [SceneMain] 
};

var game = new Phaser.Game(config);

