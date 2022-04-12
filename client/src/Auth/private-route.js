import React, { Component } from "react";
import NotFound from '../Pages/not-found';
import Loading from '../Pages/loading'
import AuthService from '../Shared/auth-service';
import App from '../App'

class PrivateRoute extends Component {

  constructor(props){
    super(props);
    this.state = {page: Loading};
  }

  componentDidMount() {
    AuthService.validate(App.user().user_id, this.props.userAccess).then((r)=>{
      if (r) {
        this.setState({page: this.props.component})
      }else{
        this.setState({page: NotFound})
      }
    }).catch( (e) => {
      this.setState({page: NotFound})
    });
  }

  render() {
    let P = this.state.page
    if(this.props.app){
      return <P app={this.props.app}/>
    }else{
      return <P />
    }
  }
}

export default PrivateRoute;
