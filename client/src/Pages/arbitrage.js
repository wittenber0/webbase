import React, { Component } from 'react';
import logo from '../logo.svg';
import PageBlock from '../components/page-block';
import ArbitrageService from '../Shared/arbitrage-service';
import GameCard from '../Functions/GameCard/gamecard';

import TextField from '@mui/material/TextField';
import { Grid, Typography, Paper, Button, FormControl, Switch } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import BetOnlineBrain from '../ClientBrain/Arbitrage/BookBrains/bet-online-brain';
import ActionNetworkBrain from '../ClientBrain/Arbitrage/action-network-brain';
import BookManager from '../ClientBrain/Arbitrage/book-manager';
import GameOddManager from '../ClientBrain/Arbitrage/game-odd-manager';


const styles = theme => ({
    textField: {
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingBottom: 0,
        marginTop: 0,
        fontWeight: 500
    },
    input: {
        color: 'white'
    }
});

const Item = styled(Paper)(({ theme }) => {
	return({
  backgroundColor: theme.palette.dark.three,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: 'white',
  height: '25px',
	fontWeight: 'bold',
	alignItems: "center",
	justifyContent: "center",
	display:"flex"
});});

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

class ArbitragePage extends Component{

	constructor(props){
		super(props);
		this.state = {
			title: 'Arbitrage',
			allOdds: [],
			displayOdds: [],
			betTypeFilter: 'all',
			leagueFilter: 'all',
			sortBy: 'ev',
			myBooks: [],
			leagueOptions: []
		};

		this.ActionNetworkBrain = new ActionNetworkBrain(this.state.betTypeFilter, this.state.books);
		this.bookManager = BookManager.getInstance();
		this.gameOddManager = GameOddManager.getInstance();
		this.setBetTypeFilter = this.setBetTypeFilter.bind(this);
		this.updateSortBy = this.updateSortBy.bind(this);
		this.populateGameOdds = this.populateGameOdds.bind(this);
		this.setLeagueFilter = this.setLeagueFilter.bind(this);
	}

	componentDidMount(){
		this.bookManager.loadBooks().then(()=>{
			this.setState({myBooks: this.bookManager.getSelectedBooks()})
			this.populateGameOdds().then(() => {
				this.populateLeagueOptions();
			});
		});
	}

	populateLeagueOptions(){
		console.log(this.state.allOdds[0]);
		let lo = this.state.allOdds.map( o => o.leagueName ).filter(onlyUnique);
		this.setState({leagueOptions: lo});
	}

	setBetTypeFilter(e){
		let btf = e.target.value;
		if(e && btf){
			this.setState({betTypeFilter: btf});
			this.populateGameOdds();
		}
	}

	setLeagueFilter(e){
		let lf = e.target.value;
		if(e && lf){
			this.setState({leagueFilter: lf});
			this.populateGameOdds();
		}
	}

	updateSortBy(e){
		let sb = e.target.value;
		if(e && sb){
			let allOdds = this.gameOddManager.getGameOddsSortedBy(sb);
			this.setState({sortBy: sb, allOdds: allOdds, displayOdds: this.getDisplayOdds(allOdds)});
		}
	}

	async populateGameOdds(){
		return await this.gameOddManager.loadGameOdds(this.state.betTypeFilter, this.bookManager, this.state.sortBy).then(r => {
			this.setState({
				allOdds: this.gameOddManager.gameOdds,
				displayOdds: this.getDisplayOdds(this.gameOddManager.gameOdds)
			});
			//console.log(this.state.displayOdds);
		});
	}

	getDisplayOdds(gameOdds){
    return gameOdds.filter( (o, i) => {
			//betType Filter
      if(this.state.betTypeFilter !== 'all' && this.state.betTypeFilter !== o.betType.slice(0,2)){
        return false;
      }
			//setLeagueFilter
			if(this.state.leagueFilter !== 'all' && this.state.leagueFilter !== o.leagueName){
				return false;
			}
      return i < 20;
    });
  }

	render(){
		//const {classes} = this.props;
		return(
			<div className="arbitrage">
				<div className="arbitrage-body">
					<PageBlock fill="dark">
						<div><h2>{this.state.title}</h2></div>
						<Grid container spacing={2} justifyContent="left" alignItems="center">
							<Grid item>
								<FormControl fullWidth>
									<InputLabel id="sort-by-label">Sort By</InputLabel>
									<Select
										size="small"
										labelId="sort-by-label"
										id="sort"
										value={this.state.sortBy}
										label=" Sort By "
										onChange={this.updateSortBy}
									>
										<MenuItem value={'ev'}>+EV</MenuItem>
										<MenuItem value={'arb'}>ARB</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={2}>
								<FormControl fullWidth>
									<InputLabel id="bt-label">Bet Type</InputLabel>
					        <Select
										size="small"
					          labelId="bt-label"
					          id="betTypeFilter"
					          value={this.state.betTypeFilter}
					          label=" Bet Type "
					          onChange={this.setBetTypeFilter}
					        >
					          <MenuItem value={'all'}>All</MenuItem>
					          <MenuItem value={'ml'}>Money Line</MenuItem>
					          <MenuItem value={'s'}>Spread</MenuItem>
										<MenuItem value={'ou'}>Over Under</MenuItem>
					          <MenuItem value={'tt'}>Team Over Under</MenuItem>
					        </Select>
								</FormControl>
							</Grid>
							<Grid item xs={2}>
								<FormControl fullWidth>
									<InputLabel id="league-label">League</InputLabel>
					        <Select
										size="small"
					          labelId="league-label"
					          id="leagueFilter"
					          value={this.state.leagueFilter}
					          label=" League "
					          onChange={this.setLeagueFilter}
					        >
										<MenuItem value={'all'}>all</MenuItem>
										{this.state.leagueOptions.map( (lo, i) => {
											return <MenuItem value={lo} key={i}>{lo}</MenuItem>
										})}
					        </Select>
								</FormControl>
							</Grid>
							<Grid item xs={2}>
								<Button variant="contained" onClick={this.populateGameOdds}>Refresh</Button>
							</Grid>
						</Grid>
						<Grid container spacing={1} sx={{mt:2}}>
							<Grid item xs={2.5}>
							</Grid>
							<Grid item xs={1}>
								<Item>Line</Item>
							</Grid>
							<Grid item xs={1}>
								<Item>Arb</Item>
							</Grid>
							<Grid item xs={1}>
								<Item>EV</Item>
							</Grid>
							<Grid item xs={1}>
								<Item>Pick</Item>
							</Grid>
							{this.state.myBooks.map((b) => {
	              return(
	                <Grid item xs={1} key={'header-'+b.bookId}>
	                  <Item>
	                  {b.bookLogo ? <img style={{maxWidth:"100%", maxHeight:"100%"}}src={b.bookLogo}/> :
	                    <Typography>{b.bookName}</Typography>
	                  }
	                  </Item>
	                </Grid>
	              );
	            })}
						</Grid>
						{this.state.displayOdds.length > 0 &&
							<div style={{width:'100%'}}>
							{this.state.displayOdds.map((odd,i)=>{
								if(i<100 && odd.houseLine){
									return(<GameCard gameOdd={odd} key={i} myBooks={this.state.myBooks}/>)
								}
							})}
							</div>
						}
					</PageBlock>
					<PageBlock fill="light">
						<h2>... more arbitrage stuff</h2>
					</PageBlock>

				</div>
			</div>

		)
	}
}

export default ArbitragePage;
