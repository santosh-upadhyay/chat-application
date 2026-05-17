import Chat from '../models/chat.model.js';
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
        
        res.status(200).json(new ApiResponse(200, chats, "Chats fetched successfully", true));
    
    } catch(error){
        res.status(500).json(new ApiError(500,"server error", error, error.stack))
    }
    }

export { createChat,getAllChats };