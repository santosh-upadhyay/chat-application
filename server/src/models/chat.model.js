import mongoose from "mongoose";

const chatSchema  = new mongoose.Schema({
    participants:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }],
        lastMessage:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Message'
        },
        unreadMessagesCount:{
            type:Number,
            default:0
        }   
},{
    timestamps:true
})
const Chat = mongoose.model('Chat', chatSchema);

export default Chat;