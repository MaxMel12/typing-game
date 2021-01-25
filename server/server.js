var WebSocketServer = require('websocket').server;
const events = require('events')
const getPassage = require('./passages').getPassage


class GameServer {
    constructor(){
        this.code = this.genGameCode()
        this.game = new Game()
        this.status = 0
        this.wss = new WebSocketServer()
        this.emitter = new events.EventEmitter();

        this.wss.on('connect', (connection) => {
            this.bindEvents(connection)

            connection.on('message', (message)=>{
                this.handleRequest(connection,message)
            })

            connection.on('close', ()=>{
                this.close(connection)
            })
        })
    }

    bindEvents(connection){
        this.emitter.on('update',()=>this.send(connection, 'players', this.game.players))
        this.emitter.on('update_players',(player)=>this.send(connection,'update_players',player))
        this.emitter.on('update_progress',(player)=>this.send(connection,'update_progress',player))
        this.emitter.on('update_name',(player)=>this.send(connection,'update_name',{id:player.id,name:player.name}))
        this.emitter.on('start',()=>this.send(connection,'start'))
        this.emitter.on('remove_player',(id)=>this.send(connection,'remove_player',id))
        this.emitter.on('end_game',()=>this.send(connection,'end_game'))
    }

    close(connection){
        this.emitter.emit('remove_player', connection.id)
        const idx = this.game.players.findIndex(p=>p.id==connection.id)
        this.game.players[idx].active = 0
        if(this.game.players_online==0){this.resetServer()}
    }

    genGameCode(){
        const length = 5
        var result = '';
        var characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ3456789';
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

    handleRequest(connection,message){
        message = JSON.parse(message.utf8Data)
        const {action,payload} = message
        switch(action){
            case("join_game"):
                
                //player doesn't even need to have id, it could just be stored in connection
                //put name in cookie tho so it can be initialized right away
                /*if(connection.id){
                    player = this.game.players.find(p=>p.id==connection.id)
                    this.send(connection,'join_confirmation',{id:connection.id,game:this.game,code:this.code})
                    this.emitter.emit('update_players',player)
                    break;
                }*/
                
                const id = this.genPlayerId()
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

                this.send(connection,'join_confirmation',{id:id,game:this.game,code:this.code})
                this.emitter.emit('update_players',player)
                this.status = 1  
                break;      
            case("update_progress"): 
                const prog_idx = this.game.players.findIndex(p=>p.id==connection.id)
                this.game.players[prog_idx].progress = payload
                //players[prog_idx].wpm = payload.wpm
                this.emitter.emit('update_progress',this.game.players[prog_idx])
                break;
            case("change_name"):
                const name_idx = this.game.players.findIndex(p => p.id==payload.id)
                this.game.players[name_idx].name = payload.name
                this.emitter.emit('update_name',this.game.players[name_idx])
                break;
            case("start"):
                const p = this.game.players.find(p => p.id==connection.id)
                if(p.isHost){
                    this.emitter.emit('start')
                    setTimeout(
                        ()=>this.emitter.emit('end_game'),
                        this.game.time_limit*1000
                    )
                }else{
                    this.send(connection,'error','You are not the host!')
                }           
                break;
            case("reset"):
                //get new passage if changepassage==true, reset everything here and send game object
                break;
            case("set_passage"):
                break;
            case("toggle_change_passage"):
                this.game.changePassage = !this.game.changePassage
        }
    }

    resetServer(){
        this.code = this.genGameCode()
        this.game = new Game()
        this.status = 0
    }
}

class Player {
    constructor(id,name,isHost,progress,wpm){
        this.id = id
        this.name = name
        this.isHost = isHost
        this.progress = progress
        this.wpm = wpm
        this.active = 1
    }
}

class Game {
    constructor(){
        this.players = []
        this.passage = getPassage()
        this.complete = 0
        this.time_limit = 60
        this.change_passage = true
    }

    get players_online(){
        var out = 0
        for(var p of this.players){
            if(p.active==1){
                out++
            }
        }
        return out
    }

    newPassage(){
        this.passage = getPassage()
    }
}

exports.GameServer = GameServer