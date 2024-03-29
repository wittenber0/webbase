import React, { Component } from 'react';
import PageBlock from '../components/page-block';

class MyProfilePage extends Component{

	constructor(props){
		super(props);
		this.state = {title: 'Profile'};
	}

	render(){
		return(
			<div className="about">
				<div className="profile-body">
					<PageBlock fill="light">
						<div><h2>{this.state.title}</h2></div>
						<p>...to display profile info soon</p>
					</PageBlock>
				</div>
			</div>
		)
	}
}

export default MyProfilePage;
