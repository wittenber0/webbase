export default class Game {
  constructor(odds, leagueName, homeName, awayName, gameId, actionGameId){
    this.odds = odds;
    this.leagueName = leagueName;
    this.homeName = homeName;
    this.awayName = awayName;
    this.gameId = gameId;
    this.actionGameId = actionGameId;
  }
}
