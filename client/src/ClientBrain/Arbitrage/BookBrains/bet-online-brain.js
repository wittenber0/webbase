import ArbitrageService from '../../../Shared/arbitrage-service';
import BookManager from '../book-manager';
import Game from '../Models/game';
import Odd from '../Models/odd';

export default class BetOnlineBrain{

  constructor(){
    this.gameOdds = [];
  }

  async loadSport(sport, league){
    return await ArbitrageService.getBetOnlineOdds(sport, league).then((r)=>{
      return r
    });
  }

  //scraping data from the api
  //sends to our brain to combine with other books
  async getGameTree(){
    let gameTree = []
    let sportsToLoad = [
      this.loadSport('baseball', 'mlb'),
      this.loadSport('basketball', 'nba'),
      this.loadSport('hockey', 'nhl'),
      this.loadSport('soccer','mls'),
      this.loadSport('football', 'nfl')
    ]
    return await Promise.all(sportsToLoad).then((values) => {
      values.forEach(v => {
        v.GameOffering.GamesDescription.forEach( gd => {
          let game = gd.Game;
          let g = new Game(
            this.getOddsFromGame(game),
            v.GameOffering.League.toLowerCase(),
            game.HomeTeam,
            game.AwayTeam,
            this.getGameId(game, gd.GameDate, v.GameOffering.League.toLowerCase())
          );
          gameTree.push(g);
        });
      });
      return gameTree;
    });
  }

  //get odds from their game
  getOddsFromGame(game){
    let odd = new Odd(
      BookManager.getInstance().getBookById(1001),
      'game',
      game.HomeLine.MoneyLine.Line,
      game.AwayLine.MoneyLine.Line,
      game.DrawLine.MoneyLine.Line,
      game.HomeLine.SpreadLine.Line,
      game.AwayLine.SpreadLine.Line,
      game.TotalLine.TotalLine.Over.Line,
      game.TotalLine.TotalLine.Under.Line,
      game.HomeLine.SpreadLine.Point, //spread based on home
      game.TotalLine.TotalLine.Point
    );
    /* bet-online HomeLine.TeamTotalLine Odds are incorrect coming from this route
      game.HomeLine.TeamTotalLine.Over.Line,
      game.HomeLine.TeamTotalLine.Under.Line,
      game.HomeLine.TeamTotalLine.Point,
      game.AwayLine.TeamTotalLine.Over.Line,
      game.AwayLine.TeamTotalLine.Under.Line,
      game.AwayLine.TeamTotalLine.Point
    );
    if(game.HomeTeam == "Arizona Diamondbacks"){
      console.log("here:")
      console.log(odd)
      console.log(game);
    }*/
    return [odd];
  }

  //for type 'game' games id will be of format 'game|league|homeName|awayName|YYYYMMDD'
  getGameId(game, dateString, league){
    return 'game|'+league+'|'+game.HomeTeam+'|'+game.AwayTeam+'|'+this.getDateString(dateString)
  }

  getDateString(s){
    let d = new Date(s);
    return d.getFullYear().toString()+('0'+(d.getMonth()+1)).slice(-2)+('0'+d.getDate()).slice(-2);
  }
}
