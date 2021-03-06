import React, { Fragment } from "react";
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import App from '../../App';

function Profile(props){
  let user = App.user();
  if(user && props.app.userHasRole('AppUser')){
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
