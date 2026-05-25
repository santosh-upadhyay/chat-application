import { useDispatch, useSelector } from "react-redux";
import { createNewMessage, getAllMessages } from "../../../apiCalls/message";
import { useEffect, useState } from "react";

function ChatArea() {
  const { selectedChat, user } = useSelector((state) => state.usersReducer);
  const selectedUser = selectedChat.members.find((u) => u._id !== user._id);
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  // TODO: Implement the logic to send a message
  const sendMessage = async () => {
    // Implement the logic to send a message here
    try {
      const newMessage = {
        chat: selectedChat._id,
        sender: user._id,
        text: message,
      };
      // dispatch(showLoader());
      const response = await createNewMessage({ newMessage });
      // dispatch(hideLoader());
      if (response.success){
        setMessage("");
      }
      return response;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  const getMessages = async () => {
    // Implement the logic to send a message here
    try {
      // dispatch(showLoader());
      const response = await getAllMessages(selectedChat._id);
      // dispatch(hideLoader());
     if (response.success){
      setAllMessages(response.data);
     }
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  useEffect(() => {
      getMessages()
  }, [selectedChat]);

  return (
    <>
      {/* <h2>Chat Area</h2> */}
      {selectedChat && (
        <div class="app-chat-area">
          <div class="app-chat-area-header">
            {/* <!--RECEIVER DATA--> */}
            {selectedUser.firstname} {selectedUser.lastname}
          </div>
          <div className="main-chat-area">
            {/* <!--Chat Area--> */}
            CHAT AREA
          </div>
          <div class="send-message-div">
            <input
              type="text"
              className="send-message-input"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="fa fa-paper-plane send-message-btn"
              aria-hidden="true"
              onClick={sendMessage}
            ></button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatArea;
