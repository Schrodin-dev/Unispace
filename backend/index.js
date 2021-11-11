const http = require('http');
const app = require('./app');

app.set('port', 3000);
let server = http.createServer(app);

server.listen(3000);