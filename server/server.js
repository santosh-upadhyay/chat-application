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
const port = process.env.PORT_NUMBER || 5000;

connectDB();

app.use(express.json());
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
           
       
            })

    
})