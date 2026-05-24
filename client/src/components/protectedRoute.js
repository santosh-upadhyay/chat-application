// import { get } from 'mongoose';
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getAllUsers, getLoggedUser } from '../apiCalls/users';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoader, showLoader } from '../redux/loaderSlice';
import { setAllChats, setAllUsers, setUser } from '../redux/usersSlice';
import { getAllChats } from '../apiCalls/chat';

function ProjectedRoute({ children }) {
    const { user } = useSelector((state) => state.usersReducer);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getLoggedInUser = async() => {
        try{
            dispatch(showLoader());
            const response = await getLoggedUser();
            dispatch(hideLoader());
            if(response.success){
                dispatch(setUser(response.data));
                // document.write("Welcome "+response.data.firstname);
                // toast.success("jai ho"+response.data.message);
            }else{
                toast.error(response.message);
                navigate('/login');
            }
        }catch(error){
            // toast.error('Failed to fetch user details');
            dispatch(hideLoader());
            navigate('/login');
        }
    }

    const getAllUsers1 = async() => {
        try{
            dispatch(showLoader());
            const response = await getAllUsers();
            dispatch(hideLoader());
            if(response.success){
                dispatch(setAllUsers(response.data));
                // document.write("Welcome "+response.data.firstname);
                // toast.success("jai ho"+response.data.message);
            }else{
                toast.error(response.message);
                navigate('/login');
            }
        }catch(error){
            // toast.error('Failed to fetch user details');
            dispatch(hideLoader());
            navigate('/login');
        }
    }

    const getAllUserChats = async() => {
        try{
            dispatch(showLoader());
            const response = await getAllChats();
            dispatch(hideLoader());
            if(response.success){
                dispatch(setAllChats(response.data));
                // document.write("Welcome "+response.data.firstname);
                // toast.success("jai ho"+response.data.message);
            }else{
                toast.error(response.message);
                navigate('/login');
            }
        }catch(error){
            // toast.error('Failed to fetch user details');
            dispatch(hideLoader());
            navigate('/login');
        }
    }
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token){
            // token exists, user is authenticated, allow access to the protected route
            getLoggedInUser();
            getAllUsers1();
            getAllUserChats();
        }else{
            navigate('/login');
        }
    },[])

    return (
        <div>

            {/* <p>Name: {user?.firstname + ' ' + user?.lastname}</p> */}
            <p>{children}</p>
        </div>


);
}   

export default ProjectedRoute;