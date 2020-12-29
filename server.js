var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer((req, res) => {
    console.log((new Date()) + ' Received request for ' + request.url);
});

server.listen(8080, () => {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server,
    //autoAcceptConnections: false
});

wsServer.on('test', (req, res) => {
    res.send(Math.random())
});