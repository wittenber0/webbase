import React, { Component } from 'react';
import logo from '../logo.svg';
import PageBlock from '../components/page-block';
import Web3 from 'web3';
import NFLT from '../Crypto/build/contracts/NFLT.json'

class NFTPage extends Component{

	constructor(props){
		super(props);
		this.state = {title: 'NFL NFTs'};
	}

  componentDidMount(){

    window.web3 = new Web3(window.ethereum);
    window.ethereum.enable();
    this.loadAccounts();
  }

  async loadAccounts(){
  	let accounts = await window.web3.eth.getAccounts();
  	this.setState({accounts: accounts});


  	let networkId = await window.web3.eth.net.getId();
  	let networkData = NFLT.networks[networkId];

  	if(networkData){
		let abi = NFLT.abi;
		let address = networkData.address;
		let contract = new window.web3.eth.Contract(abi, address);

		this.setState({ contract })
		console.log(contract);

		let totalSupply = await contract.methods.totalSupply().call();

		console.log(totalSupply);
	}else{
		window.alert('Smart contract is not deployed on this network');
	}
  	
  	console.log(accounts);

  }

	render(){
		return(
			<div className="nfts">
				<div className="nfts-body">
					<PageBlock fill="light">
						<h2>Welcome to NFL NFTs</h2>
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
