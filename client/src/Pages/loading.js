import React, { Component } from 'react';
import PageBlock from '../components/page-block';
import CircularProgress from '@material-ui/core/CircularProgress';

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
						<div style={{textAlign:'center'}}>
							<CircularProgress size={100}/>
						</div>
					</PageBlock>

				</div>
			</div>
		)
	}
}

export default LoadingPage;
