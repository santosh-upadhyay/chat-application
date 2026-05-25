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

export { createNewMessage };