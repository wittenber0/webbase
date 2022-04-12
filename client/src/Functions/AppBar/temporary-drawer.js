import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Divider} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

import Profile from './profile';
import { useAuth0 } from "@auth0/auth0-react";
import App from '../../App';
import { styled } from '@mui/material/styles';

const HeaderDiv = styled('div')(({theme}) => ({
  width: 250
}));

const StyledIcon = styled(ListItemIcon)(({theme}) => ({
  color: 'white'
}));

const StyledIconButton = styled(IconButton)(({theme}) => ({
  color: 'white'
}));

const StyledDrawer = styled(Drawer)(({theme}) => ({
  backgroundColor: theme.palette.dark.one,
  color: 'white'
}));
const useStyles = makeStyles((theme) => ({
    drawer: {
      },
      drawerPaper: {
        backgroundColor: '#000000',
        color: 'white'
      },
  }));

function Logout(l, app){
  app.clearUserCache();
  l({returnTo: window.location.origin})
}

function Login(props){
  const { loginWithRedirect, logout } = useAuth0();
  if(App.user()){
    return(
      <ListItem button onClick={()=> Logout(logout, props.app)}>
        <ListItemIcon><AccountBoxIcon sx={{ color: "white" }}/></ListItemIcon>
        <ListItemText>Log out</ListItemText>
      </ListItem>
    )
  }

  return(
    <ListItem button onClick={()=> loginWithRedirect({ returnTo: window.location.origin+'/app' })}>
      <StyledIcon><AccountBoxIcon sx={{ color: "white" }}/></StyledIcon>
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
    <HeaderDiv
      role="presentation"
    >
      <Profile app={props.app} goToProfile={()=>toggleDrawer(side, false, '/app/profile')}/>
      <List>
        <Login app={props.app}/>
        <Divider />
          {props.menuList.map((item, index) => (
            <ListItem button key={item.route} onClick={toggleDrawer(side, false, item.route)} onKeyDown={toggleDrawer(side, false, item.route)}>
              <StyledIcon>{index % 2 === 0 ? <InboxIcon sx={{ color: "white" }}/> : <MailIcon sx={{ color: "white" }}/>}</StyledIcon>
              <ListItemText primary={item.display} />
            </ListItem>
          ))}
      </List>
    </HeaderDiv>
  );

  return (
    <div>
  	  <StyledIconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(state.drawerLocation, true)}>
        <MenuIcon sx={{ color: "white" }}/>
      </StyledIconButton>
      <Drawer anchor={state.drawerLocation} open={state[state.drawerLocation]} onClose={toggleDrawer(state.drawerLocation, false)} classes={{ paper: classes.drawerPaper  }}>
        {sideList(state[state.drawerLocation])}
      </Drawer>
    </div>
  );
}
