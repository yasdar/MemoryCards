interface _AboutGame {
  width: number;
  height: number;
  ScaleFactor: number;
  backgroundColor: number;
}
export let AboutGame: _AboutGame = {
  width: 769,
  height: 1366,
  ScaleFactor: 1,
  backgroundColor: 0xffffff,
};

window.MyGloabVar = {
  Me: null,
  GameIsOver: false,
  IsPortrait: false,
};

export const FinishGame = (score: number, durationMs: number) => {
  console.log("postMessage", {
    gameId: "memory",
    score: score,
    durationMs: durationMs,
  });

  window.parent.postMessage(
    { gameId: "memory", score: score, durationMs: durationMs },
    "*"
  );

  setTimeout(() => {
    //Optional Flutter WebView fallback:
    // @ts-ignore
    if (window.flutter_inappwebview) {
      // @ts-ignore
      window.flutter_inappwebview?.callHandler("bbScore", [
        { gameId: "memory", score: score, durationMs: durationMs },
      ]);
    }
  }, 1000);
};
export const ReseizeGame = () => {
  let WW: number = window.innerWidth;
  let HH: number = window.innerHeight;
  console.log(" WW, HH", WW, HH, window.MyGloabVar.Me);
  if (window.MyGloabVar.Me) {
    if (WW < HH) {
      console.log("consof.--------------> Portrait!", WW, HH);
      window.MyGloabVar.Me.cameras.main.setSize(WW, HH);
      window.MyGloabVar.Me.ArrangePortrait();
    } else {
      console.log("consof.--------------> Landscpae!", WW, HH);
      window.MyGloabVar.Me.cameras.main.setSize(WW, HH);
      window.MyGloabVar.Me.ArrangeLandscape();
    }
  }
};
