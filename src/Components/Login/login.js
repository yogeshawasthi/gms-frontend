import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loginField, setLoginField] = useState({ userName: "", password: "" });
    const navigate = useNavigate();

    const handleLogin = async () => {
        // if (loginField.userName && loginField.password) {
        //     sessionStorage.setItem("isLogin", true);
        //     navigate("/dashboard");
        // } else {
        //     alert("Please enter both username and password.");
        // }

        await axios.post("http://localhost:4000/auth/login", loginField, { withCredentials: true }).then((response) => {
            console.log(response.data);
            localStorage.setItem('gymName', response.data.gym.gymName);
            localStorage.setItem('gymPic', response.data.gym.profilePic);
            localStorage.setItem('isLogin', true);
            localStorage.setItem('token', response.data.token);

            navigate("/dashboard");

        }).catch(err => {
            const errorMessage = err.response.data.error;
            // console.log(errorMessage);
            toast.error(errorMessage)
        })
    };

    const handleOnChange = (event, name) => {
        setLoginField({ ...loginField, [name]: event.target.value });
    };


    return (
        <div className='w-1/3 p-10 mt-20 ml-20 bg-gray-50 bg-opacity-15 h-fit rounded-3xl'>
            <ToastContainer />
            <div className='font-sans font-bold  text-white text-center text-3xl'>Login</div>

            <label className='text-white block font-bold  pt-4  '>Enter Username</label>
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
                    className="absolute right-3 top-3 text-black cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
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
        </div>
    );
};

export default Login;