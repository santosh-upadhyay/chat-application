import express from 'express';

import { Router } from 'express';

import { createChat } from '../controllers/chat.controller.js';
import { getAllChats } from '../controllers/chat.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const chatRouter = Router();
chatRouter.post('/create', authMiddleware, createChat);
chatRouter.get('/all-chats', authMiddleware, getAllChats);

export default chatRouter;