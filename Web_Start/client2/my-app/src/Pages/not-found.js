import React, { Component } from 'react';

class NotFoundPage extends Component{

	constructor(props){
		super(props);
		this.state = {title: 'Page Not Found'};
	}

	render(){
		return(
			<div className="not-found-page">
				<div className="not-found-page-body">
					<div><h2>{this.state.title}</h2></div>
				</div>
			</div>
		)
	}
}

export default NotFoundPage;
