import React, { Fragment } from "react";
import Avatar from '@material-ui/core/Avatar';
import { useAuth0 } from "./react-auth0-spa";
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

function Profile(props){
  const { loading, user, isAuthenticated } = useAuth0();

  if (loading || !user) {
    return <div></div>;
  }


  return (
    <Fragment>
      <ListItem button onClick={props.goToProfile()}>
        <ListItemIcon><Avatar src={user.picture}></Avatar></ListItemIcon>
        <ListItemText>{user.name}</ListItemText>
      </ListItem>
    </Fragment>
  );
};

export default Profile;
