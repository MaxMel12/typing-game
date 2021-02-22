//const address = '3.129.211.204'
const address = 'quicktyper.online'
//const address = 'localhost'

const p = window.location.pathname
const q = window.location.search
var path = q?p+'/'+q:p


var client = new WebSocket('ws://'+address+':9000'+path);

var game, timeout, timer

client.onopen= ()=>{
    var name = document.getElementById('username-inp').value
    client.send(JSON.stringify({action:'join_game',payload:{name:name}}))
}

window.onload = () => {
    //var p = document.getElementById("remaining")
    //p.innerHTML=passage
    
    progressBar = document.getElementById("progress-bar-player")
    progressBar.innerHTML = genProgressBar(0)
    
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
            if(payload.game.isActive){
                for(var i=0;i<players.length;i++){
                    updateProgress(players[i])
                }    
            }
            
            game=payload.game
            var code=payload.code
            document.getElementById("code").innerHTML=code
            document.getElementById("remaining").innerHTML=game.passage
            break;
        case('update_name'):
            updateName(payload)
            break;
        case('start'):
            timer = 3
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
        case('reset'):
            resetGame(payload.game)
            break;
    }
}

document.getElementById("save-name").addEventListener("click",()=>changeName())
document.getElementById("input").addEventListener("input",()=>checkInput())

var input, progressBar, passageArr, progress, pos, startTime, endTime, rightChars=0, wrongChars=0
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

    var i=0

    const match = passageArr[pos]+" "

    if(input.value==match){
        pos++
        input.value=""
        progress=pos/passageArr.length

        const d = new Date()
        endTime = d.getTime()
        const wpm = Math.floor(pos/((endTime-startTime)/60000))

        progressBar.innerHTML = genProgressBar(progress,wpm)
        msg('update_progress',{progress,wpm})
    }

    if(pos==passageArr.length){
        finish()
        return     
    }
    

    while(wrongChars==0 && i<match.length){
        if(match[i]==input.value[i]){
            rightChars++
        }
        else{
            wrongChars=input.value.length-rightChars
        }
        i++
    }

    colorPassage()
}

const finish = () => {
    input = document.getElementById("input")
    input.setAttribute('disabled',true)
    input.value="Waiting for other players to finish..."
    msg("finish")
}

const hostReset = () => {
    msg("reset")
}

const endGame = () => {
    input = document.getElementById("input")
    input.setAttribute('disabled',true)
    input.value="Waiting for host to begin..."
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
    
    var pos = document.createElement('p')
    pos.setAttribute('class','position')
    
    var prog = document.createTextNode(genProgressBar(0))
    bar.setAttribute('class','progress-bar')
    bar.appendChild(prog)
    n.appendChild(name)
    n.setAttribute('class','player-name')


    b.appendChild(n)
    b.appendChild(bar)
    b.appendChild(pos)
    list.appendChild(b)

}

const updateProgress = (player) => {
    var place, bar
    const id = getCookie('id')
    if(id==player.id){
        place = document.getElementById('position-player')
        bar = document.getElementById("progress-bar-player")
    }else{
        place = document.getElementById(player.id).childNodes[2]
        bar = document.getElementById(player.id).childNodes[1]
        bar.innerHTML = genProgressBar(player.progress,player.wpm)
    }

    place.innerHTML = getPositionStr(player.position)

}


const updateName = (player) => {
    const id = getCookie('id')
    if(player.id==id){
        document.getElementById('player-name-player').innerHTML = player.name+" (You)"
    } else{
        document.getElementById(player.id).childNodes[0].innerHTML = player.name  
    }
    
}

const spawnButtons = () => {
    var container = document.getElementById('buttoncontainer')

    container.style.visibility = 'visible'
    var start = document.getElementById('start')
    var reset = document.getElementById('reset')
    var custom = document.getElementById('custom')
    start.addEventListener("click",()=>hostStart())
    reset.addEventListener("click",()=>hostReset())
    custom.addEventListener("click",()=>{
        if(!document.getElementById('passage_input_container')){
            var passage_input_container = document.createElement('div')
            var passage_input = document.createElement('input')
            var save = document.createElement('div')
            var save_text = document.createTextNode('Save')
            var cancel = document.createElement('div')
            var cancel_text = document.createTextNode('Cancel')
            
            save.appendChild(save_text)
            cancel.appendChild(cancel_text)

            save.setAttribute("class","btn")
            cancel.setAttribute("class","btn")

            passage_input_container.setAttribute('id','passage_input_container')
            passage_input.setAttribute('id','passage_input')
            save.addEventListener("click",()=>savePassage())

            cancel.addEventListener("click",()=>container.removeChild(passage_input_container))

            passage_input_container.appendChild(passage_input)
            passage_input_container.appendChild(save)
            passage_input_container.appendChild(cancel)

            container.appendChild(passage_input_container)
        }      
    })
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

const savePassage = () => {
    const passage = document.getElementById('passage_input').value
    msg("set_passage",passage)
}

const genProgressBar = (progress,wpm=0) => {
    const comp = "#"
    const inc = "_"
    const road = "_"
    const car = "#"
    const length = 100
    const complete = Math.floor(progress*length)
    //return comp.repeat(complete)+inc.repeat(length-complete)+Math.floor(progress*100)+"%"
    return road.repeat(complete)+car+road.repeat(length-complete)+" WPM: "+wpm
}

const colorPassage = () => {
    const completed = document.getElementById('complete')
    const wrong = document.getElementById('wrong')
    const remaining = document.getElementById('remaining')

    var compStr = passageArr.slice(0,pos).join(' ')+' '
    var remStr = passageArr.slice(pos,passageArr.length).join(' ')

    compStr += remStr.slice(0,rightChars)

    completed.innerHTML = compStr
    wrong.innerHTML = remStr.slice(rightChars,rightChars+wrongChars)
    remaining.innerHTML = remStr.slice(rightChars+wrongChars,remStr.length)

    rightChars=0
    wrongChars=0
}

const getPositionStr = (pos) => {
    const ones = pos%10
    var out = pos
    switch(ones){
        case(0):
            out=""
            break;
        case(1):
            out+="st"
            break;
        case(2):
            out+="nd"
            break;
        case(3):
            out+="rd"
            break;
        default:
            out+="th"
            break;
    }
    return out
}

const resetGame = (_game) => {
    endGame()
    document.getElementById("remaining").innerHTML=_game.passage
    document.getElementById("wrong").innerHTML=""
    document.getElementById("complete").innerHTML=""

    game = _game
    
    const players = _game.players
    for(var i=0;i<players.length;i++){
        updateProgress(players[i])
    }
    document.getElementById("progress-bar-player").innerHTML = genProgressBar(0)
    document.getElementById('position-player').innerHTML=""
}