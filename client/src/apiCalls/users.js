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

export { getLoggedUser, getAllUsers }