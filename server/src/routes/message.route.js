import express from 'express';

import { Router } from 'express';

const messageRouter = Router();

import {createmessage, getAllMessages }  from '../controllers/message.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';


messageRouter.post('/new-message', authMiddleware, createmessage);
messageRouter.get('/all-messages/:chatId', authMiddleware, getAllMessages);

export default messageRouter;