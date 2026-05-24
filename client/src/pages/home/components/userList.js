import { useDispatch, useSelector } from "react-redux";
import { createNewChat } from "../../../apiCalls/chat";
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import { setAllChats } from "../../../redux/usersSlice";
import toast from "react-hot-toast";

function UsersList({ users, searchKey, setSearchKey }) {
  const {
    allUsers,
    allChats,
    user: currentUser,
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
      }
    } catch (error) {
      dispatch(hideLoader());
      toast.error(error.message);
    }
  };

  // filter users based on search key and existing chats
  return allUsers
    .filter((user) => {
      return (
        ((user.firstname.toLowerCase().includes(searchKey.toLowerCase()) ||
          user.lastname.toLowerCase().includes(searchKey.toLowerCase())) &&
          searchKey) ||
        allChats.some((chat) => chat.members.includes(user._id))
      );
    })
    .map((user) => {
      return (
        <div class="user-search-filter">
          <div class="filtered-user">
            <div class="filter-user-display">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="Profile Pic"
                  class="user-profile-image"
                />
              ) : (
                <div class="user-default-profile-pic">
                  {user.firstname.charAt(0).toUpperCase()}
                  {user.lastname.charAt(0).toUpperCase()}
                </div>
              )}
              <div class="filter-user-details">
                <div class="user-display-name">
                  {user.firstname} {user.lastname}
                </div>
                <div class="user-display-email">{user.email}</div>
              </div>

              {!allChats.find((chat) => chat.members.includes(user._id)) && (
                <div class="user-start-chat">
                  <button
                    class="user-start-chat-btn"
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
