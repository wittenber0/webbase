sysToken = '';
recentUsers = {};
users = []

exports.checkRoleForUser = async function(user, role){
  return await exports.getUserRoles(user).then((roles) => {
    switch(role){
      case 'Profile':
        console.log('profile...')
        return (roles.filter(r => r.name === 'AppUser').length > 0 ? true : false)
        break;
      default:
        return false;
    }
  })
}

exports.getUserData = async function(user_id) {
    if(!recentUsers.hasOwnProperty(user_id)) {
        recentUsers[user_id] = await getUserFromServer(user_id);
    }
    return recentUsers[user_id];
};

exports.getUserRoles = async function(user_id) {
  console.log(user_id)
  return await getUserRolesFromServer(user_id);
}

getUserFromServer = function(user_id){
    return exports.getSysToken().then(() => {
        let request = require("request-promise");
        let options = {
            method: 'GET',
            url: 'https://ryanwwittenberg.auth0.com/api/v2/users/' + user_id,
            //qs: {fields: 'app_metadata', include_fields: 'true'},
            headers:
                {
                    'content-type': 'application/json',
                    authorization: `Bearer ${sysToken}`
                }
        };
        return (request(options)
            .then(response => {
                console.log('response:')
                return JSON.parse(response);
            }));
    });
};

getUserRolesFromServer = function(user_id){
    return exports.getSysToken().then(() => {
        let request = require("request-promise");
        let options = {
            method: 'GET',
            url: 'https://ryanwwittenberg.auth0.com/api/v2/users/' + user_id + '/roles',
            //qs: {fields: 'app_metadata', include_fields: 'true'},
            headers:
                {
                    'content-type': 'application/json',
                    authorization: `Bearer ${sysToken}`
                }
        };
        return (request(options)
            .then(response => {
                return JSON.parse(response);
            }));
    });
};

exports.getSysToken = function(){
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

exports.getUsers = () => {
    let request = require("request-promise");
    let options = {
        method: 'GET',
        url: 'https://ryanwwittenberg.auth0.com/api/v2/users',
        headers:
            {
                'content-type': 'application/json',
                authorization: `Bearer ${sysToken}`
            }
    };
    console.log('[auth] Getting all users');
    return (request(options)
        .then(response => {
            console.log(response);
            //res.status(200).send(response);
        }).catch(error => {
            console.log('[auth] 500 ' + error);
            //res.status(500).send(error);
        }));
};

exports.updateUser = (req, res) => {
    let request = require("request-promise");
    let options = {
        method: 'PATCH',
        url: `https://ryanwwittenberg.auth0.com/api/v2/users/${req.body.user_id}`,
        headers:
            {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sysToken}`
            },
        body: `{"app_metadata":{"level":"${req.body.newLevel}"}}`
    };
    console.log('[auth] Updating user ' + JSON.stringify(req.body));
    return request(options)
        .then(response => {
            console.log('[auth] Success');
            recentUsers[req.body.user_id] = req.body.newLevel;
            res.status(200).send(response);
        }).catch(error => {
            console.log('[auth] 500 ' + error);
            res.status(500).send(error);
        });
};
