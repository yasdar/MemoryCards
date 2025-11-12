type StartPlayableType = () => void;
interface Window {
  StartPlayable: StartPlayableType;
}

type GoApp = () => void;
interface Window {
  GoApp: GoApp;
}

type MyGloabVar = {
  Me: any;
  GameIsOver: boolean;
  IsPortrait: boolean;
  BGS?: Howl;
  GlobalSound?: boolean;
};
interface Window {
  MyGloabVar: MyGloabVar;
}
type ReseizeGame = () => void;
interface Window {
  ReseizeGame: ReseizeGame;
}

/*************global func***********/
//type game_Ready = () => void;
//interface Window {game_Ready: game_Ready};
/*****others *************/
