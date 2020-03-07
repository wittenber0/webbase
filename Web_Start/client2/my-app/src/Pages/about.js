import React, { Component } from 'react';
import logo from '../logo.svg';

class AboutPage extends Component{

	constructor(props){
		super(props);
		this.state = {title: 'About'};
	}

	render(){
		console.log('about')
		return(
			<div className="about">
				<div className="about-body">
					<div><h2>{this.state.title}</h2></div>
					<p>this is a test</p>
					<img src={logo} className="App-logo" alt="logo" />
				</div>
			</div>
		)
	}
}

export default AboutPage;
