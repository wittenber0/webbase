import App from '../App';
const fetch = require('node-fetch');

class AuthService{
  static validate = async function(userId, task) {
    const body = {
      'user': userId,
      'role': task
    };
    return await fetch('/auth', { method: 'post', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }})
    .then(res=>{
      return(res.json());
    }).then((json)=> {
      return(json)
    }).catch(()=>{
      return(false);
    });
  }

  static userContextGet = async function(userId){
    return this.get('/usercontext?id='+userId);
  }

  static getAllAppRoles = async function(userId) {
    const body = {
      'user': userId
    };
    return await fetch('/approles', { method: 'post', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }})
    .then(res=>{
      return(res.json());
    }).then((json)=> {
      return(json)
    }).catch(()=>{
      return(false);
    });
  }

  static getAppUsers = async function(userId) {
    return this.post('/appusers');
  }

  static get = async function(route){
    return await fetch(route)
    .then(res=>{
      return(res.json());
    }).then((json)=> {
      return(json)
    }).catch(()=>{
      return(false);
    });
  }

  static post = async function(route, body){
    if(!body){
      body = {
        'user': App.user().user_id
      };
    }
    return await fetch(route, { method: 'post', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }})
    .then(res=>{
      return(res.json());
    }).then((json)=> {
      return(json)
    }).catch(()=>{
      return(false);
    });
  }
}

export default AuthService;
