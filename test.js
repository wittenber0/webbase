const auth = require('./serverAuth');

//auth.getSysToken().then(()=>auth.getUsers());

auth.getUserRoles('auth0|5e63c530c6dbc90d3de1880f').then((r) => console.log(r));