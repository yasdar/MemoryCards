export default class InitGame extends Phaser.Scene {
  constructor() {
    super({ key: "InitGame" });
  }
  preload() {
    // load loading-animations assets
    this.load.image("preloader_bar", "./images/preloader_bar.png");
  }
  create() {
    console.log("🔄 InitGame create");
    //move to the preload scene
    this.scene.start("PreloadScene");
  }
}
