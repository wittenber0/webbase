export default class GameOdd {
  constructor(game, type, betType, line, pickFactors) {
    this.type = type;
    this.sport = game.leagueName.toUpperCase();
    this.betType = betType;
    this.line = line

    this.gameId = game.gameId;
    //this.homeId = game['home_team_id'];
    //this.awayId = game['away_team_id'];

    this.homeName = game.homeName;
    this.awayName = game.awayName;

    this.pickFactors = pickFactors;
    this.betSizes = {}
  }
}
