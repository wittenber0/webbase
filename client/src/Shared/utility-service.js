import App from '../App';
const fetch = require('node-fetch');

class UtilityService{
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

  static post = async function(route, body, headers){
    if(!body){
      body = {
        'user': App.user().user_id
      };
    }
    if(!headers){
      headers = { 'Content-Type': 'application/json' }
    }
    return await fetch(route, { method: 'post', body: JSON.stringify(body), headers: headers})
    .then(res=>{
      return(res.json());
    }).then((json)=> {
      return(json)
    }).catch(()=>{
      return(false);
    });
  }

}
export default UtilityService;
