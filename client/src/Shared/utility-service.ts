import App from '../App';
const fetch = require('node-fetch');

class UtilityService{
  static get = async function(route:string, options?:any){
    return await fetch(route, options)
    .then((res:any)=>{
      return(res.json());
    }).then((json:any)=> {
      return(json)
    }).catch(()=>{
      return(false);
    });
  }

  static post = async function(route:string, body?:any, headers?:any){
    if(!body){
      body = {
        'user': App.user().user_id
      };
    }
    if(!headers){
      headers = { 'Content-Type': 'application/json' }
    }
    return await fetch(route, { method: 'post', body: JSON.stringify(body), headers: headers})
    .then((res:any)=>{
      return(res.json());
    }).then((json:any)=> {
      return(json)
    }).catch(()=>{
      return(false);
    });
  }

}
export default UtilityService;
