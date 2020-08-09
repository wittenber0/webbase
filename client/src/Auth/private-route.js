import React, { Component } from "react";
import { useAuth0 } from "./react-auth0-spa";
import NotFound from '../Pages/not-found';
import Loading from '../Pages/loading'
import AuthService from '../Shared/auth-service';
import Context from '../Shared/app-context'

class PrivateRoute extends Component {

  constructor(props){
    super(props);
    this.state = {page: Loading};
  }

  componentDidMount() {
    AuthService.validate(Context.user().user_id, this.props.userAccess).then((r)=>{
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
