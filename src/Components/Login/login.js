// src/Components/Login/login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const Login = ({ onToggle }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginField, setLoginField] = useState({ userName: "", password: "" });
  const [verifyEmail, setVerifyEmail] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [showVerifySection, setShowVerifySection] = useState(false);
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

  const handleVerifyEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!verifyEmail) {
      toast.error("Please enter your email.");
      return;
    }
    if (!emailRegex.test(verifyEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setVerifying(true);
    try {
      // Call the backend to send the verification email
      const res = await axios.post("http://localhost:4000/auth/send-verification-email", { email: verifyEmail });
      toast.success(res.data.message || "Verification email sent. Please check your inbox.");
      setVerifyEmail("");
      setShowVerifySection(false);
    } catch (err) {
      toast.error(err.response?.data?.error || "Error sending verification email.");
    }
    setVerifying(false);
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

      {/* Button to show/hide Verify Email Section */}
      <div className="mt-8 text-center">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setShowVerifySection(!showVerifySection)}
        >
          {showVerifySection ? "Hide verify email" : "Verify your email"}
        </button>
      </div>

      {/* Expanding/Collapsing Verify Email Section */}
      {showVerifySection && (
        <div className="transition-all duration-300 ease-in-out mt-4 flex flex-col items-center">
          <label className="font-bold block mb-2 text-black">Verify your email</label>
          <input
            type="email"
            value={verifyEmail}
            onChange={e => setVerifyEmail(e.target.value)}
            className="w-2/3 p-2 rounded-lg mb-2 border"
            placeholder="Enter your email"
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleVerifyEmail}
            disabled={verifying}
          >
            {verifying ? "Verifying..." : "Send"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;
