import React, { Component } from 'react';
import logo from '../logo.svg';
import PageBlock from '../components/page-block';
import Web3 from 'web3';

class NFTPage extends Component{

	constructor(props){
		super(props);
		this.state = {title: 'NFL NFTs'};
	}

  componentDidMount(){

    window.web3 = new Web3(window.ethereum);
    window.ethereum.enable();
    console.log(window.web3.eth.accounts)
    let account = window.web3.eth.accounts.create();
    console.log(account);
  }

	render(){
		return(
			<div className="nfts">
				<div className="nfts-body">
					<PageBlock fill="light">
						<div><h2>{this.state.title}</h2></div>
						<p>this is a test</p>
						<img src={logo} className="App-logo" alt="logo" />
					</PageBlock>
					<PageBlock fill="dark">
						<h2>dark block</h2>
					</PageBlock>

				</div>
			</div>

		)
	}
}

export default NFTPage;
