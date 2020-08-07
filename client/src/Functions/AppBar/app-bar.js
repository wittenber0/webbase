import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TemporaryDrawer from './temporary-drawer'
import Search from '../Search/search';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    textAlign: 'left',
    marginLeft: '30px'
  },
}));

const sideBarItems = [
	{display: 'Home', route: '/app'},
	{display: 'About', route: '/app/about'},
];

export default function ButtonAppBar(props) {
  const classes = useStyles();

  return (
    <div className="app-bar">
      <AppBar position="fixed">
        <Toolbar>
          <TemporaryDrawer drawerLocation='left' menuList={sideBarItems} history={props.history}>
          </TemporaryDrawer>
          <Typography variant="h6" className={classes.title}>
            Sprint Endure
          </Typography>
          <Search />
        </Toolbar>
      </AppBar>
    </div>
  );
}
