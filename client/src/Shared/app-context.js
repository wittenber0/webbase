import React, { Component } from 'react'
/*const Context = {
  user : window.sessionStorage.user_context ? JSON.parse(window.sessionStorage.user_context) : null
}*/

class Context extends Component{
  static user(){
    return window.sessionStorage.user_context ? JSON.parse(window.sessionStorage.user_context) : null;
  }

  static clearUserCache(){
    window.sessionStorage.clear();
  }

  static cacheUser(u){
    window.sessionStorage.setItem('user_context', JSON.stringify(u));
  }
}

export default Context;
