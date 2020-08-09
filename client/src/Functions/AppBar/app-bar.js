import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TemporaryDrawer from './temporary-drawer'
import Search from '../Search/search';

import Context from '../../Shared/app-context';

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

const sideBarItems = [
	{display: 'Home', route: '/app'},
	{display: 'About', route: '/app/about'},
];

class MyAppBar extends Component{

	constructor(props){
		super(props);
    this.state = {items: sideBarItems};
	}

  componentDidMount(){
    console.log(Context.user())
  }

	render(){
    const {classes} = this.props
    return (
      <div className="app-bar">
        <AppBar position="fixed">
          <Toolbar>
            <TemporaryDrawer drawerLocation='left' menuList={this.state.items} history={this.props.history}>
            </TemporaryDrawer>
            <Typography variant="h6" className={classes.title}>
              wittenber0
            </Typography>
            <Search />
          </Toolbar>
        </AppBar>
      </div>
    );
	}
}

export default withStyles(styles)(MyAppBar);
