import { AboutGame, FinishGame } from "../config";

export default class GamePlay extends Phaser.Scene {
  End: boolean = false;
  userInteract: boolean = false;
  collectPairs: Array<Phaser.GameObjects.Image> = [];
  score: number = 0;
  timerCount: number = 0;
  //images
  background?: Phaser.GameObjects.Image;
  ControlSound?: Phaser.GameObjects.Image;
  AllCards: Array<Phaser.GameObjects.Image> = [];
  //audios
  SoundOn: boolean = true;
  bgS?: Phaser.Sound.BaseSound;
  flipS?: Phaser.Sound.BaseSound;
  correctS?: Phaser.Sound.BaseSound;
  wrongS?: Phaser.Sound.BaseSound;
  //texts
  scoreTxt?: Phaser.GameObjects.Text;
  timeTxt?: Phaser.GameObjects.Text;
  constructor() {
    super({ key: "GamePlay" });
  }

  create() {
    console.log("🕹️ playing screen1 scene");
    //init vars
    window.MyGloabVar = { Me: null, GameIsOver: false, IsPortrait: false };
    this.End = false;
    this.collectPairs = [];
    //prepare audios
    this.bgS = this.sound.add("bgs").setVolume(0.3);
    this.flipS = this.sound.add("flip").setVolume(1);
    this.correctS = this.sound.add("correct").setVolume(1);
    this.wrongS = this.sound.add("wrong").setVolume(1);
    //check device oriontation
    if (this.cameras.main.width > this.cameras.main.height) {
      AboutGame.ScaleFactor = this.cameras.main.width / 1366;
      window.MyGloabVar.IsPortrait = false;
    } else {
      AboutGame.ScaleFactor = this.cameras.main.width / 769;
      window.MyGloabVar.IsPortrait = true;
    }
    //check first click to start audio
    this.input.on(
      "pointerdown",
      () => {
        if (!this.bgS?.isPlaying && !this.userInteract) {
          this.userInteract = true;
          setTimeout(() => {
            if (this.SoundOn) {
              this.bgS?.play();
            }
          }, 100);
        }
      },
      this
    );
    //add objects
    this.background = this.add.image(0, 0, "Background");
    this.ControlSound = this.add.image(0, 0, "soundOn");
    this.ControlSound.setInteractive();
    this.ControlSound.on("pointerdown", this.SoundFunc, this);
    //add 6 cards
    this.addCrads();
    //add score text
    this.scoreTxt = this.add
      .text(0, 0, "Score : " + this.score, {
        font: "48px Arial",
        color: "#333333",
        stroke: "#ffffff",
        strokeThickness: 2,
      })
      .setOrigin(0.5, 0.5);
    //add timer text
    this.timeTxt = this.add
      .text(0, 0, "Time : \n00 : 00", {
        font: "48px Arial",
        color: "#000000",
        stroke: "#ffffff",
        strokeThickness: 2,
      })
      .setOrigin(0.5, 0.5);
    // get refrence to the actual scene
    window.MyGloabVar.Me = this;
    //arrange objects with device oriontation
    if (this.cameras.main.width > this.cameras.main.height) {
      this.ArrangeLandscape();
    } else {
      this.ArrangePortrait();
    }

    //start first cards animation (appearing)
    this.startCard();
    //start time count
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (this.End) {
          return;
        }

        this.timerCount++;
        this.timeTxt?.setText(
          "Time : \n" + this.formatTime(this.timerCount * 1000)
        );
      },
      callbackScope: this,
      loop: true,
    });
  }

  addCrads() {
    //add 6 cards
    this.AllCards = [];
    let Arrangment: Array<any> = this.shuffleArray([1, 2, 3, 1, 2, 3]);
    // console.log(Arrangment);
    for (let i: number = 0; i < 6; i++) {
      let card: Phaser.GameObjects.Image = this.add.image(0, 0, "card_cover");
      card.setData({ id: Arrangment[i], flipped: false, counted: false });
      card.setName("card" + Arrangment[i]);
      card.setInteractive();
      //console.log("add card", card.name);
      card.on("pointerdown", () => {
        if (card.getData("flipped")) {
          return;
        }
        if (this.collectPairs.length == 2) {
          return;
        }
        this.FlipCard(card);
      });
      this.AllCards.push(card);
    }
  }
  startCard() {
    let i = 0;
    this.AllCards.forEach((card: Phaser.GameObjects.Image) => {
      card.setAlpha(0);
      let SC: number = card.scaleX;
      card.setScale(0.1);
      this.tweens.add({
        targets: card,
        alpha: 1,
        scale: SC,
        duration: 200,
        delay: 200 * i,
      });
      i++;
    });
  }
  /**
   * arrange cards positions for portrait and landscape
   */
  ArrangeCard() {
    //scale cards
    let portraitIndex = [
      { X: 0.2, Y: 0.38 },
      { X: 0.5, Y: 0.38 },
      { X: 0.8, Y: 0.38 },
      { X: 0.2, Y: 0.62 },
      { X: 0.5, Y: 0.62 },
      { X: 0.8, Y: 0.62 },
    ];
    let LandscapeIndex = [
      { X: 0.33, Y: 0.3 },
      { X: 0.5, Y: 0.3 },
      { X: 0.66, Y: 0.3 },
      { X: 0.33, Y: 0.7 },
      { X: 0.5, Y: 0.7 },
      { X: 0.66, Y: 0.7 },
    ];
    let i: number = 0;

    this.AllCards.forEach((card: Phaser.GameObjects.Image) => {
      card.setScale(AboutGame.ScaleFactor * 1.5);
      if (window.MyGloabVar.IsPortrait) {
        card.setPosition(
          this.cameras.main.width * portraitIndex[i].X,
          this.cameras.main.height * portraitIndex[i].Y
        );
      } else {
        card.setPosition(
          this.cameras.main.width * LandscapeIndex[i].X,
          this.cameras.main.height * LandscapeIndex[i].Y
        );
      }
      i++;
    });
    //set cards positions
  }
  /**
   * flip card when clicked
   */
  FlipCard(card: Phaser.GameObjects.Image) {
    this.collectPairs.push(card);
    if (this.SoundOn) this.flipS?.play();
    card.setData({ flipped: true });
    let SC: number = card.scaleX;
    this.tweens.add({
      targets: card,
      scaleX: 0.1,
      duration: 100,
      onComplete: () => {
        //change texture
        card.setTexture("card" + card.getData("id"));
        //anime scale
        this.tweens.add({
          targets: card,
          scaleX: SC,
          duration: 200,
          delay: 25,
          onComplete: () => {
            this.checkPairs();
          },
        });
      },
    });
  }
  /**
   * flip card for the wrong combination
   */
  ReflipCard(card: Phaser.GameObjects.Image) {
    let SC: number = card.scaleX;
    this.tweens.add({
      targets: card,
      scaleX: 0.1,
      duration: 100,
      delay: 700,
      onComplete: () => {
        //change texture
        card.setTexture("card_cover");
        //anime scale
        this.tweens.add({
          targets: card,
          scaleX: SC,
          duration: 200,
          delay: 25,
          onComplete: () => {
            card.setData({ flipped: false });
            this.collectPairs.pop();
          },
        });
      },
    });
  }
  checkPairs() {
    //console.log("check now", this.collectPairs);
    if (this.collectPairs.length == 2) {
      if (
        this.collectPairs[0].getData("id") == this.collectPairs[1].getData("id")
      ) {
        //"good pair"
        this.collectPairs = [];
        this.score += 2;
        this.updateScore();
        if (this.score == 6) {
          console.log("game end now !!");
          this.End = true;
          FinishGame(this.score, this.timerCount * 1000);
        }
      } else {
        //"wrong pair"
        // we use pop  : start from the end of the array
        this.ReflipCard(this.collectPairs[1]);
        this.ReflipCard(this.collectPairs[0]);
        setTimeout(() => {
          if (this.SoundOn) this.wrongS?.play();
        }, 700);
      }
    }
  }
  updateScore() {
    this.tweens.add({
      targets: this.scoreTxt,
      scale: 1.4,
      ease: Phaser.Math.Easing.Bounce.Out,
      duration: 100,
      yoyo: true,
      repeat: 0,
      onComplete: () => {
        if (this.SoundOn) this.correctS?.play();
        this.scoreTxt?.setText("Score : " + this.score);
      },
    });
  }

  ArrangePortrait() {
    window.MyGloabVar.IsPortrait = true;
    AboutGame.ScaleFactor = this.cameras.main.width / 769;

    let _H: number = this.cameras.main.height;
    let _W: number = this.cameras.main.width;
    console.log(AboutGame.ScaleFactor, "🦞 --------------> Portrait!", _W, _H);
    //background
    let bg_coef = this.background!.width / this.background!.height;
    this.background?.setDisplaySize(_H * bg_coef, _H);
    this.background?.setPosition(_W * 0.5, _H * 0.5);
    //sound btn
    this.ControlSound?.setScale(AboutGame.ScaleFactor * 1.25);
    this.ControlSound?.setPosition(
      _W - this.ControlSound.displayWidth,
      this.ControlSound.displayHeight
    );

    this.ArrangeCard();
    //score text
    this.scoreTxt!.setFontSize(Math.round(AboutGame.ScaleFactor * 60));
    this.scoreTxt!.setPosition(_W * 0.5, this.scoreTxt!.displayHeight * 0.75);
    //time text
    this.timeTxt!.setFontSize(Math.round(AboutGame.ScaleFactor * 60));
    this.timeTxt!.setPosition(_W * 0.5, this.scoreTxt!.displayHeight * 3);
  }

  ArrangeLandscape() {
    window.MyGloabVar.IsPortrait = false;
    AboutGame.ScaleFactor = this.cameras.main.width / 1500;

    let _H: number = this.cameras.main.height;
    let _W: number = this.cameras.main.width;
    console.log(AboutGame.ScaleFactor, "🐠 --------------> landscape!", _W, _H);

    //background
    this.background?.setDisplaySize(_W, _H);
    this.background?.setPosition(_W * 0.5, _H * 0.5);
    //sound btn
    this.ControlSound?.setScale(AboutGame.ScaleFactor * 1.25);
    this.ControlSound?.setPosition(
      _W - this.ControlSound.displayWidth,
      this.ControlSound.displayHeight
    );

    this.ArrangeCard();

    //score text
    this.scoreTxt!.setFontSize(Math.round(AboutGame.ScaleFactor * 60));
    this.scoreTxt!.setPosition(this.scoreTxt!.displayWidth * 0.7, _H * 0.35);
    //time text
    this.timeTxt!.setFontSize(Math.round(AboutGame.ScaleFactor * 60));
    this.timeTxt!.setPosition(
      this.scoreTxt!.displayWidth * 0.7,
      _H * 0.35 + this.scoreTxt!.displayHeight * 2
    );
  }
  /**
   * mute/unmute audios
   */
  SoundFunc() {
    this.SoundOn = !this.SoundOn;
    if (this.SoundOn) {
      this.ControlSound!.setTexture("soundOn");
      this.bgS!.play();
    } else {
      this.bgS!.pause();
      this.ControlSound!.setTexture("soundOff");
    }
  }
  /**
   * return an array of number
   */
  shuffleArray(array: Array<number>) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }
  /**
   * format time to mins : secs
   */
  formatTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes.toString().padStart(2, "0")} : ${seconds
      .toString()
      .padStart(2, "0")}`;
  }
}
