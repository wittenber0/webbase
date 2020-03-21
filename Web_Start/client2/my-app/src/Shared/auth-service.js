const fetch = require('node-fetch');

exports.validate = async function(userId, task) {
  console.log(userId);
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
