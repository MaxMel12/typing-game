//const address = '3.129.211.204'
const address = 'localhost'

const p = window.location.pathname
const q = window.location.search
var path = q?p+'/'+q:p


var client = new WebSocket('ws://'+address+':9000'+path);



var game, timeout
var timer = 3

client.onopen= ()=>{
    console.log('open')
    var name = document.getElementById('username-inp').value
    client.send(JSON.stringify({action:'join_game',payload:{name:name}}))
}

window.onload = () => {
    var p = document.getElementById("passage")
    p.innerHTML=passage
    
    progressBar = document.getElementById("progress-bar-player")
    progressBar.innerHTML = inc.repeat(20)+"0%"
    
}

client.onmessage = (m) => {
    const d = JSON.parse(m.data)
    const {action,payload} = d

    switch(action){
        case("update_players"):
            addPlayer(payload)
            break;
        case("update_progress"):
            updateProgress(payload)
            break;
        case("join_confirmation"):
            document.cookie = `id=${payload.id}`
            const players = payload.game.players
            for(var i=0;i<players.length;i++){
                addPlayer(players[i])
            }
            game=payload.game
            var code=payload.code
            console.log(code)
            document.getElementById("code").innerHTML=code
            document.getElementById("passage").innerHTML=game.passage
            break;
        case('update_name'):
            updateName(payload)
            break;
        case('start'):
            countdown()
            timeout = setInterval(countdown,1000)
            break;
        case('remove_player'):
            removePlayer(payload)
            break;
        case('set_host'):
            spawnButtons()
            break;
        case('update_passage'):
            break;
    }
}

document.getElementById("save-name").addEventListener("click",()=>changeName())
document.getElementById("input").addEventListener("input",()=>checkInput())

var input, progressBar, passageArr, progress, pos, startTime, endTime
const comp = "#"
const inc = "_"

const start = () => {
    const d = new Date()
    input = document.getElementById("input")
    input.removeAttribute('disabled')
    input.focus()
    input.value=""

    progress = 0
    
    passageArr = game.passage.split(' ')
    pos = 0 
    startTime =  d.getTime()
}

const hostStart = () => {
    msg('start')
}

const checkInput = () => {
    input = document.getElementById("input")
    if(input.value==passageArr[pos]+" "){
        pos++
        input.value=""
        progress=pos/passageArr.length
        const complete = Math.floor(progress*20)
        progressBar.innerHTML = comp.repeat(complete)+inc.repeat(20-complete)+Math.floor(progress*100)+"%"
        msg('update_progress',progress)
    }
    if(pos==passageArr.length){
        end()    
    }
}

const end = () => {
    const d = new Date()
    endTime = d.getTime()
    const wpm = Math.floor(passageArr.length/((endTime-startTime)/60000))
    var wpmDisp = document.getElementById("wpm")
    wpmDisp.innerHTML = "WPM: "+wpm
}

const reset = () => {
    input.value=""
    wpmDisp.innerHTML = ""
    progressBar.innerHTML = ""
    progress=0
}


const changeName = () => {
    var newName = document.getElementById("username-inp").value
    msg("change_name",{id:getCookie('id'),name:newName})
}

const addPlayer = (player) => {
    if(getCookie('id')==player.id || !player.active) return
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

const updateProgress = (player) => {
    const id = getCookie('id')
    if(player.id==id) return;
    
    const player_id = player.id
    var bar = document.getElementById(player_id).childNodes[1]
    var progress = player.progress
    const complete = Math.floor(progress*20)
    bar.innerHTML = comp.repeat(complete)+inc.repeat(20-complete)+Math.floor(progress*100)+"%"
}

const updateName = (player) => {
    console.log(player)
    const id = getCookie('id')
    if(player.id==id){
        document.getElementById('player-name-player').innerHTML = player.name+" (You)"
    } else{
        document.getElementById(player.id).childNodes[0].innerHTML = player.name  
    }
    
}

const spawnButtons = () => {
    var container = document.getElementById('buttoncontainer')
    var start = document.createElement('div')
    var reset = document.createElement('div')
    var start_text = document.createTextNode("Start")
    var reset_text = document.createTextNode("Reset")
    start.appendChild(start_text)
    reset.appendChild(reset_text)
    start.setAttribute('class','btn')
    reset.setAttribute('class','btn')
    start.addEventListener("click",()=>hostStart())

    container.appendChild(start)
    container.appendChild(reset)
}

const removePlayer = (id) => {
    var list = document.getElementById('progress')
    var player = document.getElementById(id)
    list.removeChild(player)
}

const msg = (action,payload='') => {
    const id = getCookie('id')
    client.send(JSON.stringify({auth:id,action:action,payload:payload}))
}

const getCookie = (cname) => {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

const countdown = () => {
    document.getElementById('input').value= 'Starting in '+timer
    if(timer==0){
        clearInterval(timeout)
        start() 
    }
    timer--
}

const genProgressBar = () => {
    null
}

const passage = "Sometimes people are layered like that. There's something totally different underneath than what's on the surface. But sometimes, there's a third, even deeper level, and that one is the same as the top surface one. Like with pie."