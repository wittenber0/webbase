import React, { Component } from 'react';
import ButtonAppBar from './Functions/AppBar/app-bar';
import { Route, Router } from 'react-router-dom';

//Auth
import PrivateRoute from './Auth/private-route';

//Pages
import About from './Pages/about';
import Home from './Pages/home';
import MyProfile from './Pages/my-profile';
import Admin from './Pages/admin';
import NotFound from './Pages/not-found';
import Callback from './Pages/login-callback'

class App extends Component{

  constructor(props){
    super(props);
    this.state = {usercontext : App.user()}
  }

  static user(){
    return window.sessionStorage.user_context ? JSON.parse(window.sessionStorage.user_context) : null;
  }

  getUser(){
    return window.sessionStorage.user_context ? JSON.parse(window.sessionStorage.user_context) : null;
  }

  clearUserCache(){
    window.sessionStorage.clear();
    this.setState({usercontext: null})
  }

  cacheUser(u){
    window.sessionStorage.setItem('user_context', JSON.stringify(u));
    this.setState({usercontext: App.user()})
  }

  static userHasRole(role){
    if(App.user() && App.user().app_roles){
      return App.user().app_roles.filter( r => r.name === role).length > 0;
    }else{
      return false;
    }
  }

  render(){
    return (
      <div className={"App-header"}>
        <ButtonAppBar history={this.props.history} app={this}></ButtonAppBar>
          <div>
            <Route path="/app/about" component={About} />
            <Route path="/app/profile"><PrivateRoute component={MyProfile} userAccess='profile'></PrivateRoute></Route>
            <Route path="/app/admin"><PrivateRoute component={Admin} userAccess='admin'></PrivateRoute></Route>
            <Route exact path="/callback"><Callback app={this}/></Route>
            <Route exact path="/app" component={Home} />
            <Route exact path="/" component={Callback} />
          </div>
      </div>
    )
  }
}

export default App;
