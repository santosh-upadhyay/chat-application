import { axiosInstance } from "./";

const getLoggedUser = async () => {  
    try {
        // alert("get logged user called");
        const response = await axiosInstance.get('/api/user/profile');
        // console.log(response.data);
        // alert(response.data.message);
        return response.data;
    } catch (error) {
        console.log(error);
    }       
}

const getAllUsers = async () => {  
    try {
        // alert("get logged user called");
        const response = await axiosInstance.get('/api/user/users');
        // console.log(response.data);
        // alert(response.data.message);
        return response.data;
    } catch (error) {
        console.log(error);
    }       
}

const uploadProfilePic = async (image) => {
    try {
        const response = await axiosInstance.post('/api/user/upload-profile-pic', { image });
        return response.data;
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        throw error;
    }

}

export { getLoggedUser, getAllUsers, uploadProfilePic };