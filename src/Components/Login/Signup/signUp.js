import React, { useState } from 'react';
import './signUp.css';
import Modal from '../../Modal/modal';
import ForgotPassword from '../../Forgotpassword/forgotPassword';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import { toast, ToastContainer, Slide } from 'react-toastify';
import loaderImage from '../../../images/loader2.webp';
import Loader from '../../Loader/loader';

const SignUp = ({ onToggle }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [forgotPassword, setForgotPassword] = useState(false);
    const [inputField, setInputField] = useState({
        gymName: "",
        userName: "",
        password: "",
        email: "",
        profilePic: "https://img.freepik.com/free-photo/low-angle-view-unrecognizable-muscular-build-man-preparing-lifting-barbell-health-club_637285-2497.jpg?t=st=1744370811~exp=1744374411~hmac=23008917d736bff1e1ab8072d9f52cb4554ac273bf45b657494358edc3de82c3&w=1380"
    });

    const [loaderImageState, setLoaderImageState] = useState(false); // for image upload
    const [registering, setRegistering] = useState(false); // for registration loader

    const handleOnChange = (event, name) => {
        const value = name === "email" ? event.target.value.toLowerCase() : event.target.value;
        setInputField({ ...inputField, [name]: value });
    };

    const handleClose = () => {
        setForgotPassword((prev) => !prev);
    };

    const uploadImage = async (event) => {
        setLoaderImageState(true);
        const files = event.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', 'gym-management');

        try {
            const response = await axios.post("https://api.cloudinary.com/v1_1/dnbtfydel/image/upload", data);
            const imageUrl = response.data.url;
            setLoaderImageState(false);
            setInputField({ ...inputField, profilePic: imageUrl });
        } catch (err) {
            console.log(err);
            setLoaderImageState(false);
        }
    };

    const validateForm = () => {
        if (!inputField.email) {
            toast.error("Email is required");
            return false;
        } else if (!/^[a-z0-9._%+-]+@gmail\.com$/.test(inputField.email)) {
            toast.error(" Please Provide Correct Gmail Address");
            return false;
        }

        if (!inputField.gymName) {
            toast.error("Gym name is required");
            return false;
        }

        if (!inputField.userName) {
            toast.error("Username is required");
            return false;
        }

        if (!inputField.password) {
            toast.error("Password is required");
            return false;
        } else if (inputField.password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return false;
        }

        return true;
    };
    const handleRegister = async () => {
        if (!validateForm()) return;

        setRegistering(true); // Show loader

        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, inputField)
            .then((resp) => {
                // Show toasts one after another with delays and effects
                toast.success("Your Registration of Gym has been received", {
                    autoClose: 4000,
                    transition: Slide
                });
                setTimeout(() => {
                    toast.info("Please wait for our admin to approve your gym", {
                        autoClose: 4000,
                        transition: Slide
                    });
                }, 4200);
                setTimeout(() => {
                    toast.error("Please Verify your email. Verification email was sent. Thank You", {
                        autoClose: 4000,
                        transition: Slide
                    });
                }, 8400);
                setTimeout(() => {
                    window.location.reload();
                }, 13000);
            })
            .catch(err => {
                const errorMessage = err.response?.data?.error || "Registration failed";
                toast.error(errorMessage, {
                    autoClose: 5000,
                    transition: Slide
                });
                // Check for your specific backend error message
                if (
                    errorMessage.includes("Failed to send verification email") ||
                    errorMessage.includes("wait for approval")
                ) {
                    setTimeout(() => {
                        window.location.href = "/"; // or use window.location.reload();
                    }, 5200); // Wait for toast to finish
                }
            })
            .finally(() => {
                setRegistering(false); // Hide loader
            });
    };

    return (
        <div className='customSignup w-1/3 p-10 mt-20 ml-20 bg-gray-50 bg-opacity-35 h-[450px] overflow-y-auto rounded-3xl '>
            {registering && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 w-screen h-screen">
                    <img
                        src={loaderImage}
                        alt="Loading..."
                        style={{
                            width: "100vw",
                            height: "100vh",
                            objectFit: "contain",
                            background: "transparent"
                        }}
                    />
                </div>
            )}

            <div className='font-sans text-white text-center text-3xl font-bold'>Register Your Gym</div>

            <label className='text-white block font-bold pt-4'>E-mail</label>
            <input
                type='text'
                value={inputField.email}
                onChange={(event) => handleOnChange(event, "email")}
                className='w-full my-2 p-2 rounded-lg'
                placeholder='Enter Email'
            />

            <label className='text-white font-bold block mb-2 pt-5'>Gym Name</label>
            <input
                type='text'
                value={inputField.gymName}
                onChange={(event) => handleOnChange(event, "gymName")}
                className='w-full mb-10 p-2 rounded-lg'
                placeholder='Enter Gym Name '
            />

            <label className='text-white font-bold block mb-2'>Username</label>
            <input
                type='text'
                value={inputField.userName}
                onChange={(event) => handleOnChange(event, "userName")}
                className='w-full mb-10 p-2 rounded-lg'
                placeholder='Enter Username'
            />

            <label className='text-white font-bold block mb-2'>Password</label>
            <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={inputField.password}
                    onChange={(event) => handleOnChange(event, "password")}
                    className='w-full mb-10 p-2 rounded-lg pr-10'
                    placeholder='Enter Password'
                />
                <span
                    className="absolute right-2 top-2   text-black cursor-pointer text-2xl"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ lineHeight: '1' }}
                >
                    {showPassword ? '🙈' : '👁️'}
                </span>
            </div>

            <label className='text-white font-bold block mb-2'>Profile Picture</label>
            <input type='file' onChange={(e) => { uploadImage(e) }} className='w-full mb-6 p-2 rounded-lg' />

            {
                loaderImageState && (
                    <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={2}>
                        <LinearProgress color="secondary" />
                    </Stack>
                )
            }

            <img src={inputField.profilePic} alt="Profile"
                className="mx-auto my-4 w-40 h-40 rounded-full object-cover shadow-md border-2 border-white"
            />

            <div
                className='p-2 w-[80%] border-2 bg-slate-800 mx-auto rounded-lg text-white text-center text-lg hover:bg-white hover:text-black font-semibold cursor-pointer'
                onClick={handleRegister}
            >
                Register
            </div>

            <div
                className='p-2 w-[80%] mt-5 border-2 bg-slate-800 mx-auto rounded-lg text-white text-center text-lg hover:bg-white hover:text-black font-semibold cursor-pointer'
                onClick={handleClose}
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
            <p className="text-white text-center mt-6">
                Already have an account?{" "}
                <span
                    className="text-yellow-400 underline cursor-pointer"
                    onClick={onToggle}
                >
                    Login here
                </span>
            </p>

            <ToastContainer />
        </div>
    );
};

export default SignUp;
