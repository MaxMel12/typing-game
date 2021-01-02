//var WebSocketClient = require('websocket').client;
//var client = new WebSocket('ws://3.129.211.204:8080');
var client = new WebSocket('ws://localhost:8080');

var id

client.onopen= ()=>{
    console.log("open")
    var name = document.getElementById('username-inp').value
    client.send(JSON.stringify({action:'join_game',payload:{name:name}}))
}

window.onload = () => {
    var p = document.getElementById("passage")
    p.innerHTML=passage
    
    progressBar = document.getElementById("progress-bar-player")
    progressBar.innerHTML = inc.repeat(20)+"0%"
    
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

/*client.onmessage = (e) => {
    d = JSON.stringify(e.data,null,2)
    console.log("server says: "+d)
    document.getElementById("num").innerHTML = d
}*/

client.onmessage = (m) => {
    d = JSON.parse(m.data)
    const {action,payload} = d
    //console.log("server says: "+JSON.stringify(d.payload))
    switch(action){
        case("players"):
            for(i=0;i<payload.length;i++){
                addPlayer(payload[i])
            }
            break;
        case("update_players"):
            addPlayer(payload)
            break;
        case("update_progress"):
            updateProgress(payload)
            break;
        case("join_confirmation"):
            id = payload
            break;
        case('update_name'):
            updateName(payload)
            break;
        case('init_game_confirmation'):
            id = payload
            spawnButtons()
            break;
        case('start'):
            start()
            break;
    }
}

var input, progressBar, passageArr, progress, pos, startTime, endTime
const comp = "#"
const inc = "_"

start = () => {
    const d = new Date()
    input = document.getElementById("input")
    input.focus()

    progress = 0
    
    passageArr = passage.split(' ')
    pos = 0 
    startTime =  d.getTime()
}

host_start = () => {
    client.send(JSON.stringify({action:'start',payload:''}))
}

checkInput = () => {
    input = document.getElementById("input")
    if(input.value==passageArr[pos]+" "){
        pos++
        input.value=""
        progress=pos/passageArr.length
        const complete = Math.floor(progress*20)
        progressBar.innerHTML = comp.repeat(complete)+inc.repeat(20-complete)+Math.floor(progress*100)+"%"
        client.send(JSON.stringify({action:'update_progress',payload:{id:id,progress:progress}}))
    }
    if(pos==passageArr.length){
        end()    
    }
    //console.log("Checked")
}

end = () => {
    const d = new Date()
    endTime = d.getTime()
    const wpm = Math.floor(passageArr.length/((endTime-startTime)/60000))
    var wpmDisp = document.getElementById("wpm")
    wpmDisp.innerHTML = "WPM: "+wpm
}

reset = () => {
    input.value=""
    wpmDisp.innerHTML = ""
    progressBar.innerHTML = ""
    progress=0
}

test = () => {
    client.send(JSON.stringify({action:"bruh",payload:"bruh"}))
    console.log("send")
}

changeName = () => {
    var newName = document.getElementById("username-inp").value
    client.send(JSON.stringify({action:"change_name",payload:{id:id,name:newName}}))
}

addPlayer = (player) => {
    if(player.id==id) return
    var b = document.createElement('div');
    var n = document.createElement('p')
    var bar = document.createElement('p')
    b.setAttribute('id',player.id)
    b.setAttribute('class','progress-bar-container')
    var list = document.getElementById('progress')
    var name = document.createTextNode(player.name)

    var prog = document.createTextNode(inc.repeat(20)+'0%')
    bar.setAttribute('class','progress-bar')
    bar.appendChild(prog)
    n.appendChild(name)
    n.setAttribute('class','player-name')
    b.appendChild(n)
    b.appendChild(bar)
    list.appendChild(b)
}

updateProgress = (players) => {
    for (i=0;i<players.length;i++){
        if(players[i].id==id) continue;
        const player_id = players[i].id
        var bar = document.getElementById(player_id).childNodes[1]
        var progress = players[i].progress
        const complete = Math.floor(progress*20)
        bar.innerHTML = comp.repeat(complete)+inc.repeat(20-complete)+Math.floor(progress*100)+"%"
    }
}

updateName = (player) => {
    if(player.id==id){
        document.getElementById('player-name-player').innerHTML = player.name+" (You)"
    } else{
        document.getElementById(player.id).childNodes[0].innerHTML = player.name  
    }
    
}

spawnButtons = () => {
    var container = document.getElementById('buttoncontainer')
    var start = document.createElement('div')
    var reset = document.createElement('div')
    var start_text = document.createTextNode("Start")
    var reset_text = document.createTextNode("Reset")
    start.appendChild(start_text)
    reset.appendChild(reset_text)
    start.setAttribute('class','btn')
    reset.setAttribute('class','btn')
    start.setAttribute('onclick','host_start()')

    container.appendChild(start)
    container.appendChild(reset)
}


//const passage ="This is a test"
const passage = "Sometimes people are layered like that. There's something totally different underneath than what's on the surface. But sometimes, there's a third, even deeper level, and that one is the same as the top surface one. Like with pie."