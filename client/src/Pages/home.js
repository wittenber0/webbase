import React, { Component } from 'react';
import PageBlock from '../components/page-block';

class HomePage extends Component{

	constructor(props){
		super(props);
		this.state = {title: 'Home'};
	}

	render(){
		return(
			<div className="home">
				<div className="home-body">
					<PageBlock fill="light">
						<div><h2>{this.state.title}</h2></div>
						<p>welcome to the brain dump of wittenber0</p>
					</PageBlock>
					<PageBlock fill="dark">
						<h2>more coming soon...</h2>
					</PageBlock>

				</div>
			</div>

		)
	}
}

export default HomePage;
