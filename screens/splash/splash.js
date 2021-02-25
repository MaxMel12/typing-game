//const address = '3.129.211.204'
const address = 'localhost'

document.getElementById("host_btn").addEventListener("click",()=>host())
//document.getElementById("solo_btn").addEventListener("click",()=>solo())
document.getElementById("join_btn").addEventListener("click",()=>join())

const join = () => {
    const code = document.getElementById("game-code-inp").value
    window.location = '/join?code='+code
    //window.location = '/join'
}

const host = () => {
    window.location = '/host'
}

const solo = () => {
    window.location = '/solo'
}