// import { axiosInstance } from "./";

import { axiosInstance,url } from ".";

const signupUser = async(user)=>{
    try{
        const response = await axiosInstance.post(url+'/api/user/register',user)
        return response.data;
    }
    catch(error){      
    console.log(error)
    }
}

const loginUser = async(user)=>{
    try{
        const response = await axiosInstance.post(url+'/api/user/login',user);
        return response.data;
    }
    catch(error){
        console.log(error);
    }
}

export { signupUser, loginUser }