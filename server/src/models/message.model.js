import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({


    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    },
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    text: {
        type: String,
        required: false
    },
    image:{
        type: String,
        // default: null,
        required: false

    },
    read:{
        type: Boolean,
        default: false
    }


},{timestamps: true})


const Message = mongoose.model('Message', messageSchema)

export default Message;