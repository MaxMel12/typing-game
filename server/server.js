var WebSocketServer = require('websocket').server;
var http = require('http');
const events = require('events')
const eventEmitter = new events.EventEmitter();

eventEmitter.setMaxListeners(20)

var num = 0
var game
var status = 0

var server = http.createServer((req, res) => {
    console.log((new Date()) + ' Received request for ' + req.url);
});

server.listen(9000, () => {
    console.log((new Date()) + ' Server is listening on port 9000');
});

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: true
});

var connections = []

class GameServer {
    constructor(){
        this.code = ''
        this.game = new Game()
        this.status = 0
        this.wss = new WebSocketServer()

        this.wss.on('connect'), (connection) => {
            this.bindEvents(connection)

            connection.on('message', (message)=>{
                this.handleRequest(message)
            })

            connection.on('close', (connection)=>{
                this.close(connection)
            })
        }
    }

    bindEvents(connection){
        eventEmitter.on('update',()=>this.send(connection, 'players', game.players))
        eventEmitter.on('update_players',(player)=>this.send(connection,'update_players',player))
        eventEmitter.on('update_progress',(player)=>this.send(connection,'update_progress',player))
        eventEmitter.on('update_name',(player)=>this.send(connection,'update_name',{id:player.id,name:player.name}))
        eventEmitter.on('start',()=>this.send(connection,'start'))
        eventEmitter.on('remove_player',(id)=>this.send(connection,'remove_player',id))
        eventEmitter.on('end_game',()=>this.send(connection,'end_game'))
    }

    close(connection){
        eventEmitter.emit('remove_player', connection.id)
        game.players[idx].active = 0
    }

    genGameCode(){
        const length = 5
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    genPlayerId(){
        const genId = Math.floor(Math.random()*9999)
        return genId
    }

    send(connection, action, payload){
        connection.send(JSON.stringify({action:action,payload:payload}))
    }

    addConnection(connection){
        this.wss.handleRequestAccepted(connection)
    }

    handleRequest(message){
        message = JSON.parse(m.utf8Data)
        const {auth,action,payload} = message
        switch(action){
            case("join_game"):
                const id = auth ? auth: genPlayerId()
                const name = payload.name ? payload.name:"Guest "+id

                var player
                if(!this.game.players.length){
                    player = new Player(id,name,true,0,0)
                    this.send(connection,'set_host')
                }else{
                    player = new Player(id,name,false,0,0)
                }
                this.game.players.push(player)

                connection.id = id
                this.connections.push(connection)
                this.send(connection,'join_confirmation',{id:id,game:game})
                eventEmitter.emit('update_players',player)  
                break;      
            case("update_progress"): 
                const prog_idx = this.game.players.findIndex(p=>p.id==auth)
                this.game.players[prog_idx].progress = payload
                //players[prog_idx].wpm = payload.wpm
                eventEmitter.emit('update_progress',game.players[prog_idx])
                break;
            case("change_name"):
                const name_idx = this.game.players.findIndex(p => p.id==payload.id)
                game.players[name_idx].name = payload.name
                eventEmitter.emit('update_name',game.players[name_idx])
                break;
            case("start"):
                const p = game.players.find(p => p.id==auth)
                if(p.isHost){
                    eventEmitter.emit('start')
                    setTimeout(
                        ()=>eventEmitter.emit('end_game'),
                        game.time_limit*1000
                    )
                }else{
                    this.send(connection,'error','You are not the host!')
                }           
                break;
        }
    }
}

wsServer.on('connect', (connection) => {
    //eventEmitter.on('send',()=>connection.send(num))
    //connection.send(num)
    eventEmitter.on('update',()=>connection.send(JSON.stringify({action:'players',payload:game.players})))
    eventEmitter.on('update_players',(player)=>connection.send(JSON.stringify({action:'update_players',payload:player})))
    eventEmitter.on('update_progress',(player)=>connection.send(JSON.stringify({action:'update_progress',payload:player})))
    eventEmitter.on('update_name',(player)=>connection.send(JSON.stringify({action:'update_name',payload:{id:player.id,name:player.name}})))
    eventEmitter.on('start',()=>connection.send(JSON.stringify({action:'start',payload:''})))
    eventEmitter.on('remove_player',(id)=>connection.send(JSON.stringify({action:'remove_player',payload:id})))
    eventEmitter.on('end_game',()=>connection.send(msg('end_game')))

    connection.on('message',(m)=>{
        m = JSON.parse(m.utf8Data)
        const {auth,action,payload} = m
        switch(action){
            case("join_game"):
                const id = genPlayerId()
                const name = payload.name?payload.name:"Guest "+id

                var player
                if(!game.players.length){
                    player = new Player(id,name,true,0,0)
                    connection.send(msg('set_host'))
                }else{
                    player = new Player(id,name,false,0,0)
                }
                game.players.push(player)
                connections.push({id:id,connection:connection,active:1})
                connection.send(msg('join_confirmation',{id:id,game:game}))
                eventEmitter.emit('update_players',player)  
                break;      
            case("update_progress"): 
                const prog_idx = game.players.findIndex(p=>p.id==auth)
                game.players[prog_idx].progress = payload
                //players[prog_idx].wpm = payload.wpm
                eventEmitter.emit('update_progress',game.players[prog_idx])
                break;
            case("change_name"):
                const name_idx = game.players.findIndex(p => p.id==payload.id)
                game.players[name_idx].name = payload.name
                eventEmitter.emit('update_name',game.players[name_idx])
                break;
            case("start"):
                const p = game.players.find(p => p.id==auth)
                if(p.isHost){
                    eventEmitter.emit('start')
                    setTimeout(
                        ()=>eventEmitter.emit('end_game'),
                        game.time_limit*1000
                    )
                }else{
                    connection.send(msg('error','You are not the host!'))
                }           
                break;
        }
    })

    connection.on('close',()=>{
        const conn_to_remove_idx = connections.findIndex(c=>c.connection==connection)
        const idx = game.players.findIndex(p=>p.id==connections[conn_to_remove_idx].id)
        eventEmitter.emit('remove_player',game.players[idx].id)
        game.players[idx].active=0
        connections[conn_to_remove_idx].active = 0
    })
});

const genGameCode = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const initGame = () => {
    game = new Game()
    status = 1
}

const checkStatus = () => {
    return status
}

const genPlayerId = () => {
    const genId = Math.floor(Math.random()*9999)
    return genId
}


class Player {
    constructor(id,name,isHost,progress,wpm,connection){
        this.id = id
        this.name = name
        this.isHost = isHost
        this.progress = progress
        this.wpm = wpm
        this.connection = connection
    }
}

class Game {
    constructor(){
        this.code = genGameCode(5)
        this.players = []
        this.passage = "Test"
        this.complete = 0
        this.time_limit = 60
    }
}

const msg = (action, payload='') => {
    return JSON.stringify({action:action,payload:payload})
}

exports.initGame = initGame
exports.status = checkStatus