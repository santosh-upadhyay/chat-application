import { axiosInstance } from ".";
const createNewMessage = async (message) => {
  try {
    const response = await axiosInstance.post("/api/message/new-message", message);
    return response.data;
  } catch (error) {
    console.error("Error creating message:", error);
    throw error;
  }
};

const getAllMessages = async (chatId) => {
  try {
    const response = await axiosInstance.get(`/api/message/all-messages/${chatId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export { createNewMessage, getAllMessages };