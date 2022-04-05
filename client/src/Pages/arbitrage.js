import React, { Component } from 'react';
import logo from '../logo.svg';
import PageBlock from '../components/page-block';
import ArbitrageService from '../Shared/arbitrage-service';
import GameCard from '../Functions/GameCard/gamecard';

import TextField from '@mui/material/TextField';
import { Grid, Button, ButtonGroup } from '@mui/material';
import { withStyles } from "@material-ui/core/styles";

import BetOnlineBrain from '../ClientBrain/Arbitrage/BookBrains/bet-online-brain';
import ActionNetworkBrain from '../ClientBrain/Arbitrage/action-network-brain';
import BookManager from '../ClientBrain/Arbitrage/book-manager';
import GameOddManager from '../ClientBrain/Arbitrage/game-odd-manager';

const styles = theme => ({
  root: {
    background: "black"
  },
  input: {
    color: "white !important"
  }
});

class ArbitragePage extends Component{

	constructor(props){
		super(props);
		this.state = {
			title: 'Arbitrage',
			allOdds: [],
			houseLineThreshold: 1.02,
			thresholdInput: 1.02,
			displayOdds: [],
			betTypeFilter: 'all',
			myBooks: []
		};

		this.ActionNetworkBrain = new ActionNetworkBrain(this.state.houseLineThreshold, this.state.betTypeFilter, this.state.books);
		this.bookManager = BookManager.getInstance();
		this.gameOddManager = GameOddManager.getInstance();
		this.refreshHouseLineThreshold = this.refreshHouseLineThreshold.bind(this);
		this.updateHouseLineThreshold = this.updateHouseLineThreshold.bind(this);
		this.setBetTypeFilter = this.setBetTypeFilter.bind(this);
	}

	componentDidMount(){
		this.bookManager.loadBooks().then(()=>{
			this.setState({myBooks: this.bookManager.getSelectedBooks()})
			this.populateGameOdds();
		});
	}

	setBetTypeFilter(e){
		let btf = e.currentTarget.value;
		if(e && btf){
			this.setState({betTypeFilter: btf});
		}
	}

	populateGameOdds(){
		this.gameOddManager.loadActionNetworkGameOdds(this.state.houseLineThreshold, this.state.betTypeFilter, this.bookManager).then(r => {
			this.setState({
				allOdds: this.gameOddManager.gameOdds,
				displayOdds: this.getDisplayOdds(this.gameOddManager.gameOdds)
			});
		});
	}

	getDisplayOdds(gameOdds){
    return gameOdds.filter(o => {
      if(this.state.betTypeFilter !== 'all' && this.state.betTypeFilter !== o.betType){
        return false;
      }
      return o.houseLine < this.state.houseLineThreshold;
    });
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
						<div><h2>{this.state.title}</h2></div>
						<Grid container spacing={2} justifyContent="left" alignItems="center">
							<Grid item>
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
							</Grid>
							<Grid item>
								<ButtonGroup variant="outlined" aria-label="outlined primary button group">
									<Button
										onClick={this.setBetTypeFilter}
										color={this.state.betTypeFilter === "money-line" ? 'secondary': 'primary' }
										value="money-line">
										Money Line
									</Button>
									<Button
										onClick={this.setBetTypeFilter}
										color={this.state.betTypeFilter === "spread" ? 'secondary': 'primary' }
										value="spread">
										Spread
									</Button>
									<Button
										onClick={this.setBetTypeFilter}
										color={this.state.betTypeFilter === "over-under-total" ? 'secondary': 'primary' }
										value="over-under-total">
										Over Under (Total)
									</Button>
									<Button
										onClick={this.setBetTypeFilter}
										color={this.state.betTypeFilter === "over-under-team" ? 'secondary': 'primary' }
										value="over-under-team">
										Over Under (Team)
									</Button>
									<Button
										onClick={this.setBetTypeFilter}
										color={this.state.betTypeFilter === "all" ? 'secondary': 'primary' }
										value="all">
										All
									</Button>
								</ButtonGroup>
							</Grid>
							<Grid item>
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
