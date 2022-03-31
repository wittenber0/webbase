export default class GameOdd {
  constructor(game, homeFactors, awayFactors, drawFactors, type, betType, line, overFactors, underFactors, sport) {
    this.homeFactors = homeFactors;
    this.awayFactors = awayFactors;
    this.drawFactors = drawFactors;
    this.overFactors = overFactors;
    this.underFactors = underFactors;
    this.type = type;
    this.sport = sport;
    this.betType = betType;
    this.line = line

    this.gameId = game['id'];
    this.homeId = game['home_team_id'];
    this.awayId = game['away_team_id'];

    this.homeName = game['teams'].find(e => e.id === this.homeId)['full_name'];
    this.awayName = game['teams'].find(e => e.id === this.awayId)['full_name'];
  }
}
