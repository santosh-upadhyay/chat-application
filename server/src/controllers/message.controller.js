import express from "express";
import Message from "../models/message.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Chat from "../models/chat.model.js";

const createmessage = async (req, res) => {
    try {
        // store the message in the database

        const newMessage = new Message(req.body);
        const savedMessage = await newMessage.save();

        // update the last message  in the chat collection
        // const currentChat = await Chat.findById(req.body.chatId);
        // currentChat.lastMessage =  savedMessage._id;
        // await currentChat.save();

        const currentChat = await Chat.findByIdAndUpdate({
            _id:req.body.chatId
        },{
            lastMessage:savedMessage._id,
            $inc:{unreadMessagesCount:1}
        })
        res.status(201).json(new ApiResponse(201,"message created successfully", savedMessage))
        

    } catch (error) {
        res.status(500).json(new ApiError(500,"server error", error, error.stack))
    }   
}


const getAllMessages = async(req,res)=>{
    try {
        const chat = req.params.chatId;
        const allmessages = await Message.find({chatId:chat}).sort({createdAt:1});

        res.status(200).json(new ApiResponse(200,"messages fetched successfully", allmessages))
    } catch (error) {
        res.status(500).json(new ApiError(500,"server error", error, error.stack))
    }
}

export { createmessage, getAllMessages };