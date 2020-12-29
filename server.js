var WebSocketServer = require('websocket').server;
var http = require('http');

let num = 0
var server = http.createServer((req, res) => {
    console.log((new Date()) + ' Received request for ' + req.url);
});

server.listen(8080, () => {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: true
});


wsServer.on('connect', (connection) => {
    console.log("connected")
    connection.send(num)
    connection.on('message',(m)=>{
        num=num+1
        connection.send(num)
    })
});


/*wsServer.on('request', (req,res)=>{
    res.send()
})*/