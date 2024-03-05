import Phaser from 'phaser';
import bgImg1 from "./assets/background.jpeg";
import aimImg from "./assets/Aim.png";
import target from "./assets/claypigeon.png";
import shootsound from "./assets/gun-sound.mp3";
import bullet from "./assets/bullet.png";

class MainScene extends Phaser.Scene {
    constructor () {
        super("startGame");
    }
    preload ()
    {        
        this.load.image("background1", bgImg1);
    }
    create() {
        this.add.image(0, 0, "background1").setOrigin(0, 0);
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
        this.load.image("background1", bgImg1);
        this.load.image("aimImg", aimImg);
        this.load.image("target", target);
        this.load.audio('clickSound', shootsound);
        this.load.image("bullet",bullet);
    }

    create ()
    {   
        const text = this.add.text(500, 400, '3', { fontSize: '100px',backgroundColor: "#000"});
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

        this.point = 0;
        this.background1 = this.add.image(0, 0, "background1");
        this.background1.setOrigin(0, 0);

        this.aimImg = this.add.image(0, 0, "aimImg");
        this.aimImg.setOrigin(0, 0);
        this.aimImg.setScale(0.4);
        this.aimImg.setDepth(1000);

        function startGame() {
            let self = this;

            self.target = self.add.image(100, 500, "target");
            self.target.setScale(0.2);
            self.target.setInteractive();
            self.target.on('pointerdown', function () {
                self.target.setVisible(false);
            });

            self.bullet = self.add.image(850, 50, "bullet");
            self.bullet.setScale(0.2);
            self.add.text(880, 30, "X", { fontSize: "40px", backgroundColor: "#000" });
            self.bullettext = self.add.text(930, 30, "20", { fontSize: "40px", backgroundColor: "#000" });
            self.bulletcount = 20;

            self.clickSound = self.sound.add('clickSound');

            self.input.on('pointerdown', () => {
                if (self.bulletcount > 0) {
                    self.clickSound.play();
                    self.bulletcount--;
                    self.bullettext.text = self.bulletcount;
                }
            });
    
        }
    }

    

    update(){
        this.aimImg.x=this.input.mousePointer.x-40
        this.aimImg.y=this.input.mousePointer.y-40
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
    scene: [MainScene, MyGame]
};

const game = new Phaser.Game(config);
