import React, { Component } from 'react';
import logo from '../logo.svg';
import PageBlock from '../components/page-block';
import BinAPI from '../Shared/binance_api';

class BinancePage extends Component{

	constructor(props){
		super(props);
		this.state = {title: 'Binance API'};
	}

	getExchangeInfo(){
		BinAPI.getExchangeInfo()
	}

	render(){
		return(
			<div className="about">
				<div className="about-body">
					<PageBlock fill="light">
						<div><h2>{this.state.title}</h2></div>
						<p>interface with the binance api</p>
						<img src={logo} className="App-logo" alt="logo" />
						<button onClick='getExchangeInfo()'>get exchange info</button>
						<button onClick='get24HourAverage("ETHBTC")'>BTC/ETH</button>
					</PageBlock>
					<PageBlock fill="dark">
						<h2>light block</h2>
					</PageBlock>

				</div>
			</div>

		)
	}
}

export default BinancePage;
