const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

const emailToSocketIdMap = new Map();
const socketIdtoEmailMap = new Map();

io.on('connection', (socket) => {
    console.log('New client connected', socket.id);
    socket.on('join', (data) => {
        const { email, room } = data;
        emailToSocketIdMap.set(email, socket.id);
        socketIdtoEmailMap.set(socket.id, email);
        io.to(room).emit('user:joined', {
            email, id: socket.id
        });
        socket.join(room);
        io.to(socket.id).emit('join', data);
    })

    socket.on('call:user', ({to, offer}) => {
        io.to(to).emit('incoming:call', {from: socket.id, offer});
    });

    socket.on('call:accepted', ({to, ans}) => {
        io.to(to).emit('call:accepted', {from: socket.id, ans});
    });

    socket.om('peer:nego:needed', ({to, offer}) => {
        io.to(to).emit('peer:nego:needed', {from: socket.id, offer});
    });

    socket.on("peer:nego:done", ({to, ans}) => {
        io.to(to).emit('peer:nego:final', {from: socket.id, ans});
    });

    socket.on('disconnect', () => console.log('Client disconnected'));
});

const port = 4000;
server.listen(port, () => console.log(`Listening on port ${port}`));