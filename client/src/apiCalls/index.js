import axios from 'axios';
export const axiosInstance = axios.create({
    headers: {}
});
axiosInstance.interceptors.request.use((config) => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
})