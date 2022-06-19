import request from 'request-promise'


let sysToken = '';

export const checkRoleForUser = async function (user, role) {
  return await exports.getUserRoles(user).then((roles) => {
    switch (role) {
      case 'profile':
        return (roles.filter(r => r.name === 'AppUser').length > 0 ? true : false)
      case 'admin':
        return (roles.filter(r => r.name === 'AppAdmin').length > 0 ? true : false)
      case 'arbitrage':
        return (roles.filter(r => r.name === 'ArbitrageUser').length > 0 ? true : false)
      default:
        return false;
    }
  })
}

export const getUserData = async function (user_id) {
  return await getUserFromServer(user_id);
};

export const getUserRoles = async function (user_id) {
  return await getUserRolesFromServer(user_id);
}

export const getAllAppRoles = async function (user_id) {
  return checkRoleForUser(user_id, 'admin').then(r => {
    if (r) {
      return getAllAppRolesFromServer().then(r => {
        return r;
      }).catch(() => {
        return [];
      })
    }
  }).catch(() => {
    console.log('failure');
    return [];
  });
}

export const getAllUsers = async function (user_id) {
  return checkRoleForUser(user_id, 'admin').then(r => {
    if (r) {
      return getAllUsersFromServer().then(users => {
        return Promise.all(users.map(u => {
          return new Promise((resolve, reject) => {
            getUserRolesFromServer(u.user_id).then(roles => {
              u.roles = roles;
              resolve(u);
            })
          })
        }))
      })
    }
  }).catch(e => {
    console.log('failed to authenticate');
    return [];
  });
}

export const getRoleUsers = async function (user_id) {
  return checkRoleForUser(user_id, 'admin').then(r => {
    if (r) {

      return getAllAppRolesFromServer().then(roles => {
        return Promise.all(roles.map(r => {
          return new Promise((resolve, reject) => {
            getAllUserForRoleFromServerSync(r.id).then(urs => {
              r.users = urs;
              resolve(r);
            });
          });
        }));
      }).catch(() => {
        return [];
      })
    }
  }).catch(() => {
    console.log('failure');
    return [];
  });
}

export const updateUserRoles = async function (user_id, role_list, viewer_user_id, to_remove) {
  return checkRoleForUser(viewer_user_id, 'admin').then(r => {
    if (r) {
      return updateUserRolesFromServer(user_id, role_list, to_remove).then(r => {
        return r;
      }).catch(() => {
        return [];
      })
    }
  }).catch(() => {
    console.log('failure');
    return [];
  });
}

export const updateUserMetaData = async function (user_id, user_metadata, viewer_user_id) {
  return checkRoleForUser(viewer_user_id, 'profile').then(r => {
    if (r) {
      return updateUserMetaDataFromServer(user_id, user_metadata).then(r => {
        return r;
      }).catch(() => {
        return [];
      })
    }
  }).catch(() => {
    console.log('failure');
    return [];
  });
}

const getUserFromServer = function (user_id) {
  let url = '/users/' + user_id;
  return getFromAuth0V2(url);
};

const getAllUsersFromServer = function () {
  let url = '/users';
  return getFromAuth0V2(url);
};

const getUserRolesFromServer = function (user_id) {
  let url = '/users/' + user_id + '/roles';
  return getFromAuth0V2(url);
};

const getAllAppRolesFromServer = function () {
  return getFromAuth0V2('/roles');
};

const getAllUserForRoleFromServerSync = function (role_id) {
  let url = '/roles/' + role_id + '/users';
  return getFromAuth0V2(url);
};

const updateUserRolesFromServer = function (user_id, role_list, to_remove) {
  let url = '/users/' + user_id + '/roles';
  let body = { roles: role_list };

  if (to_remove) {
    return deleteFromAuth0V2(url, body);
  } else {
    return postToAuth0V2(url, body);
  }
}

const updateUserMetaDataFromServer = function (user_id, user_metadata) {
  let url = '/users/' + user_id;
  let body = { user_metadata: user_metadata };
  return patchToAuth0V2(url, body);
}

const getFromAuth0V2 = function (route) {
  return getSysToken().then(() => {
    let options = {
      method: 'GET',
      url: 'https://ryanwwittenberg.auth0.com/api/v2' + route,
      headers:
      {
        'content-type': 'application/json',
        authorization: `Bearer ${sysToken}`
      }
    };
    return (request(options)
      .then(response => {
        return JSON.parse(response);
      }).catch(e => {
        console.log(e);
      }));
  });
}

const postToAuth0V2 = function (route, body) {
  return getSysToken().then(() => {
    let options = {
      method: 'POST',
      url: 'https://ryanwwittenberg.auth0.com/api/v2' + route,
      body: JSON.stringify(body),
      headers:
      {
        'content-type': 'application/json',
        authorization: `Bearer ${sysToken}`
      },
      resolveWithFullResponse: true
    };
    return (request(options)
      .then(response => {
        if (response.body) {
          return JSON.parse(response.body);
        } else if (Math.floor(response.statusCode / 100) === 2) {
          return true;
        } else {
          return false;
        }
      }).catch(e => {
        console.log(e);
        return false;
      }));
  });
}

const patchToAuth0V2 = function (route, body) {
  return getSysToken().then(() => {
    let options = {
      method: 'PATCH',
      url: 'https://ryanwwittenberg.auth0.com/api/v2' + route,
      body: JSON.stringify(body),
      headers:
      {
        'content-type': 'application/json',
        authorization: `Bearer ${sysToken}`
      },
      resolveWithFullResponse: true
    };
    return (request(options)
      .then(response => {
        if (response.body) {
          return JSON.parse(response.body);
        } else if (Math.floor(response.statusCode / 100) === 2) {
          return true;
        } else {
          return false;
        }
      }).catch(e => {
        console.log(e);
        return false;
      }));
  });
}

const deleteFromAuth0V2 = function (route, body) {
  return getSysToken().then(() => {
    let options = {
      method: 'DELETE',
      url: 'https://ryanwwittenberg.auth0.com/api/v2' + route,
      body: JSON.stringify(body),
      headers:
      {
        'content-type': 'application/json',
        authorization: `Bearer ${sysToken}`
      },
      resolveWithFullResponse: true
    };
    return (request(options)
      .then(response => {
        if (response.body) {
        } else if (Math.floor(response.statusCode / 100) === 2) {
          return true;
        } else {
          return false;
        }
      }).catch(e => {
        console.log(e);
        return false;
      }));
  });
}

const getSysToken = function () {
  let options = {
    method: 'POST',
    url: 'https://ryanwwittenberg.auth0.com/oauth/token',
    headers: { 'content-type': 'application/json' },
    body:
    {
      grant_type: 'client_credentials',
      client_id: 'yqN4d3JWsdMT4weRe86RiZmCc0CbbiJ7',
      client_secret: 'AjPwvWk6m5GTBBpip6gzr3d1M27SVALjtEgmg6q8g-ephczUE96Q-wqQr2llslD1',
      audience: 'https://ryanwwittenberg.auth0.com/api/v2/'
    },
    json: true
  };

  return request(options)
    .then(response => {
      sysToken = response['access_token'];
    });
};
