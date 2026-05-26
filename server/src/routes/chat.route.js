import express from 'express';

import { Router } from 'express';

import { clearUnreadMessageCount, createChat } from '../controllers/chat.controller.js';
import { getAllChats } from '../controllers/chat.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const chatRouter = Router();
chatRouter.post('/create', authMiddleware, createChat);
chatRouter.get('/all-chats', authMiddleware, getAllChats);
chatRouter.post('/clear-unread-message', authMiddleware, clearUnreadMessageCount);
    // chatRouter.post('/new-message',authMiddleware, createmessage)

export default chatRouter;