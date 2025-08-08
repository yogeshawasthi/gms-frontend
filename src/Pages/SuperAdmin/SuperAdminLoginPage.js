// import React, { useState } from "react";
// import SuperAdminLogin from "../../Components/Superadmin/superadminlogin";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// const SuperAdminLoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       await axios.post(`${process.env.REACT_APP_API_URL}/superadmin/login`, { email, password }, { withCredentials: true });
//       localStorage.setItem("isSuperAdmin", "true");
//       toast.success("SuperAdmin logged in!");
//       navigate("/superadmin");
//     } catch (err) {
//       toast.error(err.response?.data?.error || "Login failed");
//     }
//   };

//   return (
//     <>
//       <ToastContainer />
//       <SuperAdminLogin
//         email={email}
//         setEmail={setEmail}
//         password={password}
//         setPassword={setPassword}
//         handleLogin={handleLogin}
//       />
//     </>
//   );
// };

// export default SuperAdminLoginPage;