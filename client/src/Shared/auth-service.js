import App from '../App';
import UtilityService from './utility-service';
const fetch = require('node-fetch');


class AuthService{
  static validate = async function(userId, role) {
    const body = {
      'user': userId,
      'role': role
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
    return UtilityService.get('/usercontext?id='+userId);
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
    return UtilityService.post('/appusers');
  }

  static updateUserRoles = async function(userId, roleList, removeInd){
    return UtilityService.post('/users/'+userId+'/roles', {user: App.user().user_id, roles: roleList, removeInd: removeInd });
  }
}

export default AuthService;
