import axios from 'axios';

export const url = "https://chat-application-server-lmvk.onrender.com"||"http://localhost:5000";
export const axiosInstance = axios.create({
    headers: {}
});
axiosInstance.interceptors.request.use((config) => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
})