import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
//import AppBar from '@material-ui/core/AppBar';
import { AppBar, Toolbar, Typography } from '@mui/material';
import TemporaryDrawer from './temporary-drawer'
import Search from '../Search/search';
import App from '../../App';
import { styled } from '@mui/material/styles';

const styles = theme => {
  return({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    textAlign: 'left',
    marginLeft: '30px'
  },
  appBar: {
    backgroundColor: theme.palette.primary.main
  }
})};

let sideBarItems = [
	{display: 'Home', route: '/app'},
];

const StyledAppBar = styled(AppBar)(({theme}) => ({
  backgroundColor: theme.palette.primary
}));

const StyledTyp = styled(Typography)(({theme}) => ({
  color: theme.palette.primary,
  paddingLeft: '20px'
}));

class MyAppBar extends Component{

	constructor(props){
		super(props);
    if(props.app.userHasRole('AppAdmin')){
      sideBarItems.push({display: 'Administration', route: '/app/admin'});
    }

    if(props.app.userHasRole('Arbitrage') || props.app.userHasRole('AppAdmin')){
      sideBarItems.push({display: 'Arbitrage', route: '/app/arbitrage'});
    }

    this.state = {
      items: sideBarItems,
      app: props.app,
      user: props.app.getUser()
    };
	}

  static getDerivedStateFromProps(nextProps, prevState){

    if(prevState.user !== nextProps.user){
      let o = {};
      if(prevState.app.userHasRole('AppAdmin') && !(prevState.items.filter( i => i.display === 'Administration').length > 0)){
        let s = prevState.items
        s.push({display: 'Administration', route: '/app/admin'});
        o.items = s;
      }
      if(prevState.app.userHasRole('ArbitrageUser') && !(prevState.items.filter( i => i.display === 'Arbitrage').length > 0)){
        let s = prevState.items
        s.push({display: 'Arbitrage', route: '/app/arbitrage'});
        o.items = s;
      }
      o.app = nextProps.app;
      return o;
    }else{
      return null
    }
  }

	render(){
    return (
      <div className="app-bar">
        <AppBar position="fixed" color='primary'>
          <Toolbar>
            <TemporaryDrawer drawerLocation='left' menuList={this.state.items} history={this.props.history} app={this.state.app}>
            </TemporaryDrawer>
            <StyledTyp variant="h6" >
              wittenber0 archives
            </StyledTyp>
          </Toolbar>
        </AppBar>
      </div>
    );
	}
}

export default MyAppBar;
