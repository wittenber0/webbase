import React, { Fragment } from "react";
import Avatar from '@material-ui/core/Avatar';
import { useAuth0 } from "../../Auth/react-auth0-spa";
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Context from '../../Shared/app-context'

function Profile(props){
  let user = Context.user();
  let hasProfileAccess = user ? user.app_roles.filter( r => r.name === 'AppUser').length > 0 : null;
  if(user && hasProfileAccess){
    return (
      <Fragment>
        <ListItem button onClick={props.goToProfile()}>
          <ListItemIcon><Avatar src={user.picture}></Avatar></ListItemIcon>
          <ListItemText>{user.name}</ListItemText>
        </ListItem>
      </Fragment>
    );
  }else if (user){
    return (
      <Fragment>
        <ListItem>
          <ListItemIcon><Avatar src={user.picture}></Avatar></ListItemIcon>
          <ListItemText>{user.name}</ListItemText>
        </ListItem>
      </Fragment>
    );
  }else{
    return <div></div>;
  }
};

export default Profile;
