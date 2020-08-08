const express = require('express')
const bodyParser = require('body-parser');
const port = 4000
const path = require('path');
const auth = require('./serverAuth.js');


const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/******************************************************************************
*********************************ENDPOINTS*************************************
******************************************************************************/
app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname + '/client/public/index.html'));
})

app.get('/index.js', (req, res) => {
  console.log('called')
   res.sendFile(path.join(__dirname + '/client/public/index.js'));
})

app.post('/auth', (req, res) => {
  console.log(req.body);
  auth.checkRoleForUser(req.body.user, req.body.role).then( v => {
    console.log('sending... '+ v)
    res.send(v);
  }).catch(()=>{
    res.send(false);
  })
})

app.get('/usercontext', (req, res) => {
  console.log('usercontext for ' + req.query.id);
  res.send(true);
});



/******************************************************************************
***********************************CALLS***************************************
******************************************************************************/


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
