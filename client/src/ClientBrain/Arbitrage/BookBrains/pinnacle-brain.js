import ArbitrageService from '../../../Shared/arbitrage-service';
import BookManager from '../book-manager';
import Game from '../Models/game';
import Odd from '../Models/odd';

export default class PinnacleBrain {
  constructor(){
    this.matchups = [];
    this.markets = [];

  }
  async loadSport(sport){
    let reqs = [
      ArbitrageService.getPinnacleMarkets(sport),
      ArbitrageService.getPinnacleMatchUps(sport)
    ]
    return await Promise.all(reqs).then((values)=>{
      let matchups = values[1];
      let markets = values[0];
      let games = [];
      let marketArray = {};

      markets.forEach( market => {
        if(market.matchupId.toString() && Object.keys(marketArray).includes(market.matchupId.toString())){
          marketArray[market.matchupId.toString()].push(market);
        }else{
          marketArray[market.matchupId.toString()] = [market];
        }
      })

      matchups.forEach( matchup => {
        let homeName = matchup.participants.find(p => p.alignment === 'home').name;
        let awayName = matchup.participants.find(p => p.alignment === 'away').name;
        if(marketArray[matchup.id] && !matchup.isLive){
          games.push(new Game(
            this.createOdds(marketArray[matchup.id]), matchup.league.name.toLowerCase(), homeName, awayName, this.getGameId(matchup.league.name.toLowerCase(), homeName, awayName, matchup.startTime)
          ));
        }
      });
      return games
    });
  }

  async getGameTree(){
    let allGames = [];
    let sportCalls = [
      this.loadSport(3),
      this.loadSport(4)
    ];
    return await Promise.all(sportCalls).then( sportTrees => {
      sportTrees.forEach( st => {
        Array.prototype.push.apply(allGames, st);
      });
      return allGames;
    })
  }

  //for type 'game' games id will be of format 'game|league|homeName|awayName|YYYYMMDD'
  getGameId(league, homeName, awayName, dateString){
    return 'game|'+league+'|'+homeName+'|'+awayName+'|'+this.getDateString(dateString)
  }

  getDateString(s){
    let d = new Date(s);
    return d.getFullYear().toString()+('0'+(d.getMonth()+1)).slice(-2)+('0'+d.getDate()).slice(-2);
  }

  createOdds(markets){
    let odds = [];
    let book = BookManager.getInstance().getBookById(1003);
    markets.forEach( market => {
      let home = market.prices.find(p=>p.designation === 'home');
      let away = market.prices.find(p=>p.designation === 'away');
      let over = market.prices.find(p=>p.designation === 'over');
      let under = market.prices.find(p=>p.designation === 'under');

      if(market.type === 'moneyline'){
        odds.push(new Odd(book,
          (market.period > 0 ? market.period: 'game'),
          home.price,
          away.price,
          null, null, null, null, null, null, null, null, null, null, null, null, null
        ));
      }
      if(market.type === 'spread'){
        odds.push(new Odd(book,
          (market.period > 0 ? market.period: 'game'),
          null, null, null,
          home.price,
          away.price,
          null, null,
          home.points, //spread always based on home
          null, null, null, null, null, null, null
        ));
      }
      if(market.type === 'total'){
        odds.push(new Odd(book,
          (market.period > 0 ? market.period: 'game'),
          null, null, null, null, null,
          over.price,
          under.price,
          null,
          Math.max(over.points, under.points),
          null, null, null, null, null, null
        ));
      }
      if(market.type === 'team_total' && market.side === 'home'){
        odds.push(new Odd(book,
          (market.period > 0 ? market.period: 'game'),
          null, null, null, null, null, null, null, null, null,
          over.price,
          under.price,
          Math.max(over.points, under.points),
          null, null, null
        ));
      }
      if(market.type === 'team_total' && market.side === 'away'){
        odds.push(new Odd(book,
          (market.period > 0 ? market.period: 'game'),
          null, null, null, null, null, null, null, null, null, null, null, null,
          over.price,
          under.price,
          Math.max(over.points, under.points)
        ));
      }
    });
    return odds;
  }
}
