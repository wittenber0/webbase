import GameOdd from './Models/game-odd';
import Odd from './Models/odd';
import Game from './Models/game';
import Factor from './Models/factor';
import BookManager from './book-manager';
import ActionNetworkBrain from './action-network-brain';
import BetOnlineBrain from './BookBrains/bet-online-brain';
import PinnacleBrain from './BookBrains/pinnacle-brain';

class GameOddManager {
  gameOdds;
  games;

  constructor(){
    this.gameOdds = [];
    this.games = [];
  }

  async loadGameOdds(betTypeFilter, bm, sortBy){
    this.games = [];
    this.gameOdds = [];
    let bookGameTrees = [
      this.loadActionNetworkGameTree(betTypeFilter, bm),
      this.loadBetOnlineGameTree(),
      this.loadPinnacleGameTree()
    ]
    return await Promise.all(bookGameTrees).then( trees => {
      trees.forEach( tree => {
        tree.forEach( game => {
          if(this.games.length > 0){
            let existingGame = this.games.find(g => g.gameId === game.gameId);
            if(existingGame){
              //console.log('matching:'+existingGame.gameId);
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
      this.calculateGameOdds();
      this.gameOdds = this.getGameOddsSortedBy(sortBy)
    });
  }

  async loadActionNetworkGameTree(betTypeFilter, bm){
    this.actionNetworkBrain = new ActionNetworkBrain(betTypeFilter);
    return await this.actionNetworkBrain.getGameTree(betTypeFilter, bm).then( gameTree => {
      return gameTree;
    });
  }

  async loadBetOnlineGameTree(){
    this.betOnlineBrain = new BetOnlineBrain();
    return await this.betOnlineBrain.getGameTreev2().then( gameTree => {
      return gameTree;
    });
  }

  async loadPinnacleGameTree(){
    this.pinnacleBrain = new PinnacleBrain();
    return await this.pinnacleBrain.getGameTree().then( gameTree => {
      return gameTree;
    });
  }

  buildGameOdds(gameTree){
    gameTree.forEach( game => {
      game.odds.forEach( odd => {
        this.evaluateOdd(odd, game);
      });
    });
  }

  evaluateOdd(odd, game){
		this.evaluateMoneyLine(odd, game);
		this.evaluateSpread(odd, game);
		this.evaluateTotalOverUnder(odd, game);
    this.evaluateHomeOverUnder(odd, game);
    this.evaluateAwayOverUnder(odd, game);
	}

  evaluateMoneyLine(odd, game){
		let betType = 'ml';
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
		let betType = 's';
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
		let betType = 'ou';
    let pickOptions = [];
    odd.line = odd.lineOverUnder;
    pickOptions.push({ml: odd.totalOver, label: 'Over'});
    pickOptions.push({ml: odd.totalUnder, label: 'Under'});

		if(odd.line && odd.totalOver && odd.totalUnder){
			this.evaluatePickFactors(odd, game, pickOptions, betType);
    }
	}

  evaluateHomeOverUnder(odd, game){
		let betType = 'tth';
    let pickOptions = [];
    odd.line = odd.homeLine;
    pickOptions.push({ml: odd.homeOver, label: 'Over'});
    pickOptions.push({ml: odd.homeUnder, label: 'Under'});

		if(odd.line && odd.homeOver && odd.homeUnder){
			this.evaluatePickFactors(odd, game, pickOptions, betType);
    }
	}

  evaluateAwayOverUnder(odd, game){
		let betType = 'tta';
    let pickOptions = [];
    odd.line = odd.awayLine;
    pickOptions.push({ml: odd.awayOver, label: 'Over'});
    pickOptions.push({ml: odd.awayUnder, label: 'Under'});

		if(odd.line && odd.awayOver && odd.awayUnder){
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
      var go = this.gameOdds.find(e => (e.gameId === game.gameId) && (e.type === odd.type) && (e.line === line) && (e.betType === betType) && (!e.betType === 'tt' || odd.ttSide === e.ttSide));
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
        let g = new GameOdd(game, odd.type, betType, line, this.createPickFactors(pickFactorArray, odd.book));
        g.debugGame = game;
        this.gameOdds.push(g);
      }
    }else{
      let g = new GameOdd(game, odd.type, betType, line, this.createPickFactors(pickFactorArray, odd.book));
      g.debugGame = game;
      this.gameOdds.push(g);
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

  calculateRealOdds(gameOdd){
    let pTotal = 0;
    let realOdds = {};

    Object.keys(gameOdd.pinnacleFactors).forEach(pf => {
      let f = gameOdd.pinnacleFactors[pf];
      if(f){
        pTotal += 1/f.factor;
      }
    });

    if(pTotal){
      Object.keys(gameOdd.pinnacleFactors).forEach(pf => {
        let f = gameOdd.pinnacleFactors[pf];
        realOdds[pf] = (1/f.factor) / pTotal
      });
    }
    gameOdd.realOdds = realOdds;
  }

  calculateGameOddInfo(gameOdd){
    let houseLine = 0;
    gameOdd.pinnacleFactors = {};
    Object.keys(gameOdd.pickFactors).forEach(pf => {
      if(gameOdd.pickFactors[pf].length > 0){
        gameOdd.pickFactors[pf].sort((a,b)=>{return b.factor-a.factor});
        gameOdd.pickFactors[pf][0].best = true;
        gameOdd.pinnacleFactors[pf] = gameOdd.pickFactors[pf].find(f => f.book.bookId === 1003);
        houseLine += 1/gameOdd.pickFactors[pf][0].factor;
      }
    });
    gameOdd.houseLine = houseLine;
    this.calculateRealOdds(gameOdd);
    this.calculateEVs(gameOdd);
  }

  calculateEVs(gameOdd){
    let pfEV = {}
    Object.keys(gameOdd.pickFactors).forEach(pfLabel => {
      if(gameOdd.realOdds[pfLabel]){
        let factors = gameOdd.pickFactors[pfLabel];
        let bestPFEV;
        factors.forEach(factor => {
          factor.EV = Math.round((factor.factor * gameOdd.realOdds[pfLabel] - 1)*100 / 2 * 100) / 100;
          if(!gameOdd.bestEV){
            gameOdd.bestEV = factor.EV;
          }else if (factor.EV > gameOdd.bestEV){
            gameOdd.bestEV = factor.EV;
          }
          if(!bestPFEV){
            bestPFEV = factor.EV;
          }else if(factor.EV > bestPFEV){
            bestPFEV = factor.EV;
          }
        });
        pfEV[pfLabel] = bestPFEV;
      }
    });
    gameOdd.evs = pfEV;
  }

  calculateGameOdds(){
    this.gameOdds.forEach(gameOdd => {
      this.calculateGameOddInfo(gameOdd);
    });
	}

  getGameOddsSortedBy(sort){
    if(sort === 'ev'){
      return this.gameOdds.filter(g => g.bestEV).sort(this.mySort);
    }
    if(sort === 'arb'){
      return this.gameOdds.sort((a,b) => {return a.houseLine - b.houseLine });
    }
  }

  mySort(a,b){
    return b.bestEV - a.bestEV
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
