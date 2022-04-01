import ArbitrageService from '../../Shared/arbitrage-service';
import GameOdd from './game-odd';
import Factor from './factor';
import BookManager from './book-manager';

export default class ActionNetworkBrain {

  constructor(houseLineThreshold, betTypeFilter, books){
    this.houseLineThreshold = houseLineThreshold;
    this.betTypeFilter = betTypeFilter;
    this.books = books;
  }

  async getGameOdds(houseLineThreshold, betTypeFilter, books){
    this.houseLineThreshold = houseLineThreshold;
    this.betTypeFilter = betTypeFilter;
    this.books = books;
		return await ArbitrageService.getAllOddsForDate(new Date(), BookManager.getSelectedBooks()).then((r)=>{
			let allGames = r["all_games"];
			let gameOdds = [];
		  for(let i = 0; i< allGames.length; i++){
		    this.evaluateLeague(allGames[i], gameOdds);
		  }
		  this.sortGameOdds(gameOdds);
			return gameOdds;
		});
	}

  getDisplayOdds(gameOdds){
    return gameOdds.filter(o => {
      if(this.betTypeFilter !== 'all' && this.betTypeFilter !== o.betType){
        return false;
      }
      return o.houseLine < this.houseLineThreshold;
    });
  }

  evaluateLeague(league, gameOdds){
	  var games = league['games'];
	  for(var i = 0; i<games.length; i++){
      games[i].leagueName = league['league_name'];
	    this.evaluateGame(games[i], gameOdds);
	  }
	}

	evaluateGame(game, gameOdds){
	  var odds = game['odds'];
	  if(odds){
	    for(var i = 0; i<odds.length; i++){
	      this.evaluateOdds(odds[i], game, gameOdds);
	    }
	  }
	}

	evaluateOdds(odds, game, gameOdds){
	  var bookId = odds['book_id'];
	  var status = game['status'];
	  var book = this.books.find(e => e.id === bookId);
	  var bookName = book['display_name'];
		var bookLogo = (book['meta']['logos'] ? book['meta']['logos']['primary'] : null);
	  var type = odds['type'];
		this.evaluateMoneyLine(bookId, status, book, bookName, bookLogo, type, odds, game, gameOdds);
		this.evaluateSpread(bookId, status, book, bookName, bookLogo, type, odds, game, gameOdds);
		this.evaluateTotalOverUnder(bookId, status, book, bookName, bookLogo, type, odds, game, gameOdds);
	}

  createPickFactors(pickFactorArray, bookName, bookId, bookLogo,){
    let pf = {};
    pickFactorArray.forEach((p, i)=>{
      let nf = new Factor(p.factor, bookName, bookId, bookLogo, p.ml);
      if(pf[p.label]){
        pf[i].push(nf)
      }else{
        pf[p.label] = [nf]
      }
    });
    return pf;
  }

  evaluatePickFactors(book, type, odds, game, gameOdds, pickOptions, betType){
    let bookId = odds['book_id'];
    let bookName = book['display_name'];
		let bookLogo = (book['meta']['logos'] ? book['meta']['logos']['primary'] : null);
    let pickFactorArray = [];
    let line = game.line;

    pickOptions.forEach((po, i)=>{
      if(po.ml && po.ml !== 0){
        po.factor = this.getFactorValue(po.ml);
        pickFactorArray.push(po);
      }
    });

    if(gameOdds.length > 0){
      var go = gameOdds.find(e => (e.gameId === game['id']) && (e.type === type) && (e.line === line) && (e.betType === betType));
      if(go){
        pickFactorArray.forEach((pf, i)=>{
          let nf = new Factor(pf.factor, bookName, bookId, bookLogo, pf.ml);
          if(go.pickFactors[pf.label]){
            go.pickFactors[pf.label].push(nf)
          }else{
            go.pickFactors[pf.label] = [nf]
          }
        });

      }else{
        gameOdds.push(new GameOdd(game, type, betType, line, this.createPickFactors(pickFactorArray, bookName, bookId, bookLogo)));
      }
    }else{
      gameOdds.push(new GameOdd(game, type, betType, line, this.createPickFactors(pickFactorArray, bookName, bookId, bookLogo)));
    }

  }

	evaluateMoneyLine(bookId, status, book, bookName, bookLogo, type, odds, game, gameOdds){
		let betType = 'money-line';
		let mlHome = odds['ml_home'];
	  let mlAway = odds['ml_away'];
	  let mlDraw = odds['draw'];
    let pickOptions = [];
    pickOptions.push({ml: mlHome, label: 'Home'});
    pickOptions.push({ml: mlAway, label: 'Away'});
    pickOptions.push({ml: mlDraw, label: 'Draw'});
    game.line = 0;

		//evaluate money line
	  if(mlHome && mlAway && bookName !== 'Open' && bookName !== 'Consensus' && status !== 'complete'){
      this.evaluatePickFactors(book, type, odds, game, gameOdds, pickOptions, betType);
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

	evaluateSpread(bookId, status, book, bookName, bookLogo, type, odds, game, gameOdds){
		let betType = 'spread';
	  let spreadHomeLine= odds['spread_home_line'];
	  let spreadAwayLine = odds['spread_away_line'];
	  let mlDraw = odds['draw'];
    let pickOptions = [];
    game.line = Math.max(odds['spread_home'], odds['spread_away']);
    pickOptions.push({ml: spreadHomeLine, label: 'Home'});
    pickOptions.push({ml: spreadAwayLine, label: 'Away'});
    pickOptions.push({ml: mlDraw, label: 'Draw'});

	  //evaluate spread
	  if(game.line && spreadHomeLine && spreadAwayLine && bookName != 'Open' && bookName != 'Consensus' && status != 'complete'){
      this.evaluatePickFactors(book, type, odds, game, gameOdds, pickOptions, betType);
	  }
	}

	evaluateTotalOverUnder(bookId, status, book, bookName, bookLogo, type, odds, game, gameOdds){
		let overML = odds['over'];
		let underML = odds['under'];
		let betType = 'over-under-total';
    let pickOptions = [];
    game.line = odds['total'];
    pickOptions.push({ml: overML, label: 'Over'});
    pickOptions.push({ml: underML, label: 'Under'});

		if(overML && underML && bookName !== 'Open' && bookName !== 'Consensus' && status !== 'complete'){
			this.evaluatePickFactors(book, type, odds, game, gameOdds, pickOptions, betType);
    }
	}

  sortGameOdds(gameOdds){
    gameOdds.forEach(game => {
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
    gameOdds.sort((a,b)=>{ return a.houseLine - b.houseLine; });
	}
}
