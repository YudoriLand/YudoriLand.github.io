import Phaser  from "phaser";

export default class Slime extends Phaser.Physics.Arcade.Sprite{
    constructor(config, speed) {
        super(config.scene, config.x, config.y, "slime_anim_sprite");
        this.scene.physics.add.existing(this)
        this.scene.sys.displayList.add(this)
        this.scene.sys.updateList.add(this)
        this.body.allowGravity = false;
        this.body.setSize(70, 20);
        this.speed = speed;
        this.depth = 0;
    }
}