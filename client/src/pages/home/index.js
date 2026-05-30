import Header from "./components/header";
import Sidebar from "./components/sidebar";
import ChatArea from "./components/chat";
import { useSelector } from "react-redux";
import {io} from 'socket.io-client';
import { useEffect } from "react";

const socket = io('http://localhost:5000');
function Home() {
  const { selectedChat,user } = useSelector((state) => state.usersReducer);
  

  useEffect(() => {
    if(user){
      socket.emit('join-room',user._id);
    }
  },[user])

  return (
    <div className="home-page">
      <Header></Header>
      <div className="main-content">
        <Sidebar socket={socket}></Sidebar>
        {selectedChat && <ChatArea socket={socket}></ChatArea>}
      </div>
      
    </div>
  );
}

export default Home;
