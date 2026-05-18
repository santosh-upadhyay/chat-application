import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
dotenv.config();
import app from './app.js';
import userRouter from './src/routes/user.route.js';
import chatRouter from './src/routes/chat.route.js';
import messageRouter from './src/routes/message.route.js';
const port = process.env.PORT_NUMBER || 3000;

connectDB();

app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);

app.listen(port,()=>{
    console.log(`Example app listening at ${port}`);
})