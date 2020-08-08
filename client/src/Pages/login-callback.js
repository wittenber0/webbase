import React, { Component } from 'react';
import { useAuth0 } from "../Auth/react-auth0-spa";
import PageBlock from '../components/page-block';
import Loading from './loading'
import history from '../Shared/browser-history';
import AuthService from '../Shared/auth-service';

export default function Callback() {
  const { loading, isAuthenticated, loginWithRedirect, user } = useAuth0();
  if(!loading){
    return <LoginCallbackPage user={user} />
  }
  return <Loading />
};

class LoginCallbackPage extends Component{

  constructor(props){
		super(props);
	}

  componentDidMount(){
    console.log(this.props.user);
    AuthService.userContextGet(this.props.user.sub).then(r => {
      console.log(r);
      history.push('/app');
    }).catch(() =>{
      console.log("fail");
      history.push('/app');
    });

  }

	render(){
		return(
			<Loading />
		)
	}
}
