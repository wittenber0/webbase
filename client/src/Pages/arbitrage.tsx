import React, { Component } from 'react';
import logo from '../logo.svg';
import PageBlock from '../components/page-block';
import ArbitrageService from '../Shared/arbitrage-service';
import GameCard from '../Functions/GameCard/gamecard';
import BasicPopover from '../Functions/PopOver/popover';

import TextField from '@mui/material/TextField';
import { Grid, Typography, Paper, Button, FormControl, Switch } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import BetOnlineBrain from '../ClientBrain/Arbitrage/BookBrains/bet-online-brain';
import ActionNetworkBrain from '../ClientBrain/Arbitrage/action-network-brain-v2';
import BookManager from '../ClientBrain/Arbitrage/book-manager';
import BetChoice from '../ClientBrain/Arbitrage/Models/v2/BetChoice';
import Book from '../ClientBrain/Arbitrage/Models/v2/Book';
import BetChoiceManager from '../ClientBrain/Arbitrage/BetChoiceManager';
import { BetTypeEnum } from '../ClientBrain/Arbitrage/Models/v2/enum/BetTypeEnum';

const Item = styled(Paper)(({ theme }: any) => {
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

type Props = {

}

type State = {
	title: string,
	allBets: BetChoice[],
	displayBets: BetChoice[],
	betTypeFilter: BetTypeEnum,
	leagueFilter: string,
	sortBy: string,
	myBooks: Book[],
	leagueOptions: string[]
}

class ArbitragePage extends Component<Props, State>{
	state: State = {
		title: 'Arbitrage',
		allBets: [],
		displayBets: [],
		betTypeFilter: BetTypeEnum.All,
		leagueFilter: 'all',
		sortBy: 'ev',
		myBooks: [],
		leagueOptions: []
	};

	actionNetWorkBrain: ActionNetworkBrain;
	bookManager: BookManager;
	betChoiceManager: BetChoiceManager;


	constructor(props: Props){
		super(props);

		this.actionNetWorkBrain = new ActionNetworkBrain();
		this.bookManager = BookManager.getInstance();
		this.betChoiceManager = BetChoiceManager.getInstance();
		this.setBetTypeFilter = this.setBetTypeFilter.bind(this);
		this.updateSortBy = this.updateSortBy.bind(this);
		this.populateGameOdds = this.populateGameOdds.bind(this);
		this.setLeagueFilter = this.setLeagueFilter.bind(this);
		this.updateBooks = this.updateBooks.bind(this);
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
		let lo = this.state.allBets.map( o => o.BettingEvent.LeagueName ).filter((value, index, self) => {
			return self.indexOf(value) === index;
		});
		this.setState({leagueOptions: lo});
	}

	setBetTypeFilter(e: any){
		let btf = e.target.value;
		if(e && btf !== undefined){
			this.setState({betTypeFilter: btf});
			this.populateGameOdds();
		}
	}

	setLeagueFilter(e: any){
		let lf = e.target.value;
		if(e && lf){
			this.setState({leagueFilter: lf});
			this.populateGameOdds();
		}
	}

	updateSortBy(e: any){
		let sb = e.target.value;
		if(e && sb){
			let allBets = this.betChoiceManager.getGameOddsSortedBy(sb);
			if(allBets !== undefined){
				this.setState({sortBy: sb, allBets: allBets, displayBets: this.getDisplayBets(allBets)});
			}
		}
	}

	updateBooks(e: any){
		let bookId = parseInt(e.target.value,10);
		this.bookManager.updateBookById(bookId);
		this.setState({myBooks: this.bookManager.selectedBooks});
		this.populateGameOdds();
		ArbitrageService.updateMyBooks(this.bookManager.getSelectedBookIds());
	}

	async populateGameOdds(){
		return await this.betChoiceManager.loadBetChoices().then(() => {
			let allBets = this.betChoiceManager.getGameOddsSortedBy(this.state.sortBy);
			if(allBets !== undefined){
				
				this.setState({
					allBets: allBets,
					displayBets: this.getDisplayBets(allBets)
				});
			}
			console.log(this.state.displayBets);
		});
	}

	getDisplayBets(allBets: BetChoice[]){
		return allBets.filter( (o, i) => {
			//betType Filter
			if(this.state.betTypeFilter !== BetTypeEnum.All && this.state.betTypeFilter !== o.BetType){
				return false;
			}
			//setLeagueFilter
			if(this.state.leagueFilter !== 'all' && this.state.leagueFilter !== o.BettingEvent.LeagueName){
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
					          	<MenuItem value={BetTypeEnum.All}>ALL</MenuItem>
					        	<MenuItem value={BetTypeEnum.MoneyLine}>Money Line</MenuItem>
					        	<MenuItem value={BetTypeEnum.Spread}>Spread</MenuItem>
								<MenuItem value={BetTypeEnum.OverUnder}>Over Under</MenuItem>
					        	<MenuItem value={BetTypeEnum.TeamTotal}>Team Over Under</MenuItem>
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
								<MenuItem value={'all'}>ALL</MenuItem>
								{this.state.leagueOptions.map( (lo, i) => {
									return <MenuItem value={lo} key={i}>{lo}</MenuItem>
								})}
					        </Select>
								</FormControl>
							</Grid>
							<Grid item>
								<BasicPopover updateBooks={this.updateBooks} myBooks={this.state.myBooks}></BasicPopover>
							</Grid>
							<Grid item>
								<Button variant="contained" onClick={this.populateGameOdds}>Refresh</Button>
							</Grid>
						</Grid>
						<Grid container spacing={1} sx={{mt:2}}>
							<Grid item xs={2.5}>
							</Grid>
							<Grid item xs={1.5}>
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
									<Grid item xs key={'header-'+b.BookId}>
									<Item>
									{b.BookLogo ? <img style={{maxWidth:"100%", maxHeight:"100%"}}src={b.BookLogo}/> :
										<Typography>{b.BookName}</Typography>
									}
									</Item>
									</Grid>
								);
							})}
						</Grid>
						{this.state.displayBets.length > 0 &&
							<div style={{width:'100%'}}>
							{this.state.displayBets.map((bet,i)=>{
								if(i<100 && bet.HouseLine){
									return(<GameCard betChoice={bet} key={i} myBooks={this.state.myBooks}/>)
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
