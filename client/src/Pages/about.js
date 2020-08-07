import React, { Component } from 'react';
import logo from '../logo.svg';
import PageBlock from '../components/page-block';

class AboutPage extends Component{

	constructor(props){
		super(props);
		this.state = {title: 'About'};
	}

	render(){
		return(
			<div className="about">
				<div className="about-body">
					<PageBlock fill="dark">
						<div><h2>{this.state.title}</h2></div>
						<p>this is a test</p>
						<img src={logo} className="App-logo" alt="logo" />
					</PageBlock>
					<PageBlock fill="light">
						<h2>dark block</h2>
					</PageBlock>

				</div>
			</div>

		)
	}
}

export default AboutPage;
