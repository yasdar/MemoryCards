export default class PreloadScene extends Phaser.Scene {
  preloader_bar?: Phaser.GameObjects.Image;
  loadingText?: Phaser.GameObjects.Text;
  //max loading-bar scale
  maxScale: number = 0.75;
  constructor() {
    super({ key: "PreloadScene" });
  }
  preload() {
    // load assets
    this.load.crossOrigin = "anonymous";
    //add a loading bar
    this.preloader_bar = this.add.image(0, 0, "preloader_bar");
    this.preloader_bar.setOrigin(0, 0.5);
    this.preloader_bar.setScale(this.maxScale, this.maxScale);
    this.preloader_bar.setPosition(
      this.cameras.main.width * 0.5 - this.preloader_bar.displayWidth * 0.5,
      this.cameras.main.height * 0.45
    );
    this.preloader_bar.setScale(this.maxScale * 0.01, this.maxScale);
    //add loading text
    this.loadingText = this.add
      .text(
        this.cameras.main.width * 0.5,
        this.preloader_bar.y + this.preloader_bar.displayHeight * 0.8,
        "Loading game...",
        { font: "16px Arial", color: "#333333" }
      )
      .setOrigin(0.5, 0);
    //listen to loading event
    this.load.on("progress", this.loadingAssets, this);
    //start loading images
    this.load.image("Background", "./images/background.png");
    this.load.image("cadre", "./images/cadre.png");
    this.load.image("card_cover", "./images/card_cover.png");
    this.load.image("card1", "./images/card1.png");
    this.load.image("card2", "./images/card2.png");
    this.load.image("card3", "./images/card3.png");
    this.load.image("soundOn", "./images/soundOn.png");
    this.load.image("soundOff", "./images/soundOff.png");
    //start loading audios
    this.load.audio("bgs", "./audios/bgs.mp3");
    this.load.audio("flip", "./audios/flip.mp3");
    this.load.audio("correct", "./audios/correct.mp3");
    this.load.audio("wrong", "./audios/wrong.mp3");
  }
  loadingAssets(value: number) {
    const percentText = Math.round(value * 100) + "%";
    //scale the loading bar
    this.preloader_bar?.setScale(
      (this.maxScale * Math.round(value * 100)) / 100,
      this.maxScale
    );
    //show the actual loading progress
    this.loadingText!.setText(`Loading game...${percentText}`);
  }
  create() {
    //all assets are loaded
    //move to the game scene
    this.scene.start("GamePlay");
  }
}
