import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Profile() {
    const { user} = useSelector((state) => state.usersReducer);
    const [image,setImage] = useState('');
    useEffect(()=>{
        if(user?.profilePic){
            setImage(user.profilePic);
        }
    },[user])
    function getInitials(){
        if(!user) return "";
        let f = user?.firstname.toUpperCase()[0];
        let l = user?.lastname.toUpperCase()[0];
        return f + l;
    }
    function getFullName(){
        if(!user) return "";
        let fname = user?.firstname.toUpperCase();
        let lname = user?.lastname.toUpperCase();
        return fname +" "+ lname;
    }
     const onFileSelect=async(e)=>{
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async() =>{
            setImage(reader.result);    
        }
    }
    
    return (
        <div class="profile-page-container">
        <div class="profile-pic-container">
            {image && <img src={image} 
                 alt="Profile Pic" 
                 class="user-profile-pic-upload" 
            /> }
            {!image && (
                <div class="user-default-profile-avatar">
                    {getInitials()}
                </div>
            )}
        </div>

        <div class="profile-info-container">
            <div class="user-profile-name">
                <h1>{getFullName()}</h1>
            </div>
            <div>
                <b>Email: </b>{user?.email}
            </div>
            <div>
                <b>Account Created: </b>{moment(user?.createdAt).format('MMMM Do YYYY')}
            </div>
            <div class="select-profile-pic-container">
                <input type="file" onChange={onFileSelect} />
            </div>
        </div>
    </div>

    )
}

export default Profile;