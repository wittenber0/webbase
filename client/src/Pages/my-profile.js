import React, { Component } from 'react';
import { useAuth0 } from "../Auth/react-auth0-spa";

class MyProfilePage extends Component{

	constructor(props){
		super(props);
		this.state = {title: 'Profile'};
	}

	render(){
		return(
			<div className="about">
				<div className="profile-body">
					<div><h2>{this.state.title}</h2></div>
					<p>this is a test</p>
				</div>
			</div>
		)
	}
}

export default MyProfilePage;
