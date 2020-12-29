//var WebSocketClient = require('websocket').client;
var client = new WebSocket('ws://localhost:8080');

client.onopen= ()=>{
    console.log("open")
}

//num = 0
//
increment = () => {
    console.log(client.readyState)
    //console.log(num)
    //num = num+1
    client.send("test") 
    //console.log(document.getElementById("num").innerHTML)   
}

client.onmessage = (e) => {
    d = JSON.stringify(e.data,null,2)
    console.log("server says: "+d)
    document.getElementById("num").innerHTML = d
}