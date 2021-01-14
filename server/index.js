var http = require('http');
var express = require('express');
var path = require('path');
var server = require('./server')

var app = express();

app.use((req,res,next)=>{
    console.log(req._parsedUrl.pathname)
    next()
})

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'../screens/splash/splash.html'));
})

app.get('/splash.js',(req,res)=>{
    res.sendFile(path.join(__dirname,'../screens/splash/splash.js'))
})

app.get('/splash.css',(req,res)=>{
    res.sendFile(path.join(__dirname,'../screens/splash/splash.css'))
})

app.get('/game.html',(req,res)=>{
    res.sendFile(path.join(__dirname,'../screens/game/game.html'))
})

app.get('/game.js',(req,res)=>{
    res.sendFile(path.join(__dirname,'../screens/game/game.js'))
})

app.get('/game.css',(req,res)=>{
    res.sendFile(path.join(__dirname,'../screens/game/game.css'))
})

app.get('/host',(req,res)=>{
    if(!server.status()){
        server.initGame()
        res.sendFile(path.join(__dirname,'../screens/game/game.html'))
    }else{
        res.status(503).send("Game already being hosted");
    }      
})

app.get('/test.js',(req,res)=>{
    res.sendFile(path.join(__dirname,'../screens/splash/test.js'))
})

app.get('/join', (req,res)=>{
    res.sendFile(path.join(__dirname,'../screens/game/game.html'))
})

app.listen(80)
