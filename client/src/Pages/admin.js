import React, { Component } from 'react';
import PageBlock from '../components/page-block';
import AuthService from '../Shared/auth-service';
import UtilityService from '../Shared/utility-service';
import App from '../App';
import { CircularProgress } from '@mui/material';

import Table from '../Functions/Table/table';

class AdminPage extends Component{

	constructor(props){
		super(props);
		this.state = {title: 'administration', appUsers: null, appRoles: null};
	}

	componentDidMount(){
		let dictionaries = [];
		dictionaries.push(AuthService.getAllAppRoles(App.user().user_id));
		dictionaries.push(UtilityService.post('/appusers'));

		Promise.all(dictionaries).then( values => {
			this.setState({appUsers : values[1], appRoles: values[0]});
		});

	}

	updateUserRoles(user, toRemove){
		let roleList;

		if(toRemove){
			roleList = toRemove;
		} else {
			roleList = user.roles.map( r => r.id);
		}

		if(user.user_id === App.user().user_id){
			console.log(user.roles);
			this.props.app.updateMyRoles(user.roles);
		}

		AuthService.updateUserRoles(user.user_id, roleList, !!toRemove);
	}

	render(){
		return(
			<div className="admin">
				<div className="admin-body">
					{this.state.appUsers===null? <PageBlock fill="light"><CircularProgress size={100} /></PageBlock> :
						<PageBlock fill="light" waitfor={this.state.appUsers}>
							<h2>Manage Users</h2>
							<Table users={this.state.appUsers} roles={this.state.appRoles} adminPage={this}/>
						</PageBlock>
					}
					<PageBlock fill="dark">
						<div><h2>{this.state.title}</h2></div>
						<p>do admin things below</p>
					</PageBlock>
				</div>
			</div>

		)
	}
}

export default AdminPage;
