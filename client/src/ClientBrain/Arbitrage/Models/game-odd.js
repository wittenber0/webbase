export default class GameOdd {
  constructor(game, type, betType, line, pickFactors) {
    this.type = type;
    this.sport = game.leagueName.toUpperCase();
    this.betType = betType;
    this.line = line

    this.gameId = game['id'];
    this.homeId = game['home_team_id'];
    this.awayId = game['away_team_id'];

    this.homeName = game['teams'].find(e => e.id === this.homeId)['full_name'];
    this.awayName = game['teams'].find(e => e.id === this.awayId)['full_name'];

    this.pickFactors = pickFactors;
  }
}
