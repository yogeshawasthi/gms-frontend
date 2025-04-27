import './App.css';
import Sidebar from './Components/Sidebar/sidebar.js';
import Member from './Pages/Member/member.js';
import Dashboard from './Pages/Dashboard/dashboard.js';
import Home from './Pages/Home/home';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function App() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    let isLogedIn = sessionStorage.getItem("isLogin");
    if (isLogedIn) {
      setIsLogin(true);
      // navigate("/dashboard");
    }else{
      navigate('/');
    }
  }, [sessionStorage.getItem("isLogin")]);

  return (
    <div className="flex ">
      {/* Sidebar */}
      {isLogin && <Sidebar />}

      {/* Main Content */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/member" element={<Member />} />
        </Routes>
    </div>
  );
}

export default App;
