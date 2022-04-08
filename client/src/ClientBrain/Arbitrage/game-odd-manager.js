import GameOdd from './Models/game-odd';
import Odd from './Models/odd';
import Game from './Models/game';
import Factor from './Models/factor';
import BookManager from './book-manager';
import ActionNetworkBrain from './action-network-brain';
import BetOnlineBrain from './BookBrains/bet-online-brain';

class GameOddManager {
  gameOdds;
  games;

  constructor(){
    this.gameOdds = [];
    this.games = [];
  }

  async loadGameOdds(houseLineThreshold, betTypeFilter, bm){
    let bookGameTrees = [
      this.loadActionNetworkGameTree(houseLineThreshold, betTypeFilter, bm),
      this.loadBetOnlineGameTree()
    ]
    return await Promise.all(bookGameTrees).then( trees => {
      trees.forEach( tree => {
        tree.forEach( game => {
          if(this.games.length > 0){
            let existingGame = this.games.find(g => g.gameId === game.gameId);
            if(existingGame){
              console.log('matching:'+existingGame.gameId);
              game.odds.forEach(odd => {
                existingGame.odds.push(odd);
              })
            }else{
              this.games.push(game);
            }
          }else{
            this.games.push(game);
          }
        });
      });
      this.buildGameOdds(this.games);
    });
  }

  async loadActionNetworkGameTree(houseLineThreshold, betTypeFilter, bm){
    this.actionNetworkBrain = new ActionNetworkBrain(houseLineThreshold, betTypeFilter);
    return await this.actionNetworkBrain.getGameTree(houseLineThreshold, betTypeFilter, bm).then( gameTree => {
      return gameTree;
    });
  }

  async loadBetOnlineGameTree(){
    this.betOnlineBrain = new BetOnlineBrain();
    return await this.betOnlineBrain.getGameTree().then( gameTree => {
      return gameTree;
    });
  }

  buildGameOdds(gameTree){
    gameTree.forEach( game => {
      game.odds.forEach( odd => {
        this.evaluateOdd(odd, game);
      });
    });
    this.sortGameOdds();
  }

  evaluateOdd(odd, game){
		this.evaluateMoneyLine(odd, game);
		this.evaluateSpread(odd, game);
		this.evaluateTotalOverUnder(odd, game);
	}

  evaluateMoneyLine(odd, game){
		let betType = 'money-line';
    let pickOptions = [];
    pickOptions.push({ml: odd.mlHome, label: 'Home'});
    pickOptions.push({ml: odd.mlAway, label: 'Away'});
    pickOptions.push({ml: odd.mlDraw, label: 'Draw'});
    odd.line = 0;


		//evaluate money line
	  if(odd.mlHome && odd.mlAway){
      this.evaluatePickFactors(odd, game, pickOptions, betType);
	  }
	}

  evaluateSpread(odd, game){
		let betType = 'spread';
    let pickOptions = [];
    odd.line = odd.lineSpread;
    pickOptions.push({ml: odd.spreadHome, label: 'Home'});
    pickOptions.push({ml: odd.spreadAway, label: 'Away'});

	  //evaluate spread
	  if(odd.line && odd.spreadHome && odd.spreadAway){
      this.evaluatePickFactors(odd, game, pickOptions, betType);
	  }
	}

	evaluateTotalOverUnder(odd, game){
		let betType = 'over-under-total';
    let pickOptions = [];
    odd.line = odd.lineOverUnder;
    pickOptions.push({ml: odd.totalOver, label: 'Over'});
    pickOptions.push({ml: odd.totalUnder, label: 'Under'});

		if(odd.line && odd.totalOver && odd.totalUnder){
			this.evaluatePickFactors(odd, game, pickOptions, betType);
    }
	}

  evaluatePickFactors(odd, game, pickOptions, betType){

    let pickFactorArray = [];
    let line = odd.line;

    pickOptions.forEach((po, i)=>{
      if(po.ml && po.ml !== 0){
        po.factor = this.getFactorValue(po.ml);
        pickFactorArray.push(po);
      }
    });

    if(this.gameOdds.length > 0){
      var go = this.gameOdds.find(e => (e.gameId === game.gameId) && (e.type === odd.type) && (e.line === line) && (e.betType === betType));
      if(go){
        pickFactorArray.forEach((pf, i)=>{
          let nf = new Factor(pf.factor, odd.book, pf.ml);
          if(go.pickFactors[pf.label]){
            go.pickFactors[pf.label].push(nf)
          }else{
            go.pickFactors[pf.label] = [nf]
          }
        });

      }else{
        this.gameOdds.push(new GameOdd(game, odd.type, betType, line, this.createPickFactors(pickFactorArray, odd.book)));
      }
    }else{
      this.gameOdds.push(new GameOdd(game, odd.type, betType, line, this.createPickFactors(pickFactorArray, odd.book)));
    }

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

  createPickFactors(pickFactorArray, book){
    let pf = {};
    pickFactorArray.forEach((p, i)=>{
      let nf = new Factor(p.factor, book, p.ml);
      if(pf[p.label]){
        pf[i].push(nf)
      }else{
        pf[p.label] = [nf]
      }
    });
    return pf;
  }

  sortGameOdds(){
    this.gameOdds.forEach(game => {
      let houseLine = 0;
      Object.keys(game.pickFactors).forEach(pf => {
        if(game.pickFactors[pf].length > 0){
  				game.pickFactors[pf].sort((a,b)=>{return b.factor-a.factor});
  				game.pickFactors[pf][0].best = true;
          houseLine += 1/game.pickFactors[pf][0].factor;
  			}
      });
      game.houseLine = houseLine;
    });
    this.gameOdds.sort((a,b)=>{ return a.houseLine - b.houseLine; });
	}


}

var GameOddManagerWrapper = (function () {
    var instance;

    function createInstance() {
        var object = new GameOddManager();
        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

export default GameOddManagerWrapper;
