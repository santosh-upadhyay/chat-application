import { axiosInstance } from ".";

// Fetch all chats for the current user
const getAllChats = async () => {
  try {
    const response = await axiosInstance.get("/api/chat/all-chats");
    return response.data;
  } catch (error) {
    console.error("Error fetching all chats:", error);
    throw error;
  }
};

// Create a new chat with specified members

const createNewChat = async (members) => {
  try {
    const response = await axiosInstance.post("/api/chat/create", { members });
    return response.data;
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
};
export { getAllChats, createNewChat };
