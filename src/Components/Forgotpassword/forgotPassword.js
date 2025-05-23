import React, { useState } from 'react';
import Loader from '../Loader/loader';
import axios  from 'axios'; 
import { toast,ToastContainer } from 'react-toastify'; // toast container is being used to show the success and error messages


const ForgotPassword = () => {
    const [emailSubmit, setEmailSubmit] = useState(false);
    const [otpValidate, setOtpValidate] = useState(false);
    const [contentVal, setContentvalue] = useState("Submit Your Email");
    const [inputField, setInputField] = useState({ email: "", otp: "", newPassword: "" });
    const [loader,setLoader] = useState(false);

    const handleSubmit = () => {
        if (!emailSubmit) {

            sendOtp();

        } else if (emailSubmit && !otpValidate) {
            verifyOtp();
        }else{
            changePassword();
        }
    };


    const changePassword = async () => {
        setLoader(true);   
        await axios.post("http://localhost:4000/auth/reset-password", { email: inputField.email, newPassword: inputField.newPassword }).then((response) => {
            toast.success(response.data.message);
            setLoader(false);
        }).catch((err) => {
            toast.error("some Techinal Error Occured");
            console.log(err);
            setLoader(false);
        });
    }


    const sendOtp = async   () => {
        setLoader(true);

        await axios.post("http://localhost:4000/auth/reset-password/sendOtp", { email: inputField.email }).then((response) => {
             setEmailSubmit(true);
            setContentvalue("Submit Your OTP");
            toast.success(response.data.message);
            setLoader(false);

        }).catch((err) => {
            toast.error("some Techinal Error Occured");
            console.log(err);
            setLoader(false); 
        });   
    }
    

    const verifyOtp = async () => {
        setLoader(true);
        await axios.post("http://localhost:4000/auth/reset-password/checkOtp", { email: inputField.email, otp: inputField.otp }).then((response) => {
            setOtpValidate(true);
            setContentvalue("Submit Your New Password");
            toast.success(response.data.message);
            setLoader(false);
        }).catch((err) => {
            toast.error("some Techinal Error Occured");
            console.log(err);
            setLoader(false);
        });
    };

    const handleOnChange = (event, name) => {
        setInputField({ ...inputField, [name]: event.target.value });
    };

    console.log(inputField);

    return (
        <div className='w-full'>
            <div className='w-full mb-5 pl-5'>
                <div>Enter Your Email</div>
                <input
                    type='text'
                    value={inputField.email}
                    onChange={(e) => handleOnChange(e, "email")}
                    className='w-1/2 p-2 rounded-lg border-2 border-slate-400'
                    placeholder='Enter Email'
                />
            </div>
            {emailSubmit && (
                <div className='w-full mb-5 pl-5'>
                    <div>Enter Your OTP</div>
                    <input
                        type='text'
                        value={inputField.otp}
                        onChange={(e) => handleOnChange(e, "otp")}
                        className='w-1/2 p-2 rounded-lg border-2 border-slate-400'
                        placeholder='Enter OTP'
                    />
                </div>
            )}
            {otpValidate && (
                <div className='w-full mb-5 pl-5'>
                    <div>Enter Your New Password</div>
                    <input
                        type='password'
                        value={inputField.newPassword}
                        onChange={(e) => handleOnChange(e, "newPassword")}
                        className='w-1/2 p-2 rounded-lg border-2 border-slate-400'
                        placeholder='Enter New Password'
                    />
                </div>
            )}
            <div
                className='bg-slate-800 pt-2 text-white mx-auto w-1/3 p-2 rounded-md text-center font-medium cursor-pointer border hover:bg-slate-700 hover:text-gray-200 transition duration-300'
                onClick={() => handleSubmit()}
            >
                {contentVal}
            </div>
           {loader && <Loader/>}
           <ToastContainer/>
        </div>
    );
};

export default ForgotPassword;