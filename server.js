const http = require('http');
const app = require('./app');
//This is how we call and import a file yan yung app.js

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port);

