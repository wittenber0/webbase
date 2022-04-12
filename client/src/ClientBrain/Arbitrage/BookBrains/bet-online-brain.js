import ArbitrageService from '../../../Shared/arbitrage-service';
import BookManager from '../book-manager';
import Game from '../Models/game';
import Odd from '../Models/odd';

export default class BetOnlineBrain{

  constructor(){
    this.gameOdds = [];
  }

  async loadSport(sport){
    return await ArbitrageService.getBetOnlineOdds(sport).then((r)=>{
      return r
    });
  }

  async getGameTree(){
    let gameTree = []
    let sportsToLoad = [
      this.loadSport('baseball'),
      this.loadSport('basketball'),
      this.loadSport('hockey'),
      this.loadSport('soccer'),
      this.loadSport('football')
    ]
    return await Promise.all(sportsToLoad).then((values) => {
      values.forEach(v => {
        v.GameOffering.LeagueGroup.forEach( leagueGroup => {
          leagueGroup.DateGrouping.forEach( dateGrouping => {
            dateGrouping.ScheduleGroup.forEach( scheduleGroup => {
              scheduleGroup.TimeGrouping.forEach( gameTime => {
                gameTime.Games.forEach( game => {
                  let g = new Game(
                    this.getOddsFromGame(game),
                    leagueGroup.League,
                    game.HomeTeam,
                    game.AwayTeam,
                    this.getGameId(game, dateGrouping.GameDate, leagueGroup.League.toLowerCase())
                  );
                  gameTree.push(g);
                });
              });
            });
          });
        });
      });
      return gameTree;
    });
  }

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
