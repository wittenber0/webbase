import React, { Component } from 'react';
import logo from '../logo.svg';
import PageBlock from '../components/page-block';

class AdminPage extends Component{

	constructor(props){
		super(props);
		this.state = {title: 'administration'};
	}

	render(){
		return(
			<div className="admin">
				<div className="admin-body">
					<PageBlock fill="light">
						<div><h2>{this.state.title}</h2></div>
						<p>do admin things below</p>
					</PageBlock>
					<PageBlock fill="dark">
						<h2>more coming soon...</h2>
					</PageBlock>

				</div>
			</div>

		)
	}
}

export default AdminPage;
