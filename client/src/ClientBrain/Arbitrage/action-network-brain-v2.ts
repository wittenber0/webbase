import ArbitrageService from '../../Shared/arbitrage-service';
import BookManager from './book-manager';
import BookBet from './Models/v2/BookBet';
import BookEvent from './Models/v2/BookEvent';
import { BetTypeEnum } from './Models/v2/enum/BetTypeEnum';
import BetFactor from './Models/v2/BetFactor';
import Factor from './Models/v2/Factor';
import { BetFactorTypeEnum } from './Models/v2/enum/BetFactorTypeEnum';
import Participant from './Models/v2/Participant';
import Book from './Models/v2/Book';
import { SportEnum } from './Models/v2/enum/SportEnum';
import { PlayerPropTypeEnum } from './Models/v2/enum/PlayerPropTypeEnum';
import BettingEvent from './Models/v2/BettingEvent';
import { BetDuration } from './Models/v2/enum/BetDuration';

export default class ActionNetworkBrain {
  bookEventTree: BookEvent[];

  constructor(){
    this.bookEventTree = [];
  }

  async getGameTree(){
    let d = new Date();
    let bm = BookManager.getInstance();
    this.getAllPlayerPropBookBets();
		return await ArbitrageService.getAllOddsForDate(d, bm.getSelectedBookIds()).then((r)=>{
		    r["all_games"].forEach( (league:any) => {
          league['games'].forEach( (game:any) => {

            let odds = game['odds'];
            if(odds && game['status'] !== 'complete'){

              let participants: Participant[] = [];

              let bookBets: BookBet[] = [];
              let home = game['teams'].find((e:any) => e.id === game['home_team_id']);
              let away = game['teams'].find((e:any) => e.id === game['away_team_id'])

              let homeName = home['full_name'];
              let awayName = away['full_name'];

              //order here matters
              participants.push(new Participant('home', homeName));
              participants.push(new Participant('away', awayName));

              let bettingEvent = new BettingEvent(
                league['league_name'],
                this.getSport(league['league_name']),
                participants,
                this.getGameId(homeName, awayName, league['league_name'], new Date(game['start_time'])),
                new Date(game['start_time'])
              );
              
              odds.forEach( (odd:any) => {
                let book = bm.getBookById(odd['book_id'])
                let bookName = book?.BookName;
                if(book !== undefined && bookName !== 'Open' && bookName !== 'Consensus'){
                  let mlBetFactors: BetFactor[] = [];
                  let sBetFactors: BetFactor[] = [];
                  let ouBetFactors: BetFactor[] = [];
                  let tthBetFactors: BetFactor[] = [];
                  let ttaBetFactors: BetFactor[] = [];

                  this.setBetFactor('ml_home', odd, mlBetFactors, BetFactorTypeEnum.Home, book);
                  this.setBetFactor('ml_away', odd, mlBetFactors, BetFactorTypeEnum.Away, book);
                  this.setBetFactor('draw', odd, mlBetFactors, BetFactorTypeEnum.Draw, book);

                  this.setBetFactor('spread_home_line', odd, sBetFactors, BetFactorTypeEnum.Home, book);
                  this.setBetFactor('spread_away_line', odd, sBetFactors, BetFactorTypeEnum.Away, book);

                  this.setBetFactor('over', odd, ouBetFactors, BetFactorTypeEnum.Over, book);
                  this.setBetFactor('under', odd, ouBetFactors, BetFactorTypeEnum.Under, book);

                  this.setBetFactor('home_over', odd, tthBetFactors, BetFactorTypeEnum.Over, book);
                  this.setBetFactor('home_under', odd, tthBetFactors, BetFactorTypeEnum.Under, book);

                  this.setBetFactor('away_over', odd, ttaBetFactors, BetFactorTypeEnum.Over, book);
                  this.setBetFactor('away_under', odd, ttaBetFactors, BetFactorTypeEnum.Under, book);
                  
                  if(mlBetFactors.length > 0){
                    let mlbb = new BookBet(
                      this.getGameId(homeName, awayName, league['league_name'], d),
                      BetTypeEnum.MoneyLine,
                      PlayerPropTypeEnum.NonApplicable,
                      this.getBetDuration(odd['type']),
                      0,
                      mlBetFactors,
                      participants,
                      new Date(game['start_time']),
                      book
                    )
                    bookBets.push(mlbb);
                  }

                  if(sBetFactors.length > 0){
                    let sbb = new BookBet(
                      this.getGameId(homeName, awayName, league['league_name'], d),
                      BetTypeEnum.Spread,
                      PlayerPropTypeEnum.NonApplicable,
                      this.getBetDuration(odd['type']),
                      odd['spread_home'],
                      sBetFactors,
                      participants,
                      new Date(game['start_time']),
                      book
                    );
                    bookBets.push(sbb);
                  }

                  if(ouBetFactors.length > 0){
                    let oubb = new BookBet(
                      this.getGameId(homeName, awayName, league['league_name'], d),
                      BetTypeEnum.OverUnder,
                      PlayerPropTypeEnum.NonApplicable,
                      this.getBetDuration(odd['type']),
                      odd['total'],
                      ouBetFactors,
                      participants,
                      new Date(game['start_time']),
                      book
                    );
                    bookBets.push(oubb);
                  }

                  if(tthBetFactors.length > 0){
                    let tthbb = new BookBet(
                      this.getGameId(homeName, awayName, league['league_name'], d),
                      BetTypeEnum.TeamTotalHome,
                      PlayerPropTypeEnum.NonApplicable,
                      this.getBetDuration(odd['type']),
                      odd['home_total'],
                      tthBetFactors,
                      participants,
                      new Date(game['start_time']),
                      book
                    );
                    bookBets.push(tthbb);
                  }

                  if(ttaBetFactors.length > 0){
                    let ttabb = new BookBet(
                      this.getGameId(homeName, awayName, league['league_name'], d),
                      BetTypeEnum.TeamTotalAway,
                      PlayerPropTypeEnum.NonApplicable,
                      this.getBetDuration(odd['type']),
                      odd['away_total'],
                      ttaBetFactors,
                      participants,
                      new Date(game['start_time']),
                      book
                    );
                    bookBets.push(ttabb);
                  }
                }
              });
              
              let bookEvent = new BookEvent(
                bookBets,
                bettingEvent
              );

              this.bookEventTree.push(bookEvent);
            }
          });
        });
        return(this.bookEventTree);
		});
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

  //for type 'game' games id will be of format 'game|leagueName|homeName|awayName|YYYYMMDD'
  getGameId(homeName:string, awayName:string, leagueName:string, date:Date){
    return 'game|'+leagueName+'|'+homeName+'|'+awayName+'|'+this.getDateString(date)
  }

  getDateString(d:Date){
    return d.getFullYear().toString()+('0'+(d.getMonth()+1)).slice(-2)+('0'+d.getDate()).slice(-2);
  }

  getBetType(bt:string){
    if(bt === 'ml'){
      return BetTypeEnum.MoneyLine
    }
    if(bt === 'spread'){
      return BetTypeEnum.Spread
    }
    return 
  }

  setBetFactor(anLabel:string, anOdd:any, bf:BetFactor[], bft: BetFactorTypeEnum, book:Book){
    if(anOdd[anLabel]){
      bf.push(new BetFactor(
        bft,
        new Factor(this.getDecimialFromAmerican(anOdd[anLabel]), anOdd[anLabel], book)
      ));
    }
  }

  getSport(league:string){
    if(league === 'nba'){
      return SportEnum.Basketball
    }
    if(league === 'soccer'){
      return SportEnum.Soccer
    }
    if(league === 'mlb'){
      return SportEnum.Baseball
    }
    if(league === 'nhl'){
      return SportEnum.Hockey
    }
    return SportEnum.Other
  }

  getBetDuration(durationString:string){
    if(durationString === 'game'){
      return BetDuration.Game
    }else if(durationString === 'firsthalf'){
      return BetDuration.FirstPeriod;
    }else if(durationString === 'secondhalf'){
      return BetDuration.SecondPeriod;
    }else if(durationString === 'firstperiod'){
      return BetDuration.FirstPeriod;
    }else if(durationString === 'secondperiod'){
      return BetDuration.SecondPeriod;
    }else{
      return BetDuration.FourthPeriod;
    }
    
  }

  getAllPlayerPropBookBets(){
    let reqs = [ArbitrageService.getActionLabsPlayers(), ArbitrageService.getActionLabsPropEvents()]

    BookManager.getInstance().getSelectedBookIds().filter(b=>b<1000).forEach(b => {
      reqs.push(ArbitrageService.getActionLabsPropOdds(b));
    });

    return Promise.all(reqs).then((values:any)=> {
      let events:any;
      let players:any;
      values.forEach((v:any, i:number) => {
        console.log(v);
        if(i === 0){
          players = v;
        }else if(i === 1){
          events = v.events;
        }else{
          this.getPPBets(v, events, players)
        }
      })
    });
  }

  getPPBets(bets:any, events:any, players:any){
    console.log('getppbets');
    console.log(players);
    console.log(events);
    console.log(bets);
    if(bets){
      bets.forEach((b:any) => {
        //let gameEvent = events.find((e:any)=>e.event_id === b.eventId);
        let betLine:number;
        //let bettingEvent:BettingEvent = this.getPPBettingEvent(gameEvent);
        if(b.eventId === 5303020){
          Object.keys(events).forEach(e => {
            if(e === '5303020'){
              let ev = events[e];
              let ps = Object.keys(players).filter(p=>p.includes(b.eventId));
              //console.log('my event');
              //console.log([ev,ps, b]);
            }
          })
        }
  
        Object.keys(b.lines).forEach((lineKey:any) => {
          let line = b.lines[lineKey];
          let participantId:any;
          let pickType:any;
  
          betLine = line.line;



          
  
          if(b.eventId){
            if(lineKey.indexOf(':') >= 0){
              let lkArray = lineKey.split(':');
              let playerKey = lkArray[0] + '|'+b.eventId;
              b.player = players[playerKey];
              if(b.player){
                console.log(b);
              }
            }
            
          }
  
          if(lineKey.includes(':')){
            let lkArray = lineKey.split(':');
            participantId = lkArray[0];
            pickType = lkArray[1];
          }else{
            pickType = lineKey;
            //this is a pick for an event but not a player i believe... no player id
          }
        });
  
        /*let bb = new BookBet(
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
        );*/
      })
    }
  }

  getPPBettingEvent(gameEvent:any){
    let e:BettingEvent;

    //return e;
  }
}
