//Here i will set up all code to spin up my server
const http = require('http');
const app = require('./app');
//ENVironment variable , this is set on the server you deploy on,
// you set it on
const port = process.env.PORT || 3000
//parse a listener, a function excecuted whenever there is a new request
//which in turn responds
const server = http.createServer(app);
server.listen(port);