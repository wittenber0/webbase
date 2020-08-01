import React, { Component } from "react";
import { useAuth0 } from "./react-auth0-spa";
import NotFound from '../Pages/not-found';
import Loading from '../Pages/loading'
import AuthService from '../Shared/auth-service';

const PrivateRoute = ({ component: Component, userAccess, ...rest }) => {
  const { loading, isAuthenticated, loginWithRedirect, user } = useAuth0();
  if(!loading && user){
    return <LockedPage user={user} component={Component} userAccess={userAccess}/>
  }
  return <NotFound />
};

class LockedPage extends Component {

  constructor(props){
    super(props);
    this.state = {page: Loading};
  }

  componentDidMount() {
    AuthService.validate(this.props.user.sub, this.props.userAccess).then((r)=>{
      if (r) {
        this.setState({page: this.props.component})
      }else{
        this.setState({page: NotFound})
      }
    }).catch( (e) => {
      console.log(e);
      this.setState({page: NotFound})
    });
  }

  render() {
    let P = this.state.page
    return <P />
  }
}

export default PrivateRoute;
