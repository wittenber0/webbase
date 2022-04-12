import React, { Component } from 'react';
import classNames from 'classnames'
import { styled } from '@mui/material/styles';

const LightFillBlock = styled('div')(({theme}) => ({
	backgroundColor: theme.palette.dark.two,
	minHeight: '100vh',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	fontSize: 'calc(10px + 2vmin)',
	color: 'white',
}));

const DarkFillBlock = styled('div')(({theme}) => ({
	backgroundColor: theme.palette.dark.one,
	minHeight: '100vh',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	fontSize: 'calc(10px + 2vmin)',
	color: 'white',
}));

const NotWideDiv = styled('div')(({theme}) => ({
	width: '80%',
	height: '100%'

}));

class PageBlock extends Component{

	render(){
		var blockFill;
    if(this.props.fill === 'light'){
			return(
				<LightFillBlock className='lightFillBlock'>
					<NotWideDiv className='notWideDiv'>
						{this.props.children}
					</NotWideDiv>
				</LightFillBlock>
			)
    }else{
			return(
				<DarkFillBlock className='darkFillBlock'>
					<NotWideDiv className='notWideDiv'>
						{this.props.children}
					</NotWideDiv>
				</DarkFillBlock>
			)
    }

	}
}

export default PageBlock;
