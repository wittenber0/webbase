var http = require('http');

http.createServer(function (req, res) {
  if (req.method === "POST") {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
      console.log(body);
      res.end('ok');
    });
  } else {
    console.log('get')
    res.write('Hello World!'); //write a response to the client
    res.send(); //end the response
  }

}).listen(8080); //the server object listens on port 8080
