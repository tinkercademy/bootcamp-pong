const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/selection.html');
});

app.get('/game', (req, res) => {
    res.sendFile(__dirname + '/public/game.html');
});


io.on('connection', (socket) => {
    console.log('A user is connected');
    socket.on('move player', (data) => {
        io.emit('update screen', data);
    })
    socket.on('ball speed', (data) => {
        console.log(`Ball speed: ${data}`);
    })
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    })
})

server.listen(3000, () => {
    console.log('listening on *:3000');
});