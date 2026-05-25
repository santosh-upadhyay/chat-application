import { useDispatch, useSelector } from "react-redux";
import { createNewChat } from "../../../apiCalls/chat";
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import { setAllChats, setSelectedChat } from "../../../redux/usersSlice";
import toast from "react-hot-toast";

function UsersList({ users, searchKey, setSearchKey }) {
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
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="Profile Pic"
                  className="user-profile-image"
                />
              ) : (
                <div className="user-default-avatar">
                  {user.firstname.charAt(0).toUpperCase()}
                  {user.lastname.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="filter-user-details">
                <div className="user-display-name">
                  {user.firstname} {user.lastname}
                </div>
                <div className="user-display-email">{user.email}</div>
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
