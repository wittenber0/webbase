import React, { Component } from 'react';
import PageBlock from '../components/page-block';

type Props = {

}

type State = {
	title: string
}

class HomePage extends Component<Props, State>{

	constructor(props: Props){
		super(props);
		this.state = {title: 'Home'};
	}

	render(){
		return(
			<div className="home-body">
				<PageBlock fill="light">
					<div style={{textAlign: 'center'}}>
						<h2>welcome to the brain dump of wittenber0</h2>
					</div>
				</PageBlock>
				<PageBlock fill="dark">
					<h2>more coming soon...</h2>
				</PageBlock>

			</div>

		)
	}
}

export default HomePage;
