import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Divider from '@material-ui/core/Divider';
import AccountBoxIcon from '@material-ui/icons/AccountBox';

import Profile from '../../Auth/profile';
import { useAuth0 } from "../../Auth/react-auth0-spa";

const useStyles = makeStyles(theme =>({
  list: {
    width: 250
  },
  fullList: {
    width: 'auto',
  },
  drawerPaper:{

  },
  icon:{

  }
}));

function Login(){
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  if(isAuthenticated){
    return(
      <ListItem button onClick={()=> logout({})}>
        <ListItemIcon><AccountBoxIcon /></ListItemIcon>
        <ListItemText>Log out</ListItemText>
      </ListItem>
    )
  }

  return(
    <ListItem button onClick={()=> loginWithRedirect({})}>
      <ListItemIcon><AccountBoxIcon /></ListItemIcon>
      <ListItemText>Login</ListItemText>
    </ListItem>
  )
}

export default function TemporaryDrawer(props) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
    drawerLocation: props.drawerLocation
  });

  const toggleDrawer = (side, open, route) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    if(!open && route){
      changeRoute(route, state.drawerLocation)
    }

    setState({ ...state, [side]: open });
  };

  const changeRoute = (route, side) => {

	setState({ ...state, [side]: false });
	props.history.push(route);

  };

  const sideList = side => (
    <div
      className={classes.list}
      role="presentation"
    >
      <Profile goToProfile={()=>toggleDrawer(side, false, '/app/profile')}/>
      <List>
        <Login />
        <Divider />
          {props.menuList.map((item, index) => (
            <ListItem button key={item.route} onClick={toggleDrawer(side, false, item.route)} onKeyDown={toggleDrawer(side, false, item.route)}>
              <ListItemIcon classes={{root:classes.icon}}>{index % 2 === 0 ? <InboxIcon /> : <MailIcon/>}</ListItemIcon>
              <ListItemText primary={item.display} />
            </ListItem>
          ))}
      </List>
    </div>
  );

  return (
    <div>
  	  <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleDrawer(state.drawerLocation, true)}>
        <MenuIcon />
      </IconButton>
      <Drawer classes={{paper: classes.drawerPaper}} anchor={state.drawerLocation} open={state[state.drawerLocation]} onClose={toggleDrawer(state.drawerLocation, false)}>
        {sideList(state[state.drawerLocation])}
      </Drawer>
    </div>
  );
}