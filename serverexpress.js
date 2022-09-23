const express = require('express')
const bodyParser = require('body-parser');
const path = require('path');
const auth = require('./serverAuth.js');
let port = process.env.PORT;
if (port == null || port == "") {
  port = 4000;
}


const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/******************************************************************************
*********************************ENDPOINTS*************************************
******************************************************************************/
app.get('/', (req, res) => {
  res.redirect('/app');
})

app.get('/index.js', (req, res) => {
   res.sendFile(path.join(__dirname + '/client/public/index.js'));
})

app.post('/auth', (req, res) => {
  auth.checkRoleForUser(req.body.user, req.body.role).then( v => {
    res.send(v);
  }).catch(()=>{
    res.send(false);
  })
})

app.get('/usercontext', (req, res) => {
  console.log('Usercontext for ' + req.query.id);
  auth.getUserData(req.query.id).then(u => {
    auth.getUserRoles(req.query.id).then(roles => {
      u.roles = roles;
      res.send(u);
    });
  }).catch((e)=>{
    console.log(e);
    console.log('failed somewhere in here')
    res.send({});
  });
});

app.post('/approles', (req, res) => {
  auth.getAllAppRoles(req.body.user).then( v => {
    res.send(v);
  }).catch(()=>{
    res.send(false);
  })
})

app.post('/roleusers', (req, res) => {
  auth.getRoleUsers(req.body.user).then( v => {
    res.send(v);
  }).catch(()=>{
    res.send(false);
  })
});

app.post('/appusers', (req, res) => {
  auth.getAllUsers(req.body.user).then( v => {
    res.send(v);
  }).catch(()=>{
    res.send(false);
  })
});

app.post('/users/:user/roles', (req, res) => {
  console.log("Updating roles for "+ req.params.user);
  auth.updateUserRoles(req.params.user, req.body.roles, req.body.user, req.body.removeInd).then( v => {
    res.send(v);
  }).catch(()=>{
    res.send(false);
  })
})

app.post('/users/:user/arbitrage/myBooks', (req, res) => {
  auth.getUserData(req.body.user).then(u => {
    if(!u.user_metadata.arbitrage){
      u.user_metadata.arbitrage = {};
    }
    u.user_metadata.arbitrage.myBooks = req.body.myBooks;
    console.log("Updating arbitrage books for "+ req.params.user);
    auth.updateUserMetaData(req.params.user, u.user_metadata, req.body.user).then( v => {
      res.send(v);
    }).catch(()=>{
      res.send(false);
    })

  }).catch(()=>{
    console.log('failed to get context')
    res.send({});
  });
  
})

if (process.env.NODE_ENV === 'production') {
  // Exprees will serve up production assets
  app.use(express.static('client/build'));

  // Express serve up index.html file if it doesn't recognize route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}



/******************************************************************************
***********************************CALLS***************************************
******************************************************************************/


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
