import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
//import AppBar from '@material-ui/core/AppBar';
import { AppBar, Toolbar, Typography } from '@mui/material';
import TemporaryDrawer from './temporary-drawer'
import Search from '../Search/search';
import App from '../../App';
import { styled } from '@mui/material/styles';

let sideBarItems = [
	{display: 'Home', route: '/app'},
];

const StyledTyp = styled(Typography)(({theme}:any) => ({
  color: theme.palette.primary,
  paddingLeft: '20px'
}));

type Props = {
  user?: any,
  app?: any,
  history: any
}

type State = {
  items: any,
  app: any,
  user: any
}

class MyAppBar extends Component<Props, State>{
  public state: State = {
    items: sideBarItems,
    app: this.props.app,
    user: this.props.app.getUser()
  };

	constructor(props: Props){
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

  static getDerivedStateFromProps(nextProps: Props, prevState: State){

    if(prevState.user !== nextProps.user){
      let o: any = {};
      if(prevState.app.userHasRole('AppAdmin') && !(prevState.items.filter( (i:any) => i.display === 'Administration').length > 0)){
        let s = prevState.items
        s.push({display: 'Administration', route: '/app/admin'});
        o.items = s;
      }
      if(prevState.app.userHasRole('ArbitrageUser') && !(prevState.items.filter( (i:any) => i.display === 'Arbitrage').length > 0)){
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
            <TemporaryDrawer drawerLocation='left' menuList={this.state.items} history={this.props.history} app={this.state.app} />
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
