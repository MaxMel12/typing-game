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
            game=payload.game
            var code=payload.code
            console.log(code)
            document.getElementById("code").innerHTML=code
            document.getElementById("remaining").innerHTML=game.passage
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

var input, progressBar, passageArr, progress, pos, startTime, endTime, rightChars, wrongChars
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

    if(input.value==passageArr[pos]+" "){
        pos++
        input.value=""
        progress=pos/passageArr.length

        const d = new Date()
        endTime = d.getTime()
        const wpm = Math.floor(pos/((endTime-startTime)/60000))

        progressBar.innerHTML = genProgressBar(progress,wpm)
        msg('update_progress',{progress,wpm})
    }

    while(wrongChars==0 && i<passageArr[pos].length){
        if(passageArr[pos][i]==input.value[i]){
            rightChars++
        }
        else{
            wrongChars=input.value.length-rightChars
        }
        i++
        console.log('Right'+rightChars)
        console.log('Wrong'+wrongChars)
    }

    colorPassage()
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
    msg("reset")
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

    var prog = document.createTextNode(genProgressBar(0))
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
    
    var bar = document.getElementById(player.id).childNodes[1]
    bar.innerHTML = genProgressBar(player.progress,player.wpm)
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
    var custom = document.createElement('div')
    var start_text = document.createTextNode("Start")
    var reset_text = document.createTextNode("Reset")
    var custom_text = document.createTextNode("Enter Custom Passage")
    start.appendChild(start_text)
    reset.appendChild(reset_text)
    custom.appendChild(custom_text)
    start.setAttribute('class','btn')
    reset.setAttribute('class','btn')
    custom.setAttribute('class','btn')
    start.addEventListener("click",()=>hostStart())
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

    container.appendChild(start)
    container.appendChild(reset)
    container.appendChild(custom)
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

    //completed.innerHTML = compStr
    wrong.innerHTML = remStr.slice(rightChars,rightChars+wrongChars)
    remaining.innerHTML = remStr.slice(rightChars+wrongChars,remStr.length)

    completed.innerHTML = compStr
    //remaining.innerHTML = remStr

    rightChars=0
    wrongChars=0
}