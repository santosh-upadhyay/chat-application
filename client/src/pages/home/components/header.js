import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Header({ socket }) {

    const { user } = useSelector((state) => state.usersReducer);
    const navigate = useNavigate();
    // console.log("user in header", user);
    function getFullName(){
        if(!user) return "";
        let fname = user?.firstname.toUpperCase();
        let lname = user?.lastname.toUpperCase();
        return fname +" "+ lname;
    }
    function getInitials(){
        if(!user) return "";
        let f = user?.firstname.toUpperCase()[0];
        let l = user?.lastname.toUpperCase()[0];
        return f + l;
    }
    const logout = () => {
        localStorage.removeItem("token");
        navigate('/login');
        socket.emit('user-logout',user._id);

    }
  return (
    <div className="app-header">
      <div className="app-logo">
        <i className="fa fa-comments" aria-hidden="true"></i>
        Quick Chat
      </div>
      <div className="app-user-profile">
        {!user?.profilePic && <div className="logged-user-profile-pic" onClick={()=>navigate('/profile')}>
          {getInitials()}
        </div>}
        {user?.profilePic && <img src={user.profilePic} alt="Profile Pic" className="logged-user-profile-pic" onClick={()=>navigate('/profile')} />}
        <div className="logged-user-name">{getFullName()}</div>
        
        <button className="logout-button" onClick={logout}>
          <i className="fa fa-power-off"></i>
        </button>
      </div>
    </div>
  );
}
export default Header;