import React, { Component } from 'react';
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
	lightFillBlock : {
	  backgroundColor: theme.palette.dark.two,
	  minHeight: '100vh',
	  display: 'flex',
	  flexDirection: 'column',
	  alignItems: 'center',
	  justifyContent: 'center',
	  fontSize: 'calc(10px + 2vmin)',
	  color: 'white'
	},
	darkFillBlock : {
	  backgroundColor: theme.palette.dark.one,
	  minHeight: '100vh',
	  display: 'flex',
	  flexDirection: 'column',
	  alignItems: 'center',
	  justifyContent: 'center',
	  fontSize: 'calc(10px + 2vmin)',
	  color: 'white'
	},
	blockBody : {
		width: '80%'
	}
});


class PageBlock extends Component{

	render(){
		const {classes} = this.props;
		var blockFill;
    if(this.props.fill === 'light'){
      blockFill = classNames(classes.lightFillBlock);
    }else{
      blockFill = classNames(classes.darkFillBlock);
    }
		return(
			<div className={blockFill}>
				<div className={classes.blockBody}>
					{this.props.children}
				</div>
			</div>

		)
	}
}

export default withStyles(styles)(PageBlock);
