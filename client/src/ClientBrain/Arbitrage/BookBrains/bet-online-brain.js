import ArbitrageService from '../../../Shared/arbitrage-service';
import BookManager from '../book-manager';
import Game from '../Models/game';
import Odd from '../Models/odd';
import { BetFactorTypeEnum } from '../Models/v2/enum/BetFactorTypeEnum';
import { PlayerPropTypeEnum } from '../Models/v2/enum/PlayerPropTypeEnum';
import BetFactor from '../Models/v2/BetFactor';
import BookBet from '../Models/v2/BookBet';
import BookEvent from '../Models/v2/BookEvent';
import { BetDuration } from '../Models/v2/enum/BetDuration';
import { BetTypeEnum } from '../Models/v2/enum/BetTypeEnum';
import Factor from '../Models/v2/Factor';

export default class BetOnlineBrain{

  constructor(){
    this.gameOdds = [];
  }

  async loadSport(sport){
    return await ArbitrageService.getBetOnlineOdds(sport).then((r)=>{
      return r
      //https://bv2.digitalsportstech.com/api/grouped-markets/v2/categories?gameId=155547
      //{"gfm":true,"ppd":true,"h2h":true,"ss":["Hits","Hits + Runs + RBIs","Home runs","Strikeouts","Total bases"],"ou":["Hits","Strikeouts","Total bases"],"specials":false,"field":[],"acca":["lowerThan11","between11And21","between21And51"],"gameProps":true}
      //https://bv2.digitalsportstech.com/api/dfm/marketsByOu?sb=betonline&gameId=155547&statistic=Hits
      //https://bv2.digitalsportstech.com/api/dfm/marketsBySs?sb=betonline&gameId=155547&statistic=Home%20runs
      //https://bv2.digitalsportstech.com/api/dfex/marketsByH2h?sb=betonline&gameId=155547
    });
  }
  // async loadGamePlayerProp(){
  //   return await ArbitrageService.getBetOnlinePlayerProps(sport, gameId).then((r) => {
  //     return r;
  //   });
  // }

  async getGameTreev2(gameId){
    let gameTree = [];
    let sportsToLoad = [
      this.loadSport('baseball'),
      // this.loadSport('basketball'),
      // this.loadSport('hockey'),
      // this.loadSport('soccer'),
      // this.loadSport('football')
    ];
    return await Promise.all(sportsToLoad).then((values) => {
      values.forEach(v => {
        v.GameOffering.LeagueGroup.forEach( leagueGroup => {
            leagueGroup.DateGrouping.forEach( dateGrouping => {
              dateGrouping.ScheduleGroup.forEach( scheduleGroup => {
                scheduleGroup.TimeGrouping.forEach( gameTime => {
                  gameTime.Games.forEach( game => {
                    let gameId = this.getGameId(game, dateGrouping.GameDate, leagueGroup.League.toLowerCase());
                    let g = new BookEvent(
                      leagueGroup.League,
                      v.GameOffering.Sport,
                      gameId,                
                      game.Date
                    );
                    g.BookBets.push(this.getOddsFromGamev2(gameId, game));
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

  //scraping data from the api
  //sends to our brain to combine with other books
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
/*
      game.HomeLine.SpreadLine.Point, //spread based on home
      game.TotalLine.TotalLine.Point
*/
  getOddsFromGamev2(gameId, game) {
    letbookBets = [];
    let book = BookManager.getInstance().getBookById(1001);
    //#region home money line
    let bookBetHomeMoneyLineFactor = 
      new BetFactor
      (
        BetFactorTypeEnum.Home, 
        new Factor
        (
          game.HomeLine.MoneyLine.DecimalLine,
          game.HomeLine.MoneyLine.Line,
          book
        )
      );
    let bookBetHomeMoneyLine = 
      new BookBet
      (
        gamedId, 
        BetTypeEnum.MoneyLine, 
        PlayerPropTypeEnum.NonApplicable,
        BetDuration.Game, 
        0,
        [bookBetHomeMoneyLineFactor]
      );
      bookBets.push(bookBetHomeMoneyLine);
      //#endregion
    //#region away money line
      let bookBetAwayMoneyLineFactor = 
      new BetFactor
      (
        BetFactorTypeEnum.Away, 
        new Factor
        (
          game.AwayLine.MoneyLine.DecimalLine,
          game.AwayLine.MoneyLine.Line,
          book
        )
      );
    let bookBetAwayMoneyLine = 
      new BookBet
      (
        gamedId, 
        BetTypeEnum.MoneyLine, 
        PlayerPropTypeEnum.NonApplicable,
        BetDuration.Game, 
        0,
        [bookBetAwayMoneyLineFactor]
      );
      bookBets.push(bookBetAwayMoneyLine);
      //#endregion
    //#region draw money line
      let bookBetDrawMoneyLineFactor = 
      new BetFactor
      (
        BetFactorTypeEnum.Draw, 
        new Factor
        (
          game.DrawLine.MoneyLine.DecimalLine,
          game.DrawLine.MoneyLine.Line,
          book
        )
      );
    let bookBetDrawMoneyLine = 
      new BookBet
      (
        gamedId, 
        BetTypeEnum.MoneyLine, 
        PlayerPropTypeEnum.NonApplicable,
        BetDuration.Game, 
        0,
        [bookBetDrawMoneyLineFactor]
      );
      bookBets.push(bookBetDrawMoneyLine);
    //#endregion
    //#region home spread line
      let bookBetHomeSpreadLineFactor = 
      new BetFactor
      (
        BetFactorTypeEnum.Home, 
        new Factor
        (
          game.HomeLine.SpreadLine.DecimalLine,
          game.HomeLine.SpreadLine.Line,
          book
        )
      );
    let bookBetHomeSpreadLine = 
      new BookBet
      (
        gamedId, 
        BetTypeEnum.Spread, 
        PlayerPropTypeEnum.NonApplicable,
        BetDuration.Game, 
        game.HomeLine.SpreadLine.Point,
        [bookBetHomeSpreadLineFactor]
      );
      bookBets.push(bookBetHomeSpreadLine);
    //#endregion
    //#region away spread line
      let bookBetAwaySpreadLineFactor = 
      new BetFactor
      (
        BetFactorTypeEnum.Away, 
        new Factor
        (
          game.AwayLine.SpreadLine.DecimalLine,
          game.AwayLine.SpreadLine.Line,
          book
        )
      );
    let bookBetAwaySpreadLine = 
      new BookBet
      (
        gamedId, 
        BetTypeEnum.Spread, 
        PlayerPropTypeEnum.NonApplicable,
        BetDuration.Game, 
        game.AwayLine.SpreadLine.Point,
        [bookBetAwaySpreadLineFactor]
      );
      bookBets.push(bookBetAwaySpreadLine);
    //#endregion
    //#region TotalOver
      let bookBetTotalLineOverFactor = 
      new BetFactor
      (
        BetFactorTypeEnum.Over, 
        new Factor
        (
          game.TotalLine.TotalLine.Over.DecimalLine,
          game.TotalLine.TotalLine.Over.Line,
          book
        )
      );
    let bookBetTotalOverLine = 
      new BookBet
      (
        gamedId, 
        BetTypeEnum.TotalLine, 
        PlayerPropTypeEnum.NonApplicable,
        BetDuration.Game, 
        game.TotalLine.TotalLine.Point,
        [bookBetTotalLineOverFactor]
      );
      bookBets.push(bookBetTotalOverLine);
//#endregion
    //#region total under line
      let bookBetTotalUnderLineFactor = 
      new BetFactor
      (
        BetFactorTypeEnum.Under, 
        new Factor
        (
          game.TotalLine.TotalLine.Under.DecimalLine,
          game.TotalLine.TotalLine.Under.Line,
          book
        )
      );
    let bookBetTotalUnderLine = 
      new BookBet
      (
        gamedId, 
        BetTypeEnum.MoneyLine, 
        PlayerPropTypeEnum.NonApplicable,
        BetDuration.Game, 
        game.HomeLine.MoneyLine.Point,
        [bookBetTotalUnderLineFactor]
      );
      bookBets.push(bookBetTotalUnderLine);
    //#endregion

    return bookBets;
  
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
