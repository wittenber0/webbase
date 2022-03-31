import React, { Component } from 'react';
import logo from '../logo.svg';
import PageBlock from '../components/page-block';
import ArbitrageService from '../Shared/arbitrage-service';
import GameCard from '../Functions/GameCard/gamecard';

import TextField from '@mui/material/TextField';
import { Grid, Button } from '@mui/material';
import { withStyles } from "@material-ui/core/styles";

import BetOnlineBrain from '../ClientBrain/Arbitrage/bet-online';
import GameOdd from '../ClientBrain/Arbitrage/game-odd';
import Factor from '../ClientBrain/Arbitrage/factor';

const styles = theme => ({
  root: {
    background: "black"
  },
  input: {
    color: "white !important"
  }
});

const selectedBooks = [3, 1, 8, 21];

class ArbitragePage extends Component{

	constructor(props){
		super(props);
		this.state = {
			title: 'Arbitrage',
			allOdds: [],
			books: [],
			houseLineThreshold: 1.02,
			thresholdInput: 1.02,
			myBooks: [],
			displayOdds: []
		};

		this.refreshHouseLineThreshold = this.refreshHouseLineThreshold.bind(this);
		this.updateHouseLineThreshold = this.updateHouseLineThreshold.bind(this);
	}

	componentDidMount(){
		ArbitrageService.getAllBooks().then((r)=>{
			let allBooks = r["books"];
			let myBooks = allBooks.filter((b)=> {return selectedBooks.includes(b.id)});

			this.setState({books:allBooks, myBooks: myBooks});

			//let betOnlineBrain = new BetOnlineBrain();
			this.populateGameOdds();
		})


	}

	populateGameOdds(){
		ArbitrageService.getAllOddsForDate().then((r)=>{
			let allGames = r["all_games"];
			let gameOdds = [];
		  for(let i = 0; i< allGames.length; i++){
		    this.evaluateLeague(allGames[i], gameOdds);
		  }
		  this.sortGameOdds(gameOdds);
			this.setState({allOdds: gameOdds, displayOdds: gameOdds.filter(o => o.houseLine < this.state.houseLineThreshold)});
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
	  var book = this.state.books.find(e => e.id === bookId);
	  var bookName = book['display_name'];
		var bookLogo = (book['meta']['logos'] ? book['meta']['logos']['primary'] : null);
	  var type = odds['type'];
		this.evaluateMoneyLine(bookId, status, book, bookName, bookLogo, type, odds, game, gameOdds);
		this.evaluateSpread();
		this.evaluateOverUnder();
	}

	evaluateMoneyLine(bookId, status, book, bookName, bookLogo, type, odds, game, gameOdds){
		let betType = 'ml';
		let mlHome = odds['ml_home'];
	  let mlAway = odds['ml_away'];
	  let mlDraw = odds['draw'];

		//evaluate money line
	  if(mlHome && mlAway && bookName != 'Open' && bookName != 'Consensus' && status != 'complete'){
	    var homeFactor;
	    if(mlHome > 0){
	      homeFactor = Math.round((1 + (mlHome/100))*100)/100;
	    }else{
	      homeFactor = Math.round((1 + (-100/mlHome))*100)/100;
	    }

	    var awayFactor;
	    if(mlAway > 0){
	      awayFactor = Math.round((1 + (mlAway/100))*100)/100;
	    }else{
	      awayFactor = Math.round((1 + (-100/mlAway))*100)/100;
	    }

	    var drawFactor = 0;
	    if(mlDraw && mlDraw > 0){
	      drawFactor = Math.round((1 + (mlDraw/100))*100)/100;
	    }else{
	      drawFactor = Math.round((1 + (-100/mlDraw))*100)/100;
	    }

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
	        type, betType));
	      }
	    }else{
	      gameOdds.push(new GameOdd(game,
	      [new Factor(homeFactor, bookName, bookId, bookLogo, mlHome)],
	      [new Factor(awayFactor, bookName, bookId, bookLogo, mlAway)],
	      (drawFactor > 0 ? [new Factor(drawFactor, bookName, bookId, bookLogo, mlDraw)] : []),
	      type, betType));
	    }
	  }
	}

	evaluateSpread(){

	}

	evaluateOverUnder(){

	}

	sortGameOdds(gameOdds){
	  for(var i =0; i<gameOdds.length; i++){
	    var game = gameOdds[i];
	    game.homeFactors.sort((a,b)=>{return b.factor-a.factor});
	    game.awayFactors.sort((a,b)=>{return b.factor-a.factor});

	    game.bestHomeFactor = game.homeFactors[0];
			game.homeFactors[0].best = true;
	    game.bestAwayFactor = game.awayFactors[0];
			game.awayFactors[0].best = true;

	    if(game.drawFactors.length > 0 ){
	      game.drawFactors.sort((a,b)=>{return b.factor-a.factor});
	      game.bestDrawFactor = game.drawFactors[0];
				game.drawFactors[0].best = true;
	      game.houseLine = (1/game.bestHomeFactor.factor) + (1/game.bestAwayFactor.factor) + (1/game.bestDrawFactor.factor)
	      //Logger.log(game.houseLine+ ': '+game.bestHomeFactor.factor+' : '+game.bestAwayFactor.factor +' : '+ game.bestDrawFactor.factor);
	    }else{
	      game.houseLine = (1/game.bestHomeFactor.factor) + (1/game.bestAwayFactor.factor);
	    }


	  }
	  gameOdds.sort((a,b)=>{ return a.houseLine - b.houseLine; })
	}

	updateHouseLineThreshold(e){
		this.setState({thresholdInput: e.target.value});
	}

	refreshHouseLineThreshold(){
		this.setState({houseLineThreshold: this.state.thresholdInput});
		this.populateGameOdds();
	}

	render(){
		const {classes} = this.props;
		return(
			<div className="arbitrage">
				<div className="arbitrage-body">
					<PageBlock fill="light">
						<Grid container spacing={2} justifyContent="center" alignItems="center">
							<Grid item xs={8}>
								<div><h2>{this.state.title}</h2></div>
							</Grid>
							<Grid item xs={4}>
								<TextField
									id="outlined-basic"
									label="House Line Threshold"
									variant="outlined"
									InputProps= {{className: classes.input}}
									focused
									defaultValue={this.state.houseLineThreshold}
									onChange={this.updateHouseLineThreshold}
									size='small'
								/>
								<Button variant="contained" onClick={this.refreshHouseLineThreshold}>Refresh</Button>
							</Grid>
						</Grid>
						{this.state.displayOdds.length > 0 &&
							<div>
							{this.state.displayOdds.map((odd,i)=>{
								if(i<100 && odd.houseLine){
									return(<GameCard gameOdd={odd} key={i} myBooks={this.state.myBooks}/>)
								}
							})}
							</div>
						}
					</PageBlock>
					<PageBlock fill="dark">
						<h2>... more arbitrage stuff</h2>
					</PageBlock>

				</div>
			</div>

		)
	}
}

export default withStyles(styles)(ArbitragePage);
