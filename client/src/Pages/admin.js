import React, { Component } from 'react';
import logo from '../logo.svg';
import PageBlock from '../components/page-block';
import AuthService from '../Shared/auth-service';
import App from '../App';

import Table from '../Functions/Table/table';

class AdminPage extends Component{

	constructor(props){
		super(props);
		this.state = {title: 'administration', appUsers: null};
	}

	componentDidMount(){
		AuthService.getAllAppRoles(App.user().user_id).then( r => {
			//console.log(r);
		})

		AuthService.post('/appusers').then( r => {
			console.log(r);
			this.setState({appUsers : r});
		})
	}

	render(){
		return(
			<div className="admin">
				<div className="admin-body">
					<PageBlock fill="light">
						<div><h2>{this.state.title}</h2></div>
						<p>do admin things below</p>
					</PageBlock>
					{this.state.appUsers &&
						<PageBlock fill="dark">
							<h2>Manage Users</h2>
							<Table users={this.state.appUsers}/>


						</PageBlock>
					}


				</div>
			</div>

		)
	}
}

export default AdminPage;
