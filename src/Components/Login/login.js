// src/Components/Login/login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const Login = ({ onToggle }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginField, setLoginField] = useState({ userName: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:4000/auth/login", loginField, { withCredentials: true });
      localStorage.setItem('gymName', response.data.gym.gymName);
      localStorage.setItem('gymPic', response.data.gym.profilePic);
      localStorage.setItem('isLogin', true);
      localStorage.setItem('token', response.data.token);
      navigate("/dashboard");
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Login failed";
      toast.error(errorMessage);
    }
  };

  const handleOnChange = (event, name) => {
    setLoginField({ ...loginField, [name]: event.target.value });
  };

  return (
    <div className='w-1/3 p-10 mt-20 ml-20 bg-gray-50 bg-opacity-35 h-fit rounded-3xl'>
      <ToastContainer />
      <div className='font-sans font-bold text-white text-center text-3xl'>Login</div>

      <label className='text-white block font-bold pt-4'>Enter Username</label>
      <input
        value={loginField.userName}
        onChange={(event) => handleOnChange(event, "userName")}
        type='text'
        className='w-full my-2 p-2 rounded-lg'
        placeholder='Enter username'
      />

      <label className='text-white block font-bold pt-4'>Enter Password</label>
      <div className="relative">
        <input
          value={loginField.password}
          onChange={(event) => handleOnChange(event, "password")}
          type={showPassword ? 'text' : 'password'}
          className='w-full my-2 p-2 mb-10 rounded-lg pr-10'
          placeholder='Enter password'
        />
        <span
          className="absolute right-2 top-2 pt-2 text-black cursor-pointer text-2xl"
          onClick={() => setShowPassword(!showPassword)}
          style={{ lineHeight: '1' }}
        >
          {showPassword ? '🙈' : '👁️'}
        </span>
      </div>

      <div
        className='p-2 w-[80%] border-2 bg-slate-800 mx-auto rounded-lg text-white text-center text-lg hover:bg-white hover:text-black font-semibold cursor-pointer'
        onClick={handleLogin}
      >
        Login
      </div>

      <p className="text-white text-center mt-6">
        Don’t have an account Or Forget Password?{" "}
        <span
          className="text-yellow-400 underline cursor-pointer"
          onClick={onToggle}
        >
          Click here
        </span>
      </p>
    </div>
  );
};

export default Login;
