import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TemporaryDrawer from './temporary-drawer'
import Search from '../Search/search';
import App from '../../App';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    textAlign: 'left',
    marginLeft: '30px'
  },
});

let sideBarItems = [
	{display: 'Home', route: '/app'},
	{display: 'About', route: '/app/about'},
  {display: 'Binance API', route: '/app/binance'},
  {display: 'Non Fungible Tokens', route: '/app/nfts'},
];

class MyAppBar extends Component{

	constructor(props){
		super(props);
    if(props.app.userHasRole('AppAdmin')){
      sideBarItems.push({display: 'Administration', route: '/app/admin'});
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
      o.app = nextProps.app;
      return o;
    }else{
      return null
    }
  }

	render(){
    const {classes} = this.props
    return (
      <AppBar position="fixed">
        <Toolbar>
          <TemporaryDrawer drawerLocation='left' menuList={this.state.items} history={this.props.history} app={this.state.app}>
          </TemporaryDrawer>
          <Typography variant="h6" className={classes.title}>
            wittenber0
          </Typography>
          <Search />
        </Toolbar>
      </AppBar>
    );
	}
}

export default withStyles(styles)(MyAppBar);
