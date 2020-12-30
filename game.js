//var WebSocketClient = require('websocket').client;
var client = new WebSocket('ws://3.129.211.204:8080');

client.onopen= ()=>{
    console.log("open")
}

window.onload = () => {
    var p = document.getElementById("passage")
    p.innerHTML=passage
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

var input, progressBar, passageArr, progress, pos, startTime, endTime
const comp = "#"
const inc = "_"

start = () => {
    const d = new Date()
    input = document.getElementById("input")
    progressBar = document.getElementById("progress-bar")


    progress = 0
    progressBar.innerHTML = inc.repeat(20)+"0%"
    
    passageArr = passage.split(' ')
    pos = 0 
    startTime =  d.getTime()
}

checkInput = () => {
    console.log("Checked")
    if(input.value==passageArr[pos]+" "){
        pos++
        input.value=""
        progress=pos/passageArr.length
        const complete = Math.floor(progress*20)
        progressBar.innerHTML = comp.repeat(complete)+inc.repeat(20-complete)+Math.floor(progress*100)+"%"
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

//const passage ="This is a test"
const passage = "Sometimes people are layered like that. There's something totally different underneath than what's on the surface. But sometimes, there's a third, even deeper level, and that one is the same as the top surface one. Like with pie."