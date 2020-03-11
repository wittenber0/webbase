const express = require('express')
const app = express()
const port = 8080
const path = require('path');


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

app.get('/auth', (req, res) => {
  console.log(req.query);
  code = req.query.code;
   res.sendFile(path.join(__dirname + '/client/public/index.html'));
})


/******************************************************************************
***********************************CALLS***************************************
******************************************************************************/


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
