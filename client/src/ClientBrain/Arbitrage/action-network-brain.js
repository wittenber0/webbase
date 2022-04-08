import ArbitrageService from '../../Shared/arbitrage-service';
import GameOdd from './Models/game-odd';
import Odd from './Models/odd';
import Game from './Models/game';
import Factor from './Models/factor';
import BookManager from './book-manager';
import GameOddManager from './game-odd-manager';

export default class ActionNetworkBrain {

  constructor(houseLineThreshold, betTypeFilter){
    this.houseLineThreshold = houseLineThreshold;
    this.betTypeFilter = betTypeFilter;
    this.gameOddManager = GameOddManager.getInstance();
    this.gameTree = [];
  }

  async getGameTree(houseLineThreshold, betTypeFilter, bm){
    this.houseLineThreshold = houseLineThreshold;
    this.betTypeFilter = betTypeFilter;
    let d = new Date();

		return await ArbitrageService.getAllOddsForDate(d, bm.getSelectedBookIds()).then((r)=>{
		    r["all_games"].forEach( league => {
          league['games'].forEach( game => {
            let cleanOdds = [];
            let odds = game['odds'];
            if(odds && game['status'] !== 'complete'){
              odds.forEach( odd => {
                let bookName = bm.getBookById(odd['book_id']).bookName;
                if(bookName !== 'Open' && bookName !== 'Consensus'){
                  let o = new Odd(
                    bm.getBookById(odd['book_id']),
                    odd['type'],
                    odd['ml_home'],
                    odd['ml_away'],
                    odd['draw'],
                    odd['spread_home_line'],
                    odd['spread_away_line'],
                    odd['over'],
                    odd['under'],
                    Math.max(odd['spread_home'], odd['spread_away']),
                    odd['total'],
                    odd['home_over'],
                    odd['home_under'],
                    odd['home_total'],
                    odd['away_over'],
                    odd['away_under'],
                    odd['away_total']
                  );
                  cleanOdds.push(o);
                }
              });
              let homeName = game['teams'].find(e => e.id === game['home_team_id'])['full_name'];
              let awayName = game['teams'].find(e => e.id === game['away_team_id'])['full_name'];
              let g = new Game(cleanOdds, league['league_name'], homeName, awayName, this.getGameId(homeName, awayName, league['league_name'], d));
              this.gameTree.push(g);
            }
          });
        });
        return(this.gameTree);
		});
  }

  //for type 'game' games id will be of format 'game|leagueName|homeName|awayName|YYYYMMDD'
  getGameId(homeName, awayName, leagueName, dateString){
    return 'game|'+leagueName+'|'+homeName+'|'+awayName+'|'+this.getDateString(dateString)
  }

  getDateString(d){
    return d.getFullYear().toString()+('0'+(d.getMonth()+1)).slice(-2)+('0'+d.getDate()).slice(-2);
  }
}
