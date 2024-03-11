import Phaser from 'phaser';
import bgImg1 from "./assets/background.jpeg";
import aimImg from "./assets/Aim.png";
import target from "./assets/claypigeon.png";
import shootsound from "./assets/gun-sound.mp3";
import bullet from "./assets/bullet.png";

let point = 0;
let sizing;
let targetremake;

class MainScene extends Phaser.Scene {
    constructor () {
        super("startGame");
    }
    preload ()
    {        
        this.load.image("background", bgImg1);
    }
    create() {
        this.add.image(0, 0, "background").setOrigin(0, 0);
        this.add.text(230, 200, "Clay pigeon shooting", {fontSize: "50px",backgroundColor: "#000"})
        this.add.text(470, 500, "Start", {fontSize: "40px",backgroundColor: "#000"})
        .setInteractive()
        .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => this.scene.start("playGame"))
    }
}

class MyGame extends Phaser.Scene
{

    constructor ()
    {
        super("playGame");
    }

    preload ()
    {        
        this.load.image("background", bgImg1);
        this.load.image("aimImg", aimImg);
        this.load.image("target", target);
        this.load.audio('clickSound', shootsound);
        this.load.image("bullet",bullet);
    }

    create ()
    {   
        const text = this.add.text(500, 400, '3', { fontSize: '100px',backgroundColor: "#000"});
        this.gravity = 0.5;
        text.setDepth(1000);
        this.time.delayedCall(3000, startGame, [], this);
        let count = 2;
        this.time.addEvent({
            delay: 1000,
            callback: function() {
                text.setText(count);
                if (count==0) text.setText('');
                count--;
            },
            repeat: 2
        });

        point = 0;
        this.background = this.add.image(0, 0, "background");
        this.background.setOrigin(0, 0);

        this.aimImg = this.add.image(0, 0, "aimImg");
        this.aimImg.setOrigin(0, 0);
        this.aimImg.setScale(0.4);
        this.aimImg.setDepth(1000);

        function startGame() {
            let self = this;
            self.setx = [0,1024];
            self.setxindex = Math.random() < 0.5 ? 0 : 1;
            self.target = self.add.image(self.setx[self.setxindex], Math.floor(Math.random() * (800 - 200 + 1)) + 200, "target");
            self.target.setScale(0.4);
            self.target.setInteractive();
            targetremake = () => {
                self.setxindex = Math.random() < 0.5 ? 0 : 1;
                self.target.x = self.setx[self.setxindex];
                self.target.y = Math.floor(Math.random() * (800 - 200 + 1)) + 200;
            }

            sizing = self.tweens.add({
                targets     : [ self.target ],
                scale: 0,
                ease        : 'Linear',
                duration    : 2000,
            });
            self.target.on('pointerdown', function () {
                targetremake();
                point += 1;
                self.pointviewtext.text = point;
                self.gravity = 0.5;
                sizing.restart();
            });
            self.pointview = self.add.image(50, 50, "target");
            self.pointview.setScale(0.2);
            self.pointviewtext = self.add.text(100, 30, "0", { fontSize: "40px", backgroundColor: "#000" });
            self.bullet = self.add.image(850, 50, "bullet");
            self.bullet.setScale(0.2);
            self.add.text(880, 30, "X", { fontSize: "40px", backgroundColor: "#000" });
            self.bullettext = self.add.text(930, 30, "20", { fontSize: "40px", backgroundColor: "#000" });
            self.bulletcount = 20;

            self.clickSound = self.sound.add('clickSound');

            self.input.on('pointerdown', () => {
                if (self.bulletcount > 1) {
                    self.clickSound.play();
                    self.bulletcount--;
                    self.bullettext.text = self.bulletcount;
                }
                else {
                    this.scene.start("EndGame")
                }
            });
    
        }
    }

    

    update(){
        this.aimImg.x=this.input.mousePointer.x-40;
        this.aimImg.y=this.input.mousePointer.y-40;
        if (this.target) {
            if (this.setxindex==0) this.target.x += 10;
            else this.target.x -= 10;
            this.target.y += this.gravity;
            this.gravity *= 1.03;
            this.target.y -= 5;
            if (this.target.scale==0 || this.target.scale==0.4) {
                sizing.restart();
                this.gravity = 0.5;
            }
            if (this.target.x<0 || this.target.x>1024 || this.target.y<0 || this.target.y>1024) {
                targetremake();
                sizing.restart();
                this.gravity = 0.5;
            }
        }
    }

}

class EndGame extends Phaser.Scene {
    constructor () {
        super("EndGame");
    }
    preload ()
    {        
        this.load.image("background", bgImg1);
    }
    create() {
        this.add.image(0, 0, "background").setOrigin(0, 0);
        this.add.text(500, 200, point, {fontSize: "80px",backgroundColor: "#000"})
        this.add.text(380, 400, "Retry?", {fontSize: "80px",backgroundColor: "#000"})
        .setInteractive()
        .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => this.scene.start("playGame"))
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 1024,
    height: 1024,
    backgroundColor: 0x000000,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 200 },
            debug: process.env.DEBUG === "true",
        },
    },
    scene: [MainScene, MyGame, EndGame]
};

const game = new Phaser.Game(config);
