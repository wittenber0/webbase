
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
  bookEvents:BookEvent[];

  constructor(){
    this.matchups = [];
    this.markets = [];
    this.bookEvents = [];
  }
  async loadSport(sportId:number){
    let reqs = [
      ArbitrageService.getPinnacleMarkets(sportId),
      ArbitrageService.getPinnacleMatchUps(sportId)
    ]
    return await Promise.all(reqs).then( async (values)=>{
      let matchups = values[1];
      let markets = values[0];
      let bookEvents: BookEvent[] = [];
      let marketArray:any = {};

      //matchups = [matchups.find((m:any)=>m.id === 1552304201)];

      let specialBookBets = await this.getSpecialBookBets(matchups, sportId);

      markets.forEach( (market:any) => {
        if(market.matchupId.toString() && Object.keys(marketArray).includes(market.matchupId.toString())){
          marketArray[market.matchupId.toString()].push(market);
        }else{
          marketArray[market.matchupId.toString()] = [market];
        }
      })

      bookEvents = await Promise.all(matchups.map(async (matchup:any) => {
        let homeName = matchup.participants.find((p:any) => p.alignment === 'home').name;
        let awayName = matchup.participants.find((p:any) => p.alignment === 'away').name;
        let participants:Participant[] = [];
        let gameId = this.getGameId(matchup.league.name.toLowerCase(), homeName, awayName, matchup.startTime);

        //order here matters
        participants.push(new Participant('home', homeName));
        participants.push(new Participant('away', awayName));
        
        if(marketArray[matchup.id] && !matchup.isLive && matchup.status !== 'started'){

          let bettingEvent = new BettingEvent(
            matchup.league.name.toLowerCase(),
            this.getSportEnumFromPinnacleSportId(sportId),
            participants,
            gameId,
            new Date(matchup.startTime)
          );
          
          
          let mySpecialBookBets:any = specialBookBets.find((sbb:any) => sbb[0] && sbb[0].GameId === gameId);
          return (new BookEvent(
            mySpecialBookBets,
            bettingEvent
          ));
          
        }
      }));
      return bookEvents.filter((bev:BookEvent) => bev);
    });
  }

  async getSpecialBookBets(matchups:any, sportId:number){

    return await Promise.all(matchups.map((matchup:any)=>{
      let homeName = matchup.participants.find((p:any) => p.alignment === 'home').name;
      let awayName = matchup.participants.find((p:any) => p.alignment === 'away').name;
      let participants:Participant[] = [];
      let gameId = this.getGameId(matchup.league.name.toLowerCase(), homeName, awayName, matchup.startTime);

      //order here matters
      participants.push(new Participant('home', homeName));
      participants.push(new Participant('away', awayName));

      let bettingEvent = new BettingEvent(
        matchup.league.name.toLowerCase(),
        this.getSportEnumFromPinnacleSportId(sportId),
        participants,
        gameId,
        new Date(matchup.startTime)
      );
      
      return this.getMatchupDetails(matchup.id, bettingEvent);
    }));
  }

  async getMatchupDetails(gameId:any, bettingEvent:BettingEvent){
    let bookBets:BookBet[] = [];
    let reqs = [ArbitrageService.getPinnacleLinesByGame(gameId),
      ArbitrageService.getPinnacleRelatedByGame(gameId)];

    return await Promise.all(reqs).then(values => {
      let lines = values[0];
      let related = values[1];
      if(related && related.length > 0){
        related = related.filter((r:any)=>r.status!=='started');

        if(lines){
          lines.forEach( (l:any) => {
            
            let rel = related.find((r:any) => r.id === l.matchupId);
  
            if(rel){
              let participants:Participant[] = this.getBookBetParticipants(rel, l);
              let betFactors:BetFactor[] = this.getBookBetFactors(rel,l);
  
              let startTime = new Date(rel.startTime)
              let betLine = 0;
              let book = BookManager.getInstance().getBookById(1003);
  
              if(l.prices && l.prices[0] && l.prices[0].points){
                betLine = l.prices[0].points;
              }else{
                this.getFromKey(l.key, 'Line');
              }

              if(betFactors){
                let bb = new BookBet(
                  bettingEvent.GameId,
                  this.getFromKey(l.key, 'BetType'),
                  this.getPPType(rel.units),
                  this.getFromKey(l.key, 'Period'),
                  betLine,
                  betFactors,
                  participants,
                  startTime,
                  book,
                  {line: l, related: rel}
                );
    
                bookBets.push(bb);
              }
            }
          });
        }
      }
      return bookBets;
    });
  }

  getBookBetParticipants(rel:any, line:any){
    let participants:Participant[] = [];
    if(rel.participants){
      rel.participants.forEach((p:any) => {
        if(rel.special){
          if(!participants.find((pa:any)=>pa.Name === rel.special.description)){
            participants.push(new Participant(p.name, rel.special.description));
          }
        }else if(p.id){
          if(!participants.find((pa:any)=>pa.Name === p.name)){
            participants.push(new Participant(p.id, p.name));
          }
        }else if(this.getFromKey(line.key, 'BetType') === BetTypeEnum.TeamTotalHome){
          if(p.alignment === 'home'){
            participants.push(new Participant('home', p.name))
          }
        }else if(this.getFromKey(line.key, 'BetType') === BetTypeEnum.TeamTotalAway){
          if(p.alignment === 'away'){
            participants.push(new Participant('away', p.name))
          }
        }else{
          if(!participants.find((pa:any)=>pa.Name === p.name)){
            participants.push(new Participant(p.alignment, p.name));
          }
        }
      });
      
    }else{
      console.log('no participants');
      console.log(rel);
    }
    return participants;
  }

  getBookBetFactors(rel:any, l:any){
    let book = BookManager.getInstance().getBookById(1003);
    let betFactors:BetFactor[] = [];
    l.prices.forEach((lineP:any) => {
      let participant = rel.participants.find((relP:any) => {
        if(lineP.participantId){
          return relP.id === lineP.participantId;
        }
      });

      let participantName:any;
      let factor = new Factor(this.getDecimialFromAmerican(lineP.price), lineP.price, book)
      if(participant){
        participantName = participant.name;
      }else{
        participantName = lineP.designation
      }

      let bf = new BetFactor(this.getBetFactorType(participantName), factor)
      if(bf.Label === BetFactorTypeEnum.NumberRange){
        bf.LabelDetail = participantName;
      }
      if(bf.Label !== BetFactorTypeEnum.NonApplicable){
        betFactors.push(bf);
      }
      
    });

    return betFactors;
  }

  async getGameTree(){
    let allBookEvents:BookEvent[] = [];
    let sportCalls = [
      this.loadSport(3),
      //this.loadSport(4)
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

  getFromKey(key:string, label: string){
    let keys = key.split(';')

    if(label === 'BetType'){
      let k = keys[2];
      if(k === 'ou'){
        return BetTypeEnum.OverUnder
      } else if(k === 's'){
        return BetTypeEnum.Spread
      } else if(k === 'tt'){
        let k2 = keys[4];
        if(k2 === 'away'){
          return BetTypeEnum.TeamTotalAway
        }else {
          return BetTypeEnum.TeamTotalHome
        }
      } else if(k === 'm'){
        return BetTypeEnum.MoneyLine
      } else{
        return BetTypeEnum.All
      }
    }

    if(label === 'Line'){
      if(keys.length >=4){
        let k = keys[3];
        return parseFloat(k);
      }else {
        return 0;
      }
      
    }

    if(label === 'Period'){
      let k = keys[1];
      return parseInt(k);
    } else {
      return 0
    }
    
  }
  
  getPPType(t: string){
    if(t == 'TotalBases'){
      return PlayerPropTypeEnum.TotalBases;
    }
    if(t === 'HomeRuns'){
      return PlayerPropTypeEnum.HomeRuns;
    }
    if(t === 'Hits + Runs + Errors'){
      return PlayerPropTypeEnum.HitsRunsErrors
    }
    if(t === 'Strikeouts'){
      return PlayerPropTypeEnum.Strikeouts
    }
    if(t === 'Hits'){
      return PlayerPropTypeEnum.Hits
    }
    if(t === 'EarnedRuns'){
      return PlayerPropTypeEnum.EarnedRuns
    }

    return PlayerPropTypeEnum.NonApplicable;
  }

  getBetFactorType(t: string){
    if(t === 'home'){
      return BetFactorTypeEnum.Home
    }
    if(t === 'away'){
      return BetFactorTypeEnum.Away
    }
    if(t === 'over'){
      return BetFactorTypeEnum.Over
    }
    if(t === 'under'){
      return BetFactorTypeEnum.Under
    }
    if(t === 'Odd'){
      return BetFactorTypeEnum.Odd
    }
    if(t === 'Even'){
      return BetFactorTypeEnum.Even
    }
    if(this.hasNumber(t)){
      return BetFactorTypeEnum.NumberRange
    }
    

    return BetFactorTypeEnum.NonApplicable
  }

  hasNumber(myString:string) {
    return /\d/.test(myString);
  }
}
