// import { get } from 'mongoose';
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getLoggedUser } from '../apiCalls/users';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../redux/loaderSlice';

function ProjectedRoute({ children }) {
    const [user, setUser] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getLoggedInUser = async() => {
        try{
            dispatch(showLoader());
            const response = await getLoggedUser();
            dispatch(hideLoader());
            if(response.success){
                setUser(response.data);
                // document.write("Welcome "+response.data.firstname);
                // toast.success("jai ho"+response.data.message);
            }else{
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