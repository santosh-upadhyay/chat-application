import express from "express";
import Message from "../models/message.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Chat from "../models/chat.model.js";

const createmessage = async (req, res) => {
  try {
    // we are basically sending chatId, senderId, text
    // const newMessage = new Message(req.body);
    const message = req.body.newMessage;
    const newMessage = new Message({
      chatId: message.chat,
      senderId: message.sender,

      text: message.text,
      image: message.image
    });
    const savedMessage = await newMessage.save();

    // update the last message  in the chat collection
    // const currentChat = await Chat.findById(req.body.chatId);
    // currentChat.lastMessage =  savedMessage._id;
    // await currentChat.save();

    const currentChat = await Chat.findByIdAndUpdate(
      {
        _id: message.chat,
      },
      {
        lastMessage: savedMessage._id,
        $inc: { unreadMessagesCount: 1 },
      },
    );
    res
      .status(201)
      .json(new ApiResponse(201,savedMessage ,"message created successfully"));
  } catch (error) {
    res.status(500).json(new ApiError(500, "server error", error, error.stack));
  }
};

const getAllMessages = async (req, res) => {
  try {
    const chat = req.params.chatId;
    const allmessages = await Message.find({ chatId: chat }).sort({
      createdAt: 1,
    });

    res
      .status(200)
      .json(new ApiResponse(200, allmessages, "messages fetched successfully"));
  } catch (error) {
    res.status(500).json(new ApiError(500, "server error", error, error.stack));
  }
};

export { createmessage, getAllMessages };
