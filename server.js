var WebSocketServer = require('websocket').server;
var http = require('http');
const events = require('events')
const eventEmitter = new events.EventEmitter();

eventEmitter.setMaxListeners(20)

var num = 0

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
    //eventEmitter.on('send',()=>connection.send(num))
    //connection.send(num)
    eventEmitter.on('update',()=>connection.send(JSON.stringify({action:'players',payload:players})))
    eventEmitter.on('update_players',(player)=>connection.send(JSON.stringify({action:'update_players',payload:player})))
    eventEmitter.on('update_progress',(player)=>connection.send(JSON.stringify({action:'update_progress',payload:players})))
    eventEmitter.on('update_name',(player)=>connection.send(JSON.stringify({action:'update_name',payload:{id:player.id,name:player.name}})))
    eventEmitter.on('start',()=>connection.send(JSON.stringify({action:'start',payload:''})))

    connection.on('message',(m)=>{
        m = JSON.parse(m.utf8Data)
        const {action,payload} = m
        switch(action){
            case("init_game"):
                var host = new Player(1,payload.name,true,0,0)
                players.push(host)
                connection.send(JSON.stringify({action:'init_game_confirmation',payload:{player:host}})) 
                break;
            case("join_game"):
                const name = payload.name?payload.name:"Guest "+(players.length+1)
                const id = players.length+1
                if(id==1){
                    var player = new Player(id,name,true,0,0)
                    players.push(player)
                    connection.send(JSON.stringify({action:'init_game_confirmation',payload:id}))     
                }else{
                    var player = new Player(id,name,false,0,0)
                    players.push(player)
                    //connection.send(JSON.stringify({action:'players',payload:players}))
                    connection.send(JSON.stringify({action:'join_confirmation',payload:id}))
                    connection.send(JSON.stringify({action:'players',payload:players}))
                    eventEmitter.emit('update_players',player)  
                }
                break;  
                
            case("update_progress"):
                console.log(payload.id)   
                //const idx = players.findIndex(p=>p.id==payload.id)
                players[payload.id-1].progress = payload.progress
                //players[idx].wpm = payload.wpm
                eventEmitter.emit('update_progress')
                break;
            case("change_name"):
                console.log(payload.id)
                players[payload.id-1].name = payload.name
                eventEmitter.emit('update_name',players[payload.id-1])
                break;
            case("start"):
                eventEmitter.emit('start')
                break;
        }
        //num=num+1
        //eventEmitter.emit('send')
        //connection.send(num)
    })
});

var players = []

class Player {
    constructor(id,name,isHost,progress,wpm){
        this.id = id
        this.name = name
        this.isHost = isHost
        this.progress = progress
        this.wpm = wpm
    }
}

/*wsServer.on('request', (req,res)=>{
    res.send()
})*/