export default class GameOdd {
  constructor(game, type, betType, line, pickFactors, ttSide) {
    this.type = type;
    this.sport = game.leagueName.toUpperCase();
    this.betType = betType;
    this.line = line;
    this.gameId = game.gameId;
    this.homeName = game.homeName;
    this.awayName = game.awayName;
    this.pickFactors = pickFactors;
    this.ttSide = ttSide;

    //calculated
    //this.bestEV;
    //this.pinnacleFactors;
    this.betSizes = {};
    this.realOds = {};
    this.evs = {};
  }
}
