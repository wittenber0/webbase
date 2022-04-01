import React, { Component } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import Loading from './loading'
import history from '../Shared/browser-history';
import AuthService from '../Shared/auth-service';

export default function Callback(props) {
  const { isLoading, user, isAuthenticated } = useAuth0();
  if(!isLoading){
    return <LoginCallbackPage user={user} app={props.app}/>
  }
  return <Loading />
};

class LoginCallbackPage extends Component{

  componentDidMount(){
    if(this.props.user){
      AuthService.userContextGet(this.props.user.sub).then(r => {
        this.props.app.cacheUser(r);
        history.push('/app');
      }).catch(() =>{
        history.push('/app');
      });
    }else{
      history.push('/app');
    }
  }

	render(){
		return(
			<Loading />
		)
	}
}
