var WebSocketServer = require('websocket').server;
var http = require('http');

let num 
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
    connection.on('message',(m)=>{
        console.log(m)
    })
});


/*wsServer.on('request', (req,res)=>{
    res.send()
})*/