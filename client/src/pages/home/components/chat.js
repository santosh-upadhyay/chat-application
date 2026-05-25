import { useDispatch, useSelector } from "react-redux";

function ChatArea() {
  const { selectedChat,user } = useSelector((state) => state.usersReducer);
  const selectedUser = selectedChat.members.find(u=> u._id !== user._id )
  const dispatch = useDispatch();
  return (
    <>
      {/* <h2>Chat Area</h2> */}
      {selectedChat && (
        <div class="app-chat-area">
          <div class="app-chat-area-header">
            {/* <!--RECEIVER DATA--> */}
            {selectedUser.firstname} {selectedUser.lastname}
          </div>
          <div>
            {/* <!--Chat Area--> */}
            CHAT AREA
          </div>
          <div>
            {/* <!--SEND MESSAGE--> */}
            SEND MESSAGE
          </div>
        </div>
      )}
    </>
  );
}

export default ChatArea;
