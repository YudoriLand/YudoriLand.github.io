import Phaser  from "phaser";

export default class Coin extends Phaser.Physics.Arcade.Sprite{
    constructor(config, bool) {
        super(config.scene, config.x, config.y, "coin_sprite_sheet");
        this.scene.physics.add.existing(this)
        this.scene.sys.displayList.add(this)
        this.scene.sys.updateList.add(this)
        this.body.allowGravity = false;
        // this.body.setSize(70, 20);
        this.depth = 0;
        this.bool = false;
    }
}