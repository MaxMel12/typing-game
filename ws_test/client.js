const WebSocket = require('ws')
const address = 'localhost'

var client = new WebSocket('ws://'+address+':9000');

client.on('open',()=>{
    client.send("Test")
})

client.on('message',(m)=>{
    console.log(m)
})

//setInterval(()=>console.log(client.readyState),500)