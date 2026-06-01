import { useDispatch, useSelector } from "react-redux";
import { createNewMessage, getAllMessages } from "../../../apiCalls/message";
import { useEffect, useState } from "react";
import moment from "moment";
import { clearUnreadMessageCount } from "../../../apiCalls/chat";
import store from "../../../redux/store";
import { setAllChats } from "../../../redux/usersSlice";
import EmojiPicker from "emoji-picker-react";

function ChatArea({socket}) {
  const { selectedChat, user, allChats } = useSelector((state) => state.usersReducer);
  const selectedUser = selectedChat.members.find((u) => u._id !== user._id);
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // TODO: Implement the logic to send a message
  const sendMessage = async () => {
    // Implement the logic to send a message here
    try {
      const newMessage = {
        chat: selectedChat._id,
        sender: user._id,
        text: message,
      };

      // Emit the message to the server using Socket.IO
      socket.emit('send-message',
        {...newMessage,
          members: selectedChat.members.map((member) => member._id),
          read: false,
          createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
        }
      )

      const response = await createNewMessage({ newMessage });

      if (response.success) {
        setMessage("");
        setShowEmojiPicker(false);
      }
      return response;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  const formattime = (timestamp) => {
    const now = moment();
    const diff = now.diff(moment(timestamp), "days");
    if (diff < 1) {
      return `Today ${moment(timestamp).format("h:mm A")}`;
    } else if (diff === 1) {
      return `Yesterday ${moment(timestamp).format("h:mm A")}`;
    } else {
      return moment(timestamp).format("MMM , YYYY h:mm A");
    }

  };
  // TODO: Implement the logic to fetch messages for the selected chat
  const getMessages = async () => {
    try {
      // dispatch(showLoader());
      const response = await getAllMessages(selectedChat._id);
      // dispatch(hideLoader());
      if (response.success) {
        setAllMessages(response.data);
        // console.log(response.data);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };
// TODO: Implement the logic to clear unread message count when a chat is opened
  const clearUnreadMessages = async () => {
    try {
      socket.emit('clear-unread-messages', {
        chat: selectedChat._id,
        members: selectedChat.members.map((member) => member._id)
      });
      const response = await clearUnreadMessageCount(selectedChat._id);

      if (response.success) {
       const updatedChats =  allChats.map((chat) => {
          if (chat._id === selectedChat._id) {
            return response.data;
          }
          return chat;
        });
          dispatch(setAllChats(updatedChats)); //->>>>>>
      }
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  useEffect(() => {
    getMessages();
    if(selectedChat?.lastMessage?.senderId!== user._id ) {
      clearUnreadMessages();
    } 
   
   
    socket.off('receive-message').on('receive-message',(message)=>{
       const selectedChat = store.getState().usersReducer.selectedChat;
       if (selectedChat._id===message.chat) {
      // setAllMessages((prevMessages => [...prevMessages, message]));
      // console.log('Message received:', message);
      setAllMessages((prevMessages) => [...prevMessages, {
      ...message,
      chatId: message.chat,       // normalize for render
      senderId: message.sender 
    }]);
       }
       
        if(selectedChat?._id===message.chat && message.sender !== user._id) {
          clearUnreadMessages();
        }
    })

    socket.off('message-count-cleared').on('message-count-cleared',(data)=>{
      const selectedChat = store.getState().usersReducer.selectedChat;
      const allChats = store.getState().usersReducer.allChats;

      if(selectedChat?._id === data.chat) {
        // updating unread count in chat list
        const updatedChats = allChats.map((Chat) => {
          if(Chat._id === data.chat){
            return {
              ...Chat,
              unreadMessagesCount: 0
            }
          }
          return Chat;
      })
      dispatch(setAllChats(updatedChats));
      // updating read property in message object
      setAllMessages(prev=>{
        return prev.map(msg=>{
          return {
            ...msg,
            read: true
          }
        })
      })
      }
    })

    socket.on('started-typing',(data)=>{
      if(data.chatId === selectedChat._id && data.senderId !== user._id) {
        setIsTyping(true);
        setTimeout(()=>{
          setIsTyping(false);
        },2000)
      }
    })
    // alert('useEffect called',d1);
    // return () => socket.off('receive-message')
  
  }, [selectedChat]);

  useEffect(() => {
    const msgContainer = document.getElementById("main-chat-area");
    if (msgContainer) {
      msgContainer.scrollTop = msgContainer.scrollHeight;
    }
  }, [allMessages,isTyping]);
  return (
    <>
      {/* <h2>Chat Area</h2> */}
      {selectedChat && (
        <div className="app-chat-area">
          <div className="app-chat-area-header">
            {/* <!--RECEIVER DATA--> */}
            {selectedUser.firstname} {selectedUser.lastname}
          </div>
          <div className="main-chat-area" id="main-chat-area">
            {/* <!--Chat Area--> */}
            {allMessages.map(msg=>{
              const isCurrentUserSender = msg.senderId === user._id
              return <div className="message-container" 
              style={isCurrentUserSender ? { justifyContent: "end" } : { justifyContent: "start" }}>
                <div>
              <div className={isCurrentUserSender ? "send-message" : "received-message"}>{msg.text}</div>
              <div className="message-timestamp" style={isCurrentUserSender?{float:"right"}:{float:"left"}}>
                {formattime(msg.createdAt)} {isCurrentUserSender && msg.read && 
                <i className="fa fa-check" aria-hidden="true" style={{ color: "blue" }}></i>}
                </div>
              </div>
            </div>
            })}  
            {isTyping && (
              <div className="typing-indicator">
                <i>typing...</i>
              </div>
            )}
          </div>
         { showEmojiPicker && <div>
            <EmojiPicker onEmojiClick={(e ) =>{
              setMessage(prev=>prev+e.emoji);
              // setShowEmojiPicker(false);
            }}></EmojiPicker>
            </div>}
          <div className="send-message-div">
            <input
              type="text"
              className="send-message-input"
              placeholder="Type a message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                socket.emit('user-typing',{
                  chatId: selectedChat._id,
                  members: selectedChat.members.map((member) => member._id),
                  senderId: user._id
                })
              }}
            />

            <button
              className="fa fa-smile-o send-emoji-btn"
              aria-hidden="true"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            ></button>

            {message &&(<button
              className="fa fa-paper-plane send-message-btn"
              aria-hidden="true"
              
              onClick={sendMessage}
            ></button>)}
          </div>
        </div>
      )}
    </>
  );
}

export default ChatArea;
