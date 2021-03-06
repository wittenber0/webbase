import React, { Component } from 'react';
import PageBlock from '../components/page-block';

class NotFoundPage extends Component{

	constructor(props){
		super(props);
		this.state = {title: 'Page Not Found'};
	}

	render(){
		return(
			<div className="not-found-page">
				<div className="not-found-page-body">
					<div>
						<PageBlock fill="light">
							<h2>{this.state.title}</h2>
							<p>this page does not exist, or you do not have access to this page</p>
						</PageBlock>
					</div>
				</div>
			</div>
		)
	}
}

export default NotFoundPage;
