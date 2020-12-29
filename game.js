//var WebSocketClient = require('websocket').client;
var client = new WebSocket('ws://localhost:8080');



//num = 0
//
increment = () => {
    //console.log(num)
    //num = num+1
    client.send("test") 
    console.log(document.getElementById("num").innerHTML)   
}