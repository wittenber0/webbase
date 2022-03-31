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

	evaluateMoneyLine(bookId, status, book, bookName, bookLogo, type, odds, game, gameOdds){
		let betType = 'money-line';
		let mlHome = odds['ml_home'];
	  let mlAway = odds['ml_away'];
	  let mlDraw = odds['draw'];

		//evaluate money line
	  if(mlHome && mlAway && bookName !== 'Open' && bookName !== 'Consensus' && status !== 'complete'){
	    var homeFactor = this.getFactorValue(mlHome);
			var awayFactor = this.getFactorValue(mlAway);
			var drawFactor = mlDraw ? this.getFactorValue(mlDraw) : 0;

	    if(gameOdds.length > 0){
	      var go = gameOdds.find(e => (e.gameId === game['id']) && (e.type === type));
	      if(go){
	        go.homeFactors.push(new Factor(homeFactor, bookName, bookId, bookLogo, mlHome));
	        go.awayFactors.push(new Factor(awayFactor, bookName, bookId, bookLogo, mlAway));

	        if(drawFactor > 0){
	          go.drawFactors.push(new Factor(drawFactor, bookName, bookId, bookLogo, mlDraw));
	        }
	      }else{
	        gameOdds.push(new GameOdd(game,
	        [new Factor(homeFactor, bookName, bookId, bookLogo, mlHome)],
	        [new Factor(awayFactor, bookName, bookId, bookLogo, mlAway)],
	        (drawFactor > 0 ? [new Factor(drawFactor, bookName, bookId, bookLogo, mlDraw)] : []),
	        type, betType, null, [], []));
	      }
	    }else{
	      gameOdds.push(new GameOdd(game,
	      [new Factor(homeFactor, bookName, bookId, bookLogo, mlHome)],
	      [new Factor(awayFactor, bookName, bookId, bookLogo, mlAway)],
	      (drawFactor > 0 ? [new Factor(drawFactor, bookName, bookId, bookLogo, mlDraw)] : []),
	      type, betType, null, [], []));
	    }
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
		let line = Math.max(odds['spread_home'], odds['spread_away']);
	  let spreadHomeLine= odds['spread_home_line'];
	  let spreadAwayLine = odds['spread_away_line'];
	  let mlDraw = odds['draw'];

	  //evaluate spread
	  if(line && spreadHomeLine && spreadAwayLine && bookName != 'Open' && bookName != 'Consensus' && status != 'complete'){
	    var homeFactor = this.getFactorValue(spreadHomeLine);
			var awayFactor = this.getFactorValue(spreadAwayLine);
			var drawFactor = mlDraw ? this.getFactorValue(mlDraw) : 0;

			if(gameOdds.length > 0){
	      var go = gameOdds.find(e => (e.gameId === game['id']) && (e.type === type) && (e.line === line) && (e.betType === betType));
	      if(go){
	        go.homeFactors.push(new Factor(homeFactor, bookName, bookId, bookLogo, spreadHomeLine));
	        go.awayFactors.push(new Factor(awayFactor, bookName, bookId, bookLogo, spreadAwayLine));

	        if(drawFactor > 0){
	          go.drawFactors.push(new Factor(drawFactor, bookName, bookId, bookLogo, mlDraw));
	        }
	      }else{
	        gameOdds.push(new GameOdd(game,
	        [new Factor(homeFactor, bookName, bookId, bookLogo, spreadHomeLine)],
	        [new Factor(awayFactor, bookName, bookId, bookLogo, spreadAwayLine)],
	        (drawFactor > 0 ? [new Factor(drawFactor, bookName, bookId, bookLogo, mlDraw)] : []),
	        type, betType, line));
	      }
	    }else{
	      gameOdds.push(new GameOdd(game,
	      [new Factor(homeFactor, bookName, bookId, bookLogo, spreadHomeLine)],
	      [new Factor(awayFactor, bookName, bookId, bookLogo, spreadAwayLine)],
	      (drawFactor > 0 ? [new Factor(drawFactor, bookName, bookId, bookLogo, mlDraw)] : []),
	      type, betType, line));
	    }
	  }
	}

	evaluateTotalOverUnder(bookId, status, book, bookName, bookLogo, type, odds, game, gameOdds){
		let line = odds['total'];
		let overML = odds['over'];
		let underML = odds['under'];
		let betType = 'over-under-total';

		if(overML && underML && bookName !== 'Open' && bookName !== 'Consensus' && status !== 'complete'){
			let overFactor = this.getFactorValue(overML);
			let underFactor = this.getFactorValue(underML);

			if(gameOdds.length > 0){
	      var go = gameOdds.find(e => (e.gameId === game['id']) && (e.type === type) && (e.line === line) && (e.betType === betType));
	      if(go){
	        go.overFactors.push(new Factor(overFactor, bookName, bookId, bookLogo, overML));
	        go.underFactors.push(new Factor(underFactor, bookName, bookId, bookLogo, underML));
	      }else{
	        gameOdds.push(new GameOdd(game,
		        [],
		        [],
		        [],
		        type,
						betType,
						line,
						[new Factor(overFactor, bookName, bookId, bookLogo, overML)],
						[new Factor(underFactor, bookName, bookId, bookLogo, underML)]
					));
	      }
	    }else{
				gameOdds.push(new GameOdd(game,
					[],
					[],
					[],
					type,
					betType,
					line,
					[new Factor(overFactor, bookName, bookId, bookLogo, overML)],
					[new Factor(underFactor, bookName, bookId, bookLogo, underML)]
				));
	    }
		}

	}

	sortGameOdds(gameOdds){
	  for(var i =0; i<gameOdds.length; i++){
	    var game = gameOdds[i];

			if(game.homeFactors.length > 0){
				game.homeFactors.sort((a,b)=>{return b.factor-a.factor});
				game.bestHomeFactor = game.homeFactors[0];
				game.homeFactors[0].best = true;
			}

			if(game.awayFactors.length > 0){
				game.awayFactors.sort((a,b)=>{return b.factor-a.factor});
				game.bestAwayFactor = game.awayFactors[0];
				game.awayFactors[0].best = true;
			}

			if(game.overFactors && game.overFactors.length > 0){
				game.overFactors.sort((a,b)=>{return b.factor-a.factor});
				game.bestOverFactor = game.overFactors[0];
				game.overFactors[0].best = true;
			}

			if(game.underFactors && game.underFactors.length > 0){
				game.underFactors.sort((a,b)=>{return b.factor-a.factor});
				game.bestUnderFactor = game.underFactors[0];
				game.underFactors[0].best = true;
			}

	    if(game.drawFactors.length > 0 ){
	      game.drawFactors.sort((a,b)=>{return b.factor-a.factor});
	      game.bestDrawFactor = game.drawFactors[0];
				game.drawFactors[0].best = true;
	      game.houseLine = (1/game.bestHomeFactor.factor) + (1/game.bestAwayFactor.factor) + (1/game.bestDrawFactor.factor)
	      //Logger.log(game.houseLine+ ': '+game.bestHomeFactor.factor+' : '+game.bestAwayFactor.factor +' : '+ game.bestDrawFactor.factor);
	    }else if(game.bestHomeFactor && game.bestAwayFactor){
	      game.houseLine = (1/game.bestHomeFactor.factor) + (1/game.bestAwayFactor.factor);
	    }else if(game.bestOverFactor && game.bestUnderFactor){
	      game.houseLine = (1/game.bestOverFactor.factor) + (1/game.bestUnderFactor.factor);
	    }


	  }
	  gameOdds.sort((a,b)=>{ return a.houseLine - b.houseLine; })
	}
}
