// We're bringing in three modules: 'express' for building our server, 'http' for creating a HTTP server, and 'socket.io' for real-time communication.
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// We're creating an Express application.
const app = express();
// We're creating a HTTP server that takes our Express application as an argument.
const server = http.createServer(app);
// We're creating a new instance of socket.io by passing our server. We're also setting CORS (Cross-Origin Resource Sharing) to allow requests from any origin.
const io = socketIo(server, { cors: { origin: '*' } });

// We're creating two maps to keep track of which socket ID is associated with which email and vice versa.
const emailToSocketIdMap = new Map();
const socketIdtoEmailMap = new Map();

// When a client connects to our server, this function will be called.
io.on('connection', (socket) => {
    // We're logging the socket ID of the newly connected client.
    console.log('New client connected', socket.id);
    // When the client emits a 'join' event, this function will be called.
    socket.on('join', (data) => {
        // We're extracting the email and room from the data sent by the client.
        const { email, room } = data;
        // We're associating the client's email with their socket ID and vice versa.
        emailToSocketIdMap.set(email, socket.id);
        socketIdtoEmailMap.set(socket.id, email);
        // We're letting everyone in the room know that a new user has joined.
        io.to(room).emit('user:joined', {
            email, id: socket.id
        });
        // The client is joining the specified room.
        socket.join(room);
        // We're sending the join data back to the client.
        io.to(socket.id).emit('join', data);
    })
    // When the client disconnects from our server, this function will be called.
    socket.on('disconnect', () => console.log('Client disconnected'));
});

// We're setting the port number for our server.
const port = 4000;
// We're telling our server to listen on the specified port and logging a message once it's ready.
server.listen(port, () => console.log(`Listening on port ${port}`));