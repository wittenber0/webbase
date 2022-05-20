import App from '../App';
import UtilityService from './utility-service';
const fetch = require('node-fetch');


class AuthService{
  static validate = async function(userId:string, role:any) {
    const body = {
      'user': userId,
      'role': role
    };
    return await fetch('/auth', { method: 'post', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }})
    .then((res:any)=>{
      return(res.json());
    }).then((json:any)=> {
      return(json)
    }).catch(()=>{
      return(false);
    });
  }

  static userContextGet = async function(userId:string){
    return UtilityService.get('/usercontext?id='+userId);
  }

  static getAllAppRoles = async function(userId:string) {
    const body = {
      'user': userId
    };
    return await fetch('/approles', { method: 'post', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }})
    .then((res:any)=>{
      return(res.json());
    }).then((json:any)=> {
      return(json)
    }).catch(()=>{
      return(false);
    });
  }

  static getAppUsers = async function(userId:string) {
    return UtilityService.post('/appusers');
  }

  static updateUserRoles = async function(userId:string, roleList:any, removeInd: Boolean){
    return UtilityService.post('/users/'+userId+'/roles', {user: App.user().user_id, roles: roleList, removeInd: removeInd });
  }
}

export default AuthService;
