'use strict';
import '../style.css';
import './jquery-3.6.0.js'
import Phaser, { GameObjects } from 'phaser';
import ASSETS_PATH from './assets_path.js';
import AlignGrid from './alignGrid.js';
import Align from './align.js';

class SceneMain extends Phaser.Scene {

    constructor() {
        super('SceneMain');
    }
    preload() {
        this.load.atlas("yuri_run", ASSETS_PATH.YURI_PNG[0], ASSETS_PATH.SPRITE_SHEET_JSON);
        this.load.image("background_sky", ASSETS_PATH.BACKGROUND_SKY);
        this.load.image("ground_1", ASSETS_PATH.GROUND_PNG[0]);
        this.load.image("ground_2", ASSETS_PATH.GROUND_PNG[1]);
        this.load.image("ground_3", ASSETS_PATH.GROUND_PNG[2]);
        this.load.image("ground_4", ASSETS_PATH.GROUND_PNG[3]);
    }

    create() {
        this.aGrid = new AlignGrid({ scene: this, rows: 11, cols: 11 });
        

        this.background_sky = this.add.image(0,0, "background_sky");

        this.ground_1 = this.add.tileSprite(0, 0, 847, 129, "ground_1");
        this.ground_2 = this.add.tileSprite(0, 0, 847, 129, "ground_2");
        this.ground_3 = this.add.tileSprite(0, 0, 847, 129, "ground_3");
        this.ground_4 = this.add.tileSprite(0, 0, 847, 129, "ground_4");

        this.yuri_run = this.add.sprite(0, 0, "yuri_run");
        var frameNames = this.textures.get('yuri_run').getFrameNames();
        console.log(frameNames);

        this.anims.create({
            key: 'yuri_run',
            frames: [{
                key: 'yuri_run',
                frame: "yuri_run_1.png"
            }, {
                key: 'yuri_run',
                frame: "yuri_run_2.png"
            }, {
                key: 'yuri_run',
                frame: "yuri_run_3.png"
            }, {
                key: 'yuri_run',
                frame: "yuri_run_4.png"
            }],
            frameRate: 20,
            repeat: -1
        });
        this.yuri_run.play("yuri_run");
        
        this.aGrid.placeAtIndex(104, this.ground_1);
        this.aGrid.placeAtIndex(38, this.background_sky);
        Align.scaleToGameW(this.background_sky, this.game,1);
        this.aGrid.placeAtIndex(34, this.yuri_run);

        Align.scaleToGameW(this.yuri_run, this.game,.2);
        this.aGrid.showNumbers();   
    }
    update() { 
        this.ground_1.tilePosition.x -= 5;
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
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 100 },
            debug: true
        }
    },
    scene: [SceneMain]
};

var game = new Phaser.Game(config);

