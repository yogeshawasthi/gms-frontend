import React, { useState } from 'react';
import Login from '../../Components/Login/login';
import SignUp from '../../Components/Login/Signup/signUp';
import heroImage from '../../images/gym.png'

const Home = () => {
  const [showSignUp, setShowSignUp] = useState(false);

  const handleToggle = () => {
    setShowSignUp(prev => !prev);
  };

  return (
    <div className='w-full h-[100vh]'>
      <div className='border-2 border-slate-800 bg-slate-800 text-white p-5 font-semibold text-xl'>
        Welcome To Gym Management System
      </div>

      <div className=' w-full bg-cover flex justify-start items-center h-full bg-[url("https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")]'
      style={{
         backgroundImage: `url(${heroImage})`,
      }}>
        <div className='w-full lg:flex justify-start gap-40 pb-16 mb-20'>
          {showSignUp ? (
            <SignUp onToggle={handleToggle} />
          ) : (
            <Login onToggle={handleToggle} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
