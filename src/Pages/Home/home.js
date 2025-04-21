import React from "react";
import home_img from "../../images/home_img.jpg";
import home2_img from "../../images/home2.jpg";
import home3_img from "../../images/home3.jpg";

const Home = () => {
  return (
    <>
      <div className="w-full">
        <div  className="border-2 border-slate-800 bg-slate-800 text-white p-5 font-semibold text-xl">
            Welcome To Gym Management System</div>
      </div>
      <div className="w-full"> 
        <img className=" h-80vh w-80vh object-fill " src={home3_img} alt="Gym" />
      </div>
    </>
  );
};

export default Home;
