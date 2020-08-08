const fetch = require('node-fetch');

exports.validate = async function(userId, task) {
  const body = {
    'user': userId,
    'role': task
  };
  return await fetch('/auth', { method: 'post', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }})
  .then(res=>{
    console.log(res.body);
    return(res.json());
  }).then((json)=> {
    return(json)
  }).catch(()=>{
    return(false);
  });
}

exports.userContextGet = async function(userId){
  return await fetch('/usercontext?id='+userId)
  .then(res=>{
    console.log(res.body);
    return(res.json());
  }).then((json)=> {
    return(json)
  }).catch(()=>{
    return(false);
  });
}
