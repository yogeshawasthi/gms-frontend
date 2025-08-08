import './App.css';
import Sidebar from './Components/Sidebar/sidebar.js';
import Member from './Pages/Member/member.js';
import Dashboard from './Pages/Dashboard/dashboard.js';
import Home from './Pages/Home/home';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import GeneralUser from './Pages/GeneralUser/generalUser.js';
import MemberDetail from './Pages/MemberDetail/memberDetail.js';
import VerifyEmail from './Pages/VerfiyEmail/verifyemail.js';
import 'react-toastify/dist/ReactToastify.css';
import SuperAdmin from './Pages/SuperAdmin/superadmin.js';
import GymReport from './Pages/Report/GymReport.js';
import SuperAdminLoginPage from "./Pages/SuperAdmin/SuperAdminLoginPage";
import Report from './Pages/Report/Report.js';


function App() {
  const navigate = useNavigate();
  const location = useLocation(); // Add this

  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    // Allow superadmin page to be accessed without login
    if (location.pathname.startsWith('/superadmin')) return;

    let isLogedIn = localStorage.getItem("isLogin");
    if (isLogedIn) {
      setIsLogin(true);
      // Only redirect to dashboard if on login or root page
      if (location.pathname === "/" || location.pathname === "/login") {
        navigate("/dashboard");
      }
    } else {
      setIsLogin(false);
      // Only redirect to login if not already there
      if (location.pathname !== "/") {
        navigate('/');
      }
    }
  }, [localStorage.getItem("isLogin"), location.pathname]); // Add location.pathname as dependency

  const isSuperAdminPage = location.pathname.startsWith('/superadmin');

  return (
    isSuperAdminPage ? (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(90deg, #e0e7ff 0%, #fff 100%)"
      }}>
        <Routes>
          <Route path="/superadmin" element={<SuperAdmin />} />
          <Route path="/superadmin/login" element={<SuperAdminLoginPage />} />
        </Routes>
      </div>
    ) : (
      <div className="flex">
        {/* Sidebar */}
        {isLogin && <Sidebar />}

        {/* Main Content */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/member" element={<Member />} />
          <Route path="/specific/:page" element={<GeneralUser />} />
          <Route path="/member/:id" element={<MemberDetail />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/superadmin" element={<SuperAdmin />} />
          
          <Route path="/gym-report/:gymId" element={<GymReport />} />
        </Routes>
      </div>
    )
  );
}

export default App;
