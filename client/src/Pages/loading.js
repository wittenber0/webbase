import React, { Component } from 'react';
import PageBlock from '../components/page-block';

class LoadingPage extends Component{

	constructor(props){
		super(props);
		this.state = {title: 'Loading...'};
	}

	render(){
		return(
			<div className="loading-page">
				<div className="loading-page-body">
					<PageBlock fill="light">
						<div><h2>{this.state.title}</h2></div>
					</PageBlock>

				</div>
			</div>
		)
	}
}

export default LoadingPage;
