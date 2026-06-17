import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
dotenv.config();
import app from './app.js';
import userRouter from './src/routes/user.route.js';
import chatRouter from './src/routes/chat.route.js';
import messageRouter from './src/routes/message.route.js';
import http from 'http';
import { Server } from 'socket.io';
dotenv.config("./.env");
import dns from 'dns';
import cors from 'cors'
// Change DNS

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const port = process.env.PORT_NUMBER || 5000;
app.use(cors())
connectDB();

app.use(express.json({
    limit:'10mb'
}));
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:'http://localhost:3000',
        methods:['GET','POST']
    }
});

app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);

const onlineUsers = [];
server.listen(port,()=>{
    console.log(`Example app listening at ${port}`);
})
io.on('connection',(socket)=>{
    socket.on('join-room',(userId)=>{
        socket.join(userId);

        console.log(`User with id ${userId} joined the room`);
    })

    socket.on('send-message',(message)=>{
        // console.log('Message received:', message);
        io.to(message.members[0]).to(message.members[1]).emit('receive-message',message);
        // console.log(message)
    })

    socket.on('clear-unread-messages',(data)=>{
        io.to(data.members[0]).to(data.members[1]).emit('message-count-cleared',data);
        // console.log(data);
    })
    socket.on('user-typing',(data)=>{
        socket.to(data.members.filter(m=>m!==data.senderId)[0]).emit('started-typing',data);
        // console.log(data);
    })
    socket.on('user-login',(userId)=>{
        if(!onlineUsers.includes(userId)){
            onlineUsers.push(userId);
        }
        socket.emit('online-users',onlineUsers);

    })
    socket.on('user-logout',(userId)=>{
        onlineUsers.splice(onlineUsers.indexOf(userId),1);
        socket.emit('online-users-updated',onlineUsers);
    })

    
})