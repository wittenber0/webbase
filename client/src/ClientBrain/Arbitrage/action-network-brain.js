import ArbitrageService from '../../Shared/arbitrage-service';
import GameOdd from './Models/game-odd';
import Odd from './Models/odd';
import Game from './Models/game';
import Factor from './Models/factor';
import BookManager from './book-manager';
import GameOddManager from './game-odd-manager';

export default class ActionNetworkBrain {

  constructor(betTypeFilter){
    this.betTypeFilter = betTypeFilter;
    this.gameOddManager = GameOddManager.getInstance();
    this.gameTree = [];
  }

  async getGameTree(betTypeFilter, bm){
    return new Promise((resolve, reject) => {
      this.getMainlineTree(betTypeFilter, bm).then((gt) => {
        this.getPropsForGameTree(gt, bm).then(() => {
          resolve(gt)
        });
      });
    });
  }

  async getMainlineTree(betTypeFilter, bm){
    this.betTypeFilter = betTypeFilter;
    let d = new Date();

		return await ArbitrageService.getAllOddsForDate(d, bm.getSelectedBookIds()).then((r)=>{
		    r["all_games"].forEach( league => {
          league['games'].forEach( game => {
            let cleanOdds = [];
            let odds = game['odds'];
            if(odds && game['status'] !== 'inprogress' && game['status'] !== 'complete'){
              odds.forEach( odd => {
                let bookName = bm.getBookById(odd['book_id']).bookName;
                if(bookName !== 'Open' && bookName !== 'Consensus' && odd['type'] !== "live"){
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
                    odd['spread_home'], //spread based on home team
                    odd['total'],
                    odd['home_over'],
                    odd['home_under'],
                    odd['home_total'],
                    odd['away_over'],
                    odd['away_under'],
                    odd['away_total'],
                    odd,
                    game
                  );

                  cleanOdds.push(o);
                }
              });
              let homeName = game['teams'].find(e => e.id === game['home_team_id'])['full_name'];
              let awayName = game['teams'].find(e => e.id === game['away_team_id'])['full_name'];
              let g = new Game(cleanOdds, league['league_name'], homeName, awayName, this.getGameId(homeName, awayName, league['league_name'], new Date(game['start_time'])), game['id']);
              this.gameTree.push(g);
            }
          });
        });
        return(this.gameTree);
		});
  }

  async getPropsForGameTree(gameTree, bm){
    let propPromisses = [];
    gameTree.forEach(g => {
      g.playerPropGameOdds = [];
      propPromisses.push(ArbitrageService.getPlayerPropsForGame(g.actionGameId));
    })

    //let gTest = gameTree[5];
    //gTest.playerPropGameOdds = [];
    //console.log(gTest.actionGameId);
    //propPromisses.push(ArbitrageService.getPlayerPropsForGame(gTest.actionGameId));

    return await Promise.all(propPromisses).then((responseArray) => {
      responseArray.forEach((r, i) => {
        Object.keys(r['player_props']).forEach( propTypeKey => {
          let propType = r['player_props'][propTypeKey];
          propType.forEach( playerProp => {
            this.getPlayerPropGameOdds(playerProp, gameTree[i], bm);
          });
        });
      });
    });
  }

  getPlayerPropGameOdds(playerProp, game, bm){
    let valuePickFactors = {}

    if(!playerProp['custom_pick_type_options'] || !playerProp['odds']){
      return;
    }

    Object.keys(playerProp['custom_pick_type_options']).forEach( pickOptionKey => {
      Object.keys(playerProp['odds']).forEach( oddBook => {
        oddBook = parseInt(oddBook);
        playerProp['odds'][oddBook].forEach( propOdd => {
          if(propOdd['option_type_id'].toString() === pickOptionKey && oddBook !== 15 && bm.getPPBookList().includes(oddBook)){
            let pickOptionLabel = playerProp["custom_pick_type_options"][pickOptionKey]["option_type"];
            
            if(!valuePickFactors[propOdd['value']]){
              valuePickFactors[propOdd['value']] = {}
            }

            if(!valuePickFactors[propOdd['value']][pickOptionLabel]){
              valuePickFactors[propOdd['value']][pickOptionLabel] = []
            }

            let propFactor = new Factor(this.getFactorValue(propOdd['money']), bm.getBookById(oddBook), propOdd['money']);
            
            valuePickFactors[propOdd['value']][pickOptionLabel].push(propFactor)
          }
        });
      })
    });
    if(Object.keys(valuePickFactors).length > 1){
      Object.keys(valuePickFactors).forEach(v => {
        let pickLine = parseFloat(v);
  
        let propGameOdd = new GameOdd(
          game,
          playerProp['period_type'],
          "pp",
          pickLine,
          valuePickFactors[v]
        );
  
        propGameOdd.playerPropLabel = this.getPlayerPropLabel(playerProp, pickLine)
  
        game.playerPropGameOdds.push(propGameOdd);
      });
    }
    
  }

  getPlayerPropLabel(playerProp, pickLine){
    let ppLabel = playerProp["custom_pick_type_display_name"];

    if(ppLabel.includes("{optionTypeAbbr}")){
      ppLabel = ppLabel.replace("{optionTypeAbbr}", ": ");
    }

    if(ppLabel.includes("{value}")){
      ppLabel = ppLabel.replace("{value}", pickLine);
    }
    return ppLabel;
  }

  getFactorValue(ml){
		let f;
		if(ml > 0){
			f = Math.round((1 + (ml/100))*100)/100;
		}else{
			f = Math.round((1 + (-100/ml))*100)/100;
		}
		return f;
	}

  //for type 'game' games id will be of format 'game|leagueName|homeName|awayName|YYYYMMDD'
  getGameId(homeName, awayName, leagueName, dateString){
    return 'game|'+leagueName+'|'+homeName+'|'+awayName+'|'+this.getDateString(dateString)
  }

  getDateString(d){
    return d.getFullYear().toString()+('0'+(d.getMonth()+1)).slice(-2)+('0'+d.getDate()).slice(-2)+('0'+d.getHours()).slice(-2);
  }
}
