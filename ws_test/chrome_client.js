
const address = 'localhost'

var client = new WebSocket('ws://'+address+':9000');

client.onopen=(()=>{
    client.send("Test")
})

client.onmessage=((m)=>{
    console.log(m)
})

msg = () => {
    client.send("Test")
}

//setInterval(()=>console.log(client.readyState),500)