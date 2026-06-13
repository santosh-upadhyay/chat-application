import Chat from '../models/chat.model.js';
import Message from '../models/message.model.js';
import { ApiError } from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

const createChat = async (req, res) => {
    try {
        // const { participants } = req.body;
        const chat  = new Chat(req.body)
        const savedChat = await chat.save();

        res.status(201).json({
             message: 'Chat created successfully',
             success:true,
             data:savedChat
            });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

const getAllChats = async (req, res) => {
    try{
        const chats = await Chat.find({members: {$in: [req.user._id]}})
        .populate("members", "-password")
        .populate('lastMessage')
        .sort({ updatedAt: -1 });
        
        res.status(200).json(new ApiResponse(200, chats, "Chats fetched successfully", true));
    
    } catch(error){
        res.status(500).json(new ApiError(500,"server error", error, error.stack))
    }
}

const clearUnreadMessageCount = async (req, res) => {
    try {
        const { chatId } = req.body;
        // want to update unread messages count in chat collection
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json(new ApiError(404, "Chat not found", null, null));
        }
        // chat.unreadMessages = 0;
        const updatedChat = await Chat.findByIdAndUpdate(chatId, 
            { $set: { unreadMessagesCount: 0 } }, { new: true }).populate("members", "-password").populate('lastMessage');

        // we want to update the read property to true in message collection
        await Message.updateMany({chatId,read:false}, {$set:{read:true}})
        res.send({
            message: "Unread messages cleared",
            success: true,
            data: updatedChat
        })
    } catch (error) {
        res.status(500).json(new ApiError(500, "Server error", error, error.stack));
    }
}

export { createChat,getAllChats, clearUnreadMessageCount };