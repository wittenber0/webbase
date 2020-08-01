import React, { Component } from 'react';

class LoadingPage extends Component{

	constructor(props){
		super(props);
		this.state = {title: 'Loading...'};
	}

	render(){
		return(
			<div className="loading-page">
				<div className="loading-page-body">
					<div><h2>{this.state.title}</h2></div>
				</div>
			</div>
		)
	}
}

export default LoadingPage;
