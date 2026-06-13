import express from 'express';

import { Router } from 'express';
import { registerUser, loginUser, getCUrrentUser, getAllUsers, uploadProfilePic } from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';


const userRouter = Router();

userRouter.post('/register',registerUser);
userRouter.post('/login',loginUser);
userRouter.get('/profile', authMiddleware,getCUrrentUser);
userRouter.get('/users', authMiddleware,getAllUsers);
userRouter.post('/upload-profile-pic', authMiddleware,uploadProfilePic);

export default userRouter;
