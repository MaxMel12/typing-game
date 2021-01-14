var WebSocketServer = require('websocket').server;
const events = require('events')
const eventEmitter = new events.EventEmitter();

class Server {
    constructor(code){
        this.code = code
        this.wss = new WebSocketServer();

        this.wss.on('connect',(connection)=>{
            console.log('Connection made to server '+this.code)
            connection.send('Connected to server '+this.code)
            eventEmitter.on('test',()=>connection.send("Event sent from server "+this.code))
            connection.on('message',(m)=>{
                connection.id = 1
                console.log(connection)
                connection.send("Response")
                eventEmitter.emit('test')
            })
            connection.on('close',()=>{
                console.log("Closed")
            })
        })
    }
}

exports.Server = Server