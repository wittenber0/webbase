import React, { Component } from 'react';
import ButtonAppBar from './Functions/AppBar/app-bar';
import { Route } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

//Auth
import PrivateRoute from './Auth/private-route';

//Pages
import About from './Pages/about';
import Binance from './Pages/binanceAPI';
import Home from './Pages/home';
import MyProfile from './Pages/my-profile';
import Admin from './Pages/admin';
import Callback from './Pages/login-callback'
import NFTs from './Pages/nfts'

const styles = theme => ({
  // Load app bar information from the theme
  toolbar: theme.mixins.toolbar,
});

class App extends Component{

  constructor(props){
    super(props);
    this.state = {usercontext : App.user()}
  }

  static user(){
    return window.sessionStorage.user_context ? JSON.parse(window.sessionStorage.user_context) : null;
  }

  static userHasRoleFromCache(role){
    if(App.user() && App.user().roles){
      return App.user().roles.filter( r => r.name === role).length > 0;
    }else{
      return false;
    }
  }

  getUser(){
    return this.state.usercontext;
  }

  clearUserCache(){
    window.sessionStorage.clear();
    this.setState({usercontext: null})
  }

  cacheUser(u){
    window.sessionStorage.setItem('user_context', JSON.stringify(u));
    this.setState({usercontext: App.user()})
  }

  updateMyRoles(roles){
    let u = this.state.usercontext;
    u.roles = roles;
    this.cacheUser(u);
  }

  userHasRole(role){
    if(this.state.usercontext && this.state.usercontext.roles){
      return this.state.usercontext.roles.filter( r => r.name === role).length > 0;
    }else{
      return false;
    }
  }

  render(){
    const {classes} = this.props;
    return (
      <div>
        <ButtonAppBar history={this.props.history} app={this}></ButtonAppBar>
        <div className={classes.toolbar} />
          <div>
            <Route path="/app/about" component={About} />
            <Route path="/app/nfts" component={NFTs} />
            <Route path="/app/profile"><PrivateRoute component={MyProfile} userAccess='profile'></PrivateRoute></Route>
            <Route path="/app/admin"><PrivateRoute component={Admin} userAccess='admin' app={this}></PrivateRoute></Route>
            <Route path="/app/binance"><PrivateRoute component={Binance} userAccess='admin' app={this}></PrivateRoute></Route>
            <Route exact path="/callback"><Callback app={this}/></Route>
            <Route exact path="/app" component={Home} />
            <Route exact path="/" component={Callback} />
          </div>
      </div>
    )
  }
}

export default withStyles(styles)(App);
