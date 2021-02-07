var http = require('http');
var express = require('express');
var path = require('path');
var GameServer = require('./server').GameServer;
var WebSocketRequest = require('websocket').request;
const config = require('./serverConfig').config;

var httpServer = http.createServer()

httpServer.listen(9000, () => {
    console.log((new Date()) + ' Server is listening on port 9000');
});

var gameServerPool = []
//add event to reset server completely when all players leave
for(var i=0;i<5;i++){
    gameServerPool.push(new GameServer())
}

var app = express();

/*app.use((req,res,next)=>{
    console.log(req._parsedUrl.pathname)
    next()
})*/

app.get('/typing-game',(req,res)=>{
    res.sendFile(path.join(__dirname,'../screens/splash/splash.html'));
})

app.get('/typing-game/splash.js',(req,res)=>{
    res.sendFile(path.join(__dirname,'../screens/splash/splash.js'))
})

app.get('/typing-game/splash.css',(req,res)=>{
    res.sendFile(path.join(__dirname,'../screens/splash/splash.css'))
})

app.get('/typing-game/game.html',(req,res)=>{
    res.sendFile(path.join(__dirname,'../screens/game/game.html'))
})

app.get('/typing-game/game.js',(req,res)=>{
    res.sendFile(path.join(__dirname,'../screens/game/game.js'))
})

app.get('/typing-game/game.css',(req,res)=>{
    res.sendFile(path.join(__dirname,'../screens/game/game.css'))
})

//make separate host and player html files (can be pretty much identical). Send host game file and set server status to 1.
//Add server index to a queue and give the next websocket host request the server at the head of the queue in onupgrade

//^actually they can probably just have the same html files, what separates them is the url they request with. Get url from url bar in the game.js script and append to initial ws request
//parse the url in onupgrade, and then do above or below

//For players, send them the game html and get the game code from the url when they try to connect to the socket
var serverIdxStack = []
app.get('/host',(req,res)=>{
    var s = false
    var i = 0
    while(i<gameServerPool.length && s==false){
        if(gameServerPool[i].status==0){
            serverIdxStack.push(i)
            res.sendFile(path.join(__dirname,'../screens/game/game.html'))
            s = true
        }
        i++
    }
    if(!s){
        res.status(503).send("No servers available")
    }
})

app.get('/test.js',(req,res)=>{
    res.sendFile(path.join(__dirname,'../screens/splash/test.js'))
})

app.get('/join', (req,res)=>{
    res.sendFile(path.join(__dirname,'../screens/game/game.html'))
})

//add id from cookie onto connection
httpServer.on('upgrade',(request, socket)=>{
    //console.log("Request",request.url,request.headers.cookie)
    const url = new URL(request.headers.origin+request.url)
    //console.log(url.pathname)
    //console.log(url.searchParams.get("code"))

    //get cookies from wsRequest object
    const wsRequest = new WebSocketRequest(socket,request,config)

    try{
        var serverIdx
        if(url.pathname=="/join/"){
            const code = url.searchParams.get("code")
            serverIdx = gameServerPool.findIndex(s=>s.code==code)
            if(serverIdx==-1){throw "Game not found"}
        }
        else if(url.pathname=="/host"){
            serverIdx = serverIdxStack.pop()
            if(serverIdx==undefined){throw "No servers available"}
        }else{
            throw "Wrong pathname"
        }    

        wsRequest.readHandshake()
        var connection = wsRequest.accept(wsRequest.requestedProtocols[0], wsRequest.origin)
        gameServerPool[serverIdx].addConnection(connection)
    }catch(e){
        wsRequest.reject()
        console.log(e)
        return
    }
})

app.listen(80)
