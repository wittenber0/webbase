import React, { Component } from 'react';
import PageBlock from '../components/page-block';
import { CircularProgress } from '@mui/material';

type Props = {

}

type State = {
	title: string
}

class LoadingPage extends Component<Props, State>{

	constructor(props: Props){
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
