sysToken = '';

exports.checkRoleForUser = async function(user, role){
  return await exports.getUserRoles(user).then((roles) => {
    switch(role){
      case 'profile':
        return (roles.filter(r => r.name === 'AppUser').length > 0 ? true : false)
        break;
      case 'admin':
        return (roles.filter(r => r.name === 'AppAdmin').length > 0 ? true : false)
      default:
        return false;
    }
  })
}

exports.getUserData = async function(user_id) {
  return await getUserFromServer(user_id);
};

exports.getUserRoles = async function(user_id) {
  console.log(user_id)
  return await getUserRolesFromServer(user_id);
}

exports.getAllAppRoles = async function(user_id){
  return exports.checkRoleForUser(user_id, 'admin').then( r => {
    if(r){
      return getAllAppRolesFromServer().then( r =>{
        return r;
      }).catch(()=>{
        return [];
      })
    }
  }).catch(() => {
    console.log('failure');
    return [];
  });
}

exports.getAllUsers = async function(user_id){
  return exports.checkRoleForUser(user_id, 'admin').then( r => {
    if(r){
      return getAllUsersFromServer().then( users => {
        console.log(users);
        return Promise.all(users.map( u => {
          return new Promise((resolve, reject) => {
            getUserRolesFromServer(u.user_id).then( roles => {
              u.roles = roles;
              resolve(u);
            })
          })
        }))
      })
    }
  }).catch( e => {
    console.log('failed to authenticate');
    return [];
  });
}

exports.getRoleUsers = async function(user_id){
  return exports.checkRoleForUser(user_id, 'admin').then( r => {
    console.log("roles");
    if(r){

      return getAllAppRolesFromServer().then( roles =>{
        return Promise.all(roles.map( r => {
          return new Promise((resolve, reject) => {
            getAllUserForRoleFromServerSync(r.id).then( urs => {
              r.users = urs;
              resolve(r);
            });
          });
        }));
      }).catch(()=>{
        return [];
      })
    }
  }).catch(() => {
    console.log('failure');
    return [];
  });
}

getUserFromServer = function(user_id){
  let url = '/users/'+user_id;
  return getFromAuth0V2(url);
};

getAllUsersFromServer = function(){
  let url = '/users';
  return getFromAuth0V2(url);
};

getUserRolesFromServer = function(user_id){
  let url = '/users/'+user_id+'/roles';
  return getFromAuth0V2(url);
};

getAllAppRolesFromServer = function(){
  return getFromAuth0V2('/roles');
};

getAllUserForRoleFromServerSync = function(role_id){
  let url = '/roles/'+role_id+'/users';
  return getFromAuth0V2(url);
};

getFromAuth0V2 = function(route){
  return getSysToken().then(()=>{
    let request = require("request-promise");
    let options = {
        method: 'GET',
        url: 'https://ryanwwittenberg.auth0.com/api/v2'+route,
        headers:
            {
                'content-type': 'application/json',
                authorization: `Bearer ${sysToken}`
            }
    };
    return (request(options)
        .then(response => {
            return JSON.parse(response);
        }).catch( e => {
          console.log(e);
        }));
  });
}

getSysToken = function(){
    let request = require("request-promise");

    let options = { method: 'POST',
        url: 'https://rwwittenberg.auth0.com/oauth/token',
        headers: { 'content-type': 'application/json' },
        body:
            { grant_type: 'client_credentials',
                client_id: 'yqN4d3JWsdMT4weRe86RiZmCc0CbbiJ7',
                client_secret: 'AjPwvWk6m5GTBBpip6gzr3d1M27SVALjtEgmg6q8g-ephczUE96Q-wqQr2llslD1',
                audience: 'https://ryanwwittenberg.auth0.com/api/v2/'},
        json: true };

    return request(options)
     .then(response => {
            sysToken = response['access_token'];
        });
};
