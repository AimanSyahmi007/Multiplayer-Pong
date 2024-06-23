const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 5500

const Game = require('./Game');

app.use(express.static('web'));

const uri = "mongodb+srv://b022210259:Aiman_140703@cluster0.2duvje6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

let games = [];

io.on('connection', function (socket) {
    console.log('New conenction', socket.id);

    socket.on('joinGame', function () {
        try {
            games[games.length-1].addPlayer(socket);
        } catch (error) {
            let game = new Game(games.length);
            game.addPlayer(socket);
            games.push(game);
        }
    });
});

http.listen(3000, function () {
    console.log('Listening on 5500');
});