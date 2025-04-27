import React, { useEffect, useState, userEffect } from "react";
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link,useLocation } from "react-router-dom";

const Sidebar = () => {
  const [greeting, setGreeting] = useState("");
  const location = useLocation();//Get Location



  const greetingMessage = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good Morning 🌄");
    } else if (currentHour < 18) {
      setGreeting("Good Afternoon ☀️");
    } else if (currentHour < 21) {
      setGreeting("Good Evening 🌅");
    } else {
      setGreeting("Good Knight 🌛")
    }

  }

  useEffect(() => {

    greetingMessage()
  }, [])


  return (
    <div className="w-1/4 h-[100vh] border-2 border-blue-900 bg-black text-white p-5">
      <div className="text-center  text-3xl font-extralight">Planet Fitness</div>
      <div className="flex  gap-5 my-5">
        <div className="w-[100px] h-[100px] rounded-lg overflow-hidden ">
          <img
            alt="gym pics"
            className="w-full h-full rounded-full"
            src="https://i.pinimg.com/736x/82/36/1c/82361ce6f01ab043ffac62fb2d455f7c.jpg"
          />
        </div>

        <div>
          <div className="text-2xl">{greeting}</div>
          <div className="text-2xl font-semibold mt-1"  >admin</div>
        </div>
      </div>
      <div className="  mt-10 py-10  border-t-2 border-gray-700">
        <Link  to={'/dashboard'} className={`flex  items-center gap-8 font-semibold text-xl bg-slate-800  rounded-xl p-3 cursor-pointer hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-black ${location.pathname === "/dashboard" ? 'border-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500' : ''}`}>
          <div><HomeIcon /></div>
          <div>Dashboard</div>

        </Link>

        <Link to={'/member'} className={`flex  items-center mt-5 gap-8 font-semibold text-xl bg-slate-800  rounded-xl p-3 cursor-pointer hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-black  ${location.pathname === "/member" ? 'border-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500' : ''}`}>
          <div><GroupIcon /></div>
          <div>Members</div>

        </Link>

        <div className="flex  items-center mt-5 gap-8 font-semibold text-xl bg-slate-800  rounded-xl p-3 cursor-pointer hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-black">
          <div><LogoutIcon /></div>
          <div>Logout</div>

        </div>

      </div>

    </div>
  );
};

export default Sidebar;
