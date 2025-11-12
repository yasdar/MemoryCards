import Phaser from "phaser";
import { AboutGame, ReseizeGame } from "./config";
import PreloadScene from "./scenes/preload";
import GamePlay from "./scenes/gameplay";
import InitGame from "./scenes/initgame";
const Gconfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  transparent: false,
  backgroundColor: AboutGame.backgroundColor,
  scale: {
    parent: "GameDiv",
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: AboutGame.width,
    height: AboutGame.height,
  },
  scene: [InitGame, PreloadScene, GamePlay],
};

window.onresize = function () {
  if (window.ReseizeGame) {
    setTimeout(() => {
      window.ReseizeGame();
    }, 50);
  }
};

window.StartPlayable = () => {
  new Phaser.Game(Gconfig);
  window.ReseizeGame = ReseizeGame;
};

window.StartPlayable();
