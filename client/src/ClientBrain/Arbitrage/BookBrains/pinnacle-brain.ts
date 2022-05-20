import ArbitrageService from '../../../Shared/arbitrage-service';
import BookManager from '../book-manager';
import BetFactor from '../Models/v2/BetFactor';
import BettingEvent from '../Models/v2/BettingEvent';
import Book from '../Models/v2/Book';
import BookBet from '../Models/v2/BookBet';
import BookEvent from '../Models/v2/BookEvent';
import { BetDuration } from '../Models/v2/enum/BetDuration';
import { BetFactorTypeEnum } from '../Models/v2/enum/BetFactorTypeEnum';
import { BetTypeEnum } from '../Models/v2/enum/BetTypeEnum';
import { PlayerPropTypeEnum } from '../Models/v2/enum/PlayerPropTypeEnum';
import { SportEnum } from '../Models/v2/enum/SportEnum';
import Factor from '../Models/v2/Factor';
import Participant from '../Models/v2/Participant';

export default class PinnacleBrain {
  matchups:any;
  markets:any;

  constructor(){
    this.matchups = [];
    this.markets = [];

  }
  async loadSport(sportId:number){
    let reqs = [
      ArbitrageService.getPinnacleMarkets(sportId),
      ArbitrageService.getPinnacleMatchUps(sportId)
    ]
    return await Promise.all(reqs).then((values)=>{
      let matchups = values[1];
      let markets = values[0];
      let bookEvents: BookEvent[] = [];
      let marketArray:any = {};

      markets.forEach( (market:any) => {
        if(market.matchupId.toString() && Object.keys(marketArray).includes(market.matchupId.toString())){
          marketArray[market.matchupId.toString()].push(market);
        }else{
          marketArray[market.matchupId.toString()] = [market];
        }
      })

      matchups.forEach( (matchup:any) => {
        let homeName = matchup.participants.find((p:any) => p.alignment === 'home').name;
        let awayName = matchup.participants.find((p:any) => p.alignment === 'away').name;
        let participants:Participant[] = [];
        let gameId = this.getGameId(matchup.league.name.toLowerCase(), homeName, awayName, matchup.startTime);

        //order here matters
        participants.push(new Participant('home', homeName));
        participants.push(new Participant('away', awayName));
        
        if(marketArray[matchup.id] && !matchup.isLive){

          let bettingEvent = new BettingEvent(
            matchup.league.name.toLowerCase(),
            this.getSportEnumFromPinnacleSportId(sportId),
            participants,
            gameId,
            new Date(matchup.startTime)
          );

          bookEvents.push(new BookEvent(
            this.createOdds(marketArray[matchup.id], gameId, matchup.startTime, participants),
            bettingEvent
          ));
        }
      });
      return bookEvents;
    });
  }

  async getGameTree(){
    let allBookEvents:BookEvent[] = [];
    let sportCalls = [
      this.loadSport(3),
      this.loadSport(4)
    ];
    return await Promise.all(sportCalls).then( sportTrees => {
      sportTrees.forEach( st => {
        Array.prototype.push.apply(allBookEvents, st);
      });
      return allBookEvents;
    })
  }

  //for type 'game' games id will be of format 'game|league|homeName|awayName|YYYYMMDD'
  getGameId(league:string, homeName:string, awayName:string, dateString:string){
    return 'game|'+league+'|'+homeName+'|'+awayName+'|'+this.getDateString(dateString)
  }

  getDateString(s:string){
    let d = new Date(s);
    return d.getFullYear().toString()+('0'+(d.getMonth()+1)).slice(-2)+('0'+d.getDate()).slice(-2);
  }

  getSportEnumFromPinnacleSportId(sportId: number){
    if(sportId === 3){
      return SportEnum.Baseball;
    }else if(sportId === 4){
      return SportEnum.Basketball;
    }else{
      return SportEnum.Other;
    }
  }

  createOdds(markets:any, gameId: string, dateString:string, betParticipants:Participant[]){
    let bookBets:BookBet[] = [];
    let book = BookManager.getInstance().getBookById(1003);
    markets.forEach( (market:any) => {
      let home = market.prices.find((p:any)=>p.designation === 'home');
      let away = market.prices.find((p:any)=>p.designation === 'away');
      let over = market.prices.find((p:any)=>p.designation === 'over');
      let under = market.prices.find((p:any)=>p.designation === 'under');

      let mlBetFactors: BetFactor[] = [];
      let sBetFactors: BetFactor[] = [];
      let ouBetFactors: BetFactor[] = [];
      let tthBetFactors: BetFactor[] = [];
      let ttaBetFactors: BetFactor[] = [];

      /*let betParticipants: Participant[] = [];

      market.prices.map((p:any, i:number) => {
        betParticipants.push(new Participant(i, p.name));
      })*/

      if(home && away){
        this.setBetFactor(home.price, mlBetFactors, BetFactorTypeEnum.Home, book);
        this.setBetFactor(away.price, mlBetFactors, BetFactorTypeEnum.Away, book);
        //this.setBetFactor('draw', odd, mlBetFactors, BetFactorTypeEnum.Draw, book);

        this.setBetFactor(home.price, sBetFactors, BetFactorTypeEnum.Home, book);
        this.setBetFactor(away.price, sBetFactors, BetFactorTypeEnum.Away, book);
      }

      if(over && under){
        this.setBetFactor(over.price, ouBetFactors, BetFactorTypeEnum.Over, book);
        this.setBetFactor(under.price, ouBetFactors, BetFactorTypeEnum.Under, book);

        this.setBetFactor(over.price, tthBetFactors, BetFactorTypeEnum.Over, book);
        this.setBetFactor(under.price, tthBetFactors, BetFactorTypeEnum.Under, book);

        this.setBetFactor(over.price, ttaBetFactors, BetFactorTypeEnum.Over, book);
        this.setBetFactor(under.price, ttaBetFactors, BetFactorTypeEnum.Under, book);
      }

      if(market.type === 'moneyline' && mlBetFactors.length > 0){
        bookBets.push(new BookBet(
          gameId,
          BetTypeEnum.MoneyLine,
          PlayerPropTypeEnum.NonApplicable,
          market.period,
          0,
          mlBetFactors,
          betParticipants,
          new Date(dateString),
          book
        ))
      }
      if(market.type === 'spread'  && sBetFactors.length > 0){
        bookBets.push(new BookBet(
          gameId,
          BetTypeEnum.Spread,
          PlayerPropTypeEnum.NonApplicable,
          market.period,
          home.points,
          sBetFactors,
          betParticipants,
          new Date(dateString),
          book
        ));
      }
      if(market.type === 'total' && ouBetFactors.length > 0){
        bookBets.push(new BookBet(
          gameId,
          BetTypeEnum.OverUnder,
          PlayerPropTypeEnum.NonApplicable,
          market.period,
          Math.max(over.points, under.points),
          ouBetFactors,
          betParticipants,
          new Date(dateString),
          book
        ));
      }
      if(market.type === 'team_total' && market.side === 'home'  && tthBetFactors.length > 0){
        bookBets.push(new BookBet(
          gameId,
          BetTypeEnum.TeamTotalHome,
          PlayerPropTypeEnum.NonApplicable,
          market.period,
          Math.max(over.points, under.points),
          tthBetFactors,
          betParticipants,
          new Date(dateString),
          book
        ));
      }
      if(market.type === 'team_total' && market.side === 'away' && ttaBetFactors.length > 0){
        bookBets.push(new BookBet(
          gameId,
          BetTypeEnum.TeamTotalAway,
          PlayerPropTypeEnum.NonApplicable,
          market.period,
          Math.max(over.points, under.points),
          ttaBetFactors,
          betParticipants,
          new Date(dateString),
          book
        ));
      }
    });
    return bookBets;
  }

  setBetFactor(price:number, bf:BetFactor[], bft:BetFactorTypeEnum, book:Book){
    if(price){
      bf.push(new BetFactor(
        bft,
        new Factor(this.getDecimialFromAmerican(price), price, book)
      ));
    }
  }

  getDecimialFromAmerican(ml:number){
		let f;
		if(ml > 0){
			f = Math.round((1 + (ml/100))*100)/100;
		}else{
			f = Math.round((1 + (-100/ml))*100)/100;
		}
		return f;
	}
}
