import React, { Component } from 'react';
import classNames from 'classnames'

class PageBlock extends Component{

	constructor(props){
		super(props);
    if(props.fill === 'light'){
      this.state = {blockFill : classNames('light-fill-block')}
    }else{
      this.state = {blockFill : classNames('dark-fill-block')}
    }
	}

	render(){
		return(
			<div className={this.state.blockFill}>
				<div className="block-body">
					{this.props.children}
				</div>
			</div>

		)
	}
}

export default PageBlock;
