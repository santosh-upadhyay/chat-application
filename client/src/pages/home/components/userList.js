import { useDispatch, useSelector } from "react-redux";
import { createNewChat } from "../../../apiCalls/chat";
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import { setAllChats, setSelectedChat } from "../../../redux/usersSlice";
import toast from "react-hot-toast";
import moment from "moment";
import store from "../../../redux/store";
import { useEffect } from "react";

function UsersList({ users, searchKey, setSearchKey, socket, onlineUsers }) {
  const {
    allUsers,
    allChats,
    user: currentUser,
    selectedChat,
  } = useSelector((state) => state.usersReducer);

  const dispatch = useDispatch();

  // start new chat with searched user
  const startNewChat = async (searchedUserId) => {
    try {
      dispatch(showLoader());
      const response = await createNewChat([currentUser._id, searchedUserId]);
      dispatch(hideLoader());
      if (response.success) {
        toast.success(response.message);
        const newChat = response.data;
        dispatch(setAllChats([...allChats, newChat]));
        dispatch(setSelectedChat(newChat));
      }
    } catch (error) {
      dispatch(hideLoader());
      toast.error(error.message);
    }
  };

  // open existing chat with searched user
  const openChat = (selectedUserId) => {
    const chat = allChats.find((chat) => chat.members.map(m=>m._id).includes(currentUser._id) &&
      chat.members.map(m=>m._id).includes(selectedUserId))
    if (chat) {
      dispatch(setSelectedChat(chat));
    }
  };

  const IsSelectedChat = (user)=>{
    if(!selectedChat) return false;
    return selectedChat.members.map(m=>m._id).includes(user._id)
  }
  const getLastMessageTimeStamp = (userId)=>{
    const chat = allChats.find((chat) => chat.members.map(m=>m._id).includes(userId))
    if(!chat || !chat?.lastMessage) return "";
    return moment(chat.lastMessage?.createdAt).format("hh:mm A")
    // .fromNow();
  }

  const getlastMessage = (userId)=>{
    const chat = allChats.find((chat) => chat.members.map(m=>m._id).includes(userId))
    if(!chat) return "";
    const msgprefix = chat.lastMessage?.senderId === currentUser._id ? "You: " : "";
    return msgprefix + (chat?.lastMessage?.text || "").substring(0, 15);
  }
// {
//   chat: '6a09f528bad54efc557cb3ea',
//   sender: '6a08511ddf46f205c136b217',
//   text: 'hii',
//   members: [ '6a08511ddf46f205c136b217', '6a09f48ebad54efc557cb3e8' ],
//   read: false,
//   createdAt: '2026-05-31 17:47:59'
// }
  useEffect(() => {
    socket.off('receive-message').on('receive-message',(message)=>{
       const selectedChat = store.getState().usersReducer.selectedChat;
       const allChats = store.getState().usersReducer.allChats;
      //  console.log('Message received:', message);
        if (selectedChat?._id !== message.chat) {
          const updatedChats = allChats.map((Chat) => {
            if(Chat._id === message.chat){
              return {
                ...Chat,
                unreadMessagesCount: (Chat?.unreadMessagesCount || 0) + 1,
                lastMessage: message,
              }
            }
            console.log(Chat);
            return Chat;
        })
        dispatch(setAllChats(updatedChats));
      }
    })
  //    socket.on('receive-message', handleReceiveMessage);
  // return () => socket.off('receive-message', handleReceiveMessage);

  }, [allChats])

  // get unread message count for each chat
  const getUnreadMessageCount = (userId)=>{
    const chat = allChats.find((chat) => chat.members.map(m=>m._id).includes(userId))
    if(chat && chat.unreadMessagesCount && chat.lastMessage?.senderId !== currentUser._id) {
      return <div className="unread-message-counter"> {chat.unreadMessagesCount}</div>;
    }
    return "";
  }

  // filter users based on search key and existing chats
  return allUsers
    .filter((user) => {
      return (
        ((user.firstname.toLowerCase().includes(searchKey.toLowerCase()) ||
          user.lastname.toLowerCase().includes(searchKey.toLowerCase())) &&
          searchKey) ||
        allChats.some((chat) => chat.members.map(m=>m._id).includes(user._id))
      );
    })
    .map((user) => {
      return (
        <div
          className="user-search-filter"
          onClick={() => openChat(user._id)}
          key={user._id}
        >
          <div className={IsSelectedChat(user) ? "selected-user" : "filtered-user"}>
            <div className="filter-user-display">
              {user.profilePic &&
                <img
                  src={user.profilePic}
                  alt="Profile Pic"
                  className="user-profile-image"
                  style={onlineUsers.includes(user._id) ? {border:"3px solid green"} : {}}
                  // style={{border:"2px solid green"}}
                />}
              {!user.profilePic && (
                <div className={IsSelectedChat(user) ? "user-selected-avatar" : "user-default-avatar"} 
                style={onlineUsers.includes(user._id) ? {border:"3px solid green"} : {}}
                // style={{border:"2px solid green"}}
                >
                  {user.firstname.charAt(0).toUpperCase()}
                  {user.lastname.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="filter-user-details">
                <div className="user-display-name">
                  {user.firstname} {user.lastname}
                </div>
                <div className="user-display-email">{getlastMessage(user._id) || user.email}</div>
              </div>
              <div>
              {getUnreadMessageCount(user._id)}
              <div className="last-message-timestamp">{ getLastMessageTimeStamp(user._id)}</div>
              </div>
              {!allChats.find((chat) => chat.members.map(m=>m._id).includes(user._id)) && (
                <div className="user-start-chat">
                  <button
                    className="user-start-chat-btn"
                    onClick={() => startNewChat(user._id)}
                  >
                    Start Chat
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    });
}

export default UsersList;
