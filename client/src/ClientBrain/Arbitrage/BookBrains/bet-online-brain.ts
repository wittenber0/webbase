import ArbitrageService from '../../../Shared/arbitrage-service';
import { BetFactorTypeEnum } from '../Models/v2/enum/BetFactorTypeEnum';
import { BetTypeEnum } from '../Models/v2/enum/BetTypeEnum';
import { PlayerPropTypeEnum } from '../Models/v2/enum/PlayerPropTypeEnum';
import { SportEnum } from '../Models/v2/enum/SportEnum';
import Factor from '../Models/v2/Factor';
import Participant from '../Models/v2/Participant';
import { BetDuration } from '../Models/v2/enum/BetDuration';
import Book from '../Models/v2/Book';
import BookBet from '../Models/v2/BookBet';
import BookEvent from '../Models/v2/BookEvent';
import BookManager from '../book-manager';
import BetFactor from '../Models/v2/BetFactor';
import BettingEvent from '../Models/v2/BettingEvent';

export default class BetOnlineBrain {

    constructor(){

    }

    async loadSport(sportId:string){
        let reqs = [
            ArbitrageService.getBetOnlineOdds(sportId)
        ];
        
        return await Promise.all(reqs).then((values)=>{
            let markets = values[0];
            let bookEvents: BookEvent[] = [];
            
            values.forEach(v => {
                v.GameOffering.LeagueGroup.forEach( (leagueGroup:any)  => {
                    leagueGroup.DateGrouping.forEach( (dateGrouping:any) => {
                      dateGrouping.ScheduleGroup.forEach( (scheduleGroup:any) => {
                        scheduleGroup.TimeGrouping.forEach( (timeGrouping:any) => {
                            timeGrouping.Games.forEach( (game:any) => {
                            let homeName = game.HomeTeam;
                            let awayName = game.AwayTeam;
                            let participants:Participant[] = [];
                            let gameId = this.getGameId(game, dateGrouping.GameDate, leagueGroup.League.toLowerCase());
                            let gameDateString = dateGrouping.GameDate + " " + timeGrouping.GameTime;
                           
                            //debugger;
                            //dategrouping.gamedate
                            //timegrouping.gametime
                            //order here matters
                            participants.push(new Participant('home', homeName));
                            participants.push(new Participant('away', awayName));
                            
                            let bettingEvent = new BettingEvent(
                                leagueGroup.League.toLowerCase(),
                                v.GameOffering.Sport,
                                participants,
                                gameId,
                                new Date(gameDateString)
                              );
                            bookEvents.push(new BookEvent(
                                this.getOddsFromGame(gameId, game, gameDateString, participants),
                                bettingEvent
                              ));
                          });
                        });
                      });
                    });
                  });
                });
              return bookEvents;
        });
    }

    async getGameTree(){
        let allBookEvents:BookEvent[] = [];
        let sportsToLoad = [
          this.loadSport('baseball'),
          // this.loadSport('basketball'),
          // this.loadSport('hockey'),
          // this.loadSport('soccer'),
          // this.loadSport('football')
        ];
        return await Promise.all(sportsToLoad).then(sportTrees => {
            sportTrees.forEach( st => {
              Array.prototype.push.apply(allBookEvents, st);
            });
            return allBookEvents;
        });
      }

      getOddsFromGame(gameId:any, game:any, dateString:string, betParticipants:Participant[]) {
        let bookBets = [];
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
            gameId, 
            BetTypeEnum.MoneyLine, 
            PlayerPropTypeEnum.NonApplicable,
            BetDuration.Game, 
            0,
            [bookBetHomeMoneyLineFactor],
            betParticipants,
            new Date(dateString),
            book
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
            gameId, 
            BetTypeEnum.MoneyLine, 
            PlayerPropTypeEnum.NonApplicable,
            BetDuration.Game, 
            0,
            [bookBetAwayMoneyLineFactor],
            betParticipants,
            new Date(dateString),
            book
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
            gameId, 
            BetTypeEnum.MoneyLine, 
            PlayerPropTypeEnum.NonApplicable,
            BetDuration.Game, 
            0,
            [bookBetDrawMoneyLineFactor],
            betParticipants,
            new Date(dateString),
            book
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
            gameId, 
            BetTypeEnum.Spread, 
            PlayerPropTypeEnum.NonApplicable,
            BetDuration.Game, 
            game.HomeLine.SpreadLine.Point,
            [bookBetHomeSpreadLineFactor],
            betParticipants,
            new Date(dateString),
            book
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
            gameId, 
            BetTypeEnum.Spread, 
            PlayerPropTypeEnum.NonApplicable,
            BetDuration.Game, 
            game.AwayLine.SpreadLine.Point,
            [bookBetAwaySpreadLineFactor],
            betParticipants,
            new Date(dateString),
            book
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
            gameId, 
            BetTypeEnum.TotalLine, 
            PlayerPropTypeEnum.NonApplicable,
            BetDuration.Game, 
            game.TotalLine.TotalLine.Point,
            [bookBetTotalLineOverFactor],
            betParticipants,
            new Date(dateString),
            book
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
            gameId, 
            BetTypeEnum.MoneyLine, 
            PlayerPropTypeEnum.NonApplicable,
            BetDuration.Game, 
            game.HomeLine.MoneyLine.Point,
            [bookBetTotalUnderLineFactor],
            betParticipants,
            new Date(dateString),
            book
          );
          bookBets.push(bookBetTotalUnderLine);
        //#endregion
    
        return bookBets;
      
      }

      //for type 'game' games id will be of format 'game|league|homeName|awayName|YYYYMMDD'
  getGameId(game:any, dateString:string, league:any){
    return 'game|'+league+'|'+game.HomeTeam+'|'+game.AwayTeam+'|'+this.getDateString(dateString)
  }

  getDateString(s:any){
    let d = new Date(s);
    return d.getFullYear().toString()+('0'+(d.getMonth()+1)).slice(-2)+('0'+d.getDate()).slice(-2);
  }
}