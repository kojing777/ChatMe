import { Server } from 'socket.io'
import express from 'express'
import http from 'http';
import { Socket } from 'dgram';

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ['GET', 'POST']
    }
})

const userShocketMap = {}; //this map stores socket id corresponding the user
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        userShocketMap[userId] = socket.id;
        console.log(`user connected: userId= ${userId}, ShocketId = ${socket.id}`)
    }

    io.emit('getOnlineUsers',Object.keys(userShocketMap));
    socket.on('disconnet', () => {
        if (userId) {
            delete userShocketMap[userId];
            console.log(`user connected: userId= ${userId}, ShocketId = ${socket.id}`)

        }
        io.emit('getOnlineUsers',Object.keys(userShocketMap));
    })
})

export {app,server,io}