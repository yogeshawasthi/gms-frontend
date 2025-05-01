import React, { useState } from 'react';
import './signUp.css';
import Modal from '../../Modal/modal';
import ForgotPassword from '../../Forgotpassword/forgotPassword';
import axios from 'axios'

const SignUp = () => {
    const [forgotPassword, setForgotPassword] = useState(false);
    const [inputField, setInputField] = useState({
        gymName: "",
        userName: "",
        password: "",
        email: "",
        profilepic: "https://img.freepik.com/free-photo/low-angle-view-unrecognizable-muscular-build-man-preparing-lifting-barbell-health-club_637285-2497.jpg?t=st=1744370811~exp=1744374411~hmac=23008917d736bff1e1ab8072d9f52cb4554ac273bf45b657494358edc3de82c3&w=1380"
    });

    const handleOnChange = (event, name) => {
        setInputField({ ...inputField, [name]: event.target.value });
    };
    console.log(inputField);

    const handleClose = () => {
        setForgotPassword((prev) => !prev);
    };

   const uploadImage =async(event)=>{
    
    console.log("Image Uploading")
    const files = event.target.files;
    const data = new FormData();
    data.append('file',files[0]);

    // dnbtfydel

    data.append('upload_preset','gym-management');

    try{
        const response = await axios.post("https://api.cloudinary.com/v1_1/dnbtfydel/image/upload", data);
        console.log(response)
        const imageUrl = response.data.url;
        setInputField({...inputField,['profilepic']:imageUrl})
    }catch(err){
        console.log(err)
    }

   }



    return (
        <div className='customSignup w-1/3 p-10 mt-20 ml-20 bg-gray-50 bg-opacity-50 h-[450px] overflow-y-auto'>
            <div className='font-sans text-white text-center text-3xl'>Register Your Gym</div>
            <input
                type='text'
                value={inputField.email}
                onChange={(event) => handleOnChange(event, "email")}
                className='w-full my-10 p-2 rounded-lg'
                placeholder='Enter Email'
            />
            <input
                type='text'
                value={inputField.gymName}
                onChange={(event) => handleOnChange(event, "gymName")}
                className='w-full mb-10 p-2 rounded-lg'
                placeholder='Enter Gym Name'
            />
            <input
                type='text'
                value={inputField.userName}
                onChange={(event) => handleOnChange(event, "userName")}
                className='w-full mb-10 p-2 rounded-lg'
                placeholder='Enter userName'
            />
            <input
                type='password'
                value={inputField.password}
                onChange={(event) => handleOnChange(event, "password")}
                className='w-full mb-10 p-2 rounded-lg'
                placeholder='Enter Password'
            />
            <input type='file' onChange={(e)=>{uploadImage(e)}} className='w-full mb-6 p-2 rounded-lg' />
            <img src={inputField.profilepic} alt="Profile" />
            <div className='p-2 w-[80%] border-2 bg-slate-800 mx-auto rounded-lg text-white text-center text-lg hover:bg-white hover:text-black font-semibold cursor-pointer'>
                Register
            </div>
            <div
                className='p-2 w-[80%] mt-5 border-2 bg-slate-800 mx-auto rounded-lg text-white text-center text-lg hover:bg-white hover:text-black font-semibold cursor-pointer'
                onClick={() => handleClose()}
            >
                Forgot Password
            </div>
            {forgotPassword && (
                <Modal
                    header="Forgot Password"
                    handleClose={handleClose}
                    content={<ForgotPassword />}
                />
            )}
        </div>
    );
};

export default SignUp;