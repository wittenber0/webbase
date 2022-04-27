import React, { Fragment } from "react";
import { Avatar, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import App from '../../App';

type Props = {
  goToProfile: any,
  app: any
}

function Profile(props: Props){
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
