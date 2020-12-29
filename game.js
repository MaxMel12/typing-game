var WebSocketClient = require('websocket').client;
var client = new WebSocketClient();

//client

num = 0
increment = () => {
    num = num+1 
    document.getElementById("num").attribute = num    
}