var timer = 3
const countdown = () => {
    console.log(timer--)
    timer==0?clear():null
}
const clear = () => {
    clearInterval(timeout)
    console.log('done!') 
}
const timeout = setInterval(countdown,1000)