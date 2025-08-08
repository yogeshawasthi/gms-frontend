import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import SuperAdminLogin from "../../Components/Superadmin/superadminlogin";

const SuperAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [gyms, setGyms] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [approvedGyms, setApprovedGyms] = useState([]);
  const [showApproved, setShowApproved] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const isSuperAdmin = localStorage.getItem("isSuperAdmin");
    if (isSuperAdmin === "true") {
      setLoggedIn(true);
    }
  }, []);

  // Fetch pending gyms when logged in
  useEffect(() => {
    if (loggedIn && !showApproved) {
      axios
        .get("http://localhost:4000/auth/superadmin/get-pending-gyms", { withCredentials: true })
        .then(res => {
          const pendingGyms = res.data.gyms.filter(gym => gym.status === "pending");
          setGyms(pendingGyms);
        })
        .catch(() => toast.error("Failed to fetch gyms"));
    }
  }, [loggedIn, showApproved]);

  // Fetch approved gyms
  const fetchApprovedGyms = async () => {
    setActionLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/auth/superadmin/get-approved-gyms", { withCredentials: true });
      setApprovedGyms(res.data.gyms || []);
      setShowApproved(true);
    } catch (err) {
      toast.error("Failed to fetch approved gyms");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      await axios.post("http://localhost:4000/auth/superadmin/login", { email, password }, { withCredentials: true });
      localStorage.setItem("isSuperAdmin", "true");
      setLoggedIn(true);
      toast.success("SuperAdmin logged in!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    }
  };

  const handleLogout = async () => {
    await axios.post("http://localhost:4000/auth/superadmin/logout", {}, { withCredentials: true });
    localStorage.removeItem("isSuperAdmin");
    setLoggedIn(false);
    setGyms([]);
    setApprovedGyms([]);
    setShowApproved(false);
    toast.info("Logged out");
  };

  const handleApprove = async (gymId) => {
    setActionLoading(true);
    try {
      await axios.post("http://localhost:4000/auth/superadmin/change-status", { gymId, status: "approved" }, { withCredentials: true });
      setGyms(gyms => gyms.filter(gym => gym._id !== gymId));
      toast.success("Gym approved!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Approval failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (gymId) => {
    setActionLoading(true);
    try {
      await axios.post("http://localhost:4000/auth/superadmin/change-status", { gymId, status: "rejected" }, { withCredentials: true });
      setGyms(gyms => gyms.filter(gym => gym._id !== gymId));
      toast.error("Gym rejected!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Rejection failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (!loggedIn) {
    return (
      <>
        <ToastContainer />
        <SuperAdminLogin
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      </>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        maxHeight: "100vh",
        overflow: "auto",
        background: "linear-gradient(90deg, #e0e7ff 0%, #fff 100%)"
      }}
    >
      <ToastContainer />
      {actionLoading && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(255,255,255,0.6)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{
            border: "6px solid #e0e7ff",
            borderTop: "6px solid #6366f1",
            borderRadius: "50%",
            width: 48,
            height: 48,
            animation: "spin 1s linear infinite"
          }} />
          <span style={{ marginLeft: 16, fontSize: 20, color: "#6366f1" }}>Processing...</span>
          <style>
            {`@keyframes spin {0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);}}`}
          </style>
        </div>
      )}

      {/* Navbar */}
      <nav style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1.2rem 2.5rem",
        background: "#6366f1",
        color: "#fff",
        fontWeight: 600,
        fontSize: "1.2rem",
        boxShadow: "0 2px 8px #e0e7ff"
      }}>
        <span>SuperAdmin Dashboard</span>
        <button
          onClick={handleLogout}
          style={{
            background: "linear-gradient(90deg, #f87171 0%, #fbbf24 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "6px 18px",
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          Logout
        </button>
      </nav>

      {/* Toggle Buttons */}
      <div style={{ maxWidth: 900, margin: "2.5rem auto 0 auto", display: "flex", gap: "1rem" }}>
        <button
          onClick={() => setShowApproved(false)}
          style={{
            background: !showApproved ? "#6366f1" : "#e0e7ff",
            color: !showApproved ? "#fff" : "#6366f1",
            border: "none",
            borderRadius: "6px",
            padding: "10px 28px",
            fontWeight: 600,
            fontSize: "1rem",
            cursor: "pointer",
            boxShadow: !showApproved ? "0 2px 8px #e0e7ff" : "none"
          }}
        >
          Pending Gyms
        </button>
        <button
          onClick={fetchApprovedGyms}
          style={{
            background: showApproved ? "#22c55e" : "#dcfce7",
            color: showApproved ? "#fff" : "#22c55e",
            border: "none",
            borderRadius: "6px",
            padding: "10px 28px",
            fontWeight: 600,
            fontSize: "1rem",
            cursor: "pointer",
            boxShadow: showApproved ? "0 2px 8px #dcfce7" : "none"
          }}
        >
          Approved Gyms
        </button>
      </div>

      {/* Table */}
      <div style={{ maxWidth: 900, margin: "1.5rem auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #e0e7ff", padding: "2rem" }}>
        {showApproved ? (
          <>
            <h3 style={{ marginBottom: "1.5rem", color: "#22c55e" }}>Approved Gyms</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#dcfce7" }}>
                  <th style={{ padding: "18px", textAlign: "left", fontSize: "1.1rem" }}>Image</th>
                  <th style={{ padding: "18px", textAlign: "left", fontSize: "1.1rem" }}>Gym Name</th>
                  <th style={{ padding: "18px", textAlign: "left", fontSize: "1.1rem" }}>Email</th>
                  <th style={{ padding: "18px", textAlign: "left", fontSize: "1.1rem" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {approvedGyms.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "24px" }}>No approved gyms found.</td>
                  </tr>
                ) : approvedGyms.map(gym => (
                  <tr key={gym._id} style={{ borderBottom: "1px solid #f1f1f1", height: "90px" }}>
                    <td style={{ padding: "14px" }}>
                      <img
                        src={gym.profilePic && gym.profilePic.startsWith('http') ? gym.profilePic : "https://via.placeholder.com/96?text=No+Image"}
                        alt={gym.gymName}
                        style={{
                          width: "72px",
                          height: "72px",
                          objectFit: "cover",
                          borderRadius: "12px",
                          border: "2px solid #eee",
                          background: "#fafafa"
                        }}
                        onError={e => { e.target.src = "https://via.placeholder.com/96?text=No+Image"; }}
                      />
                    </td>
                    <td style={{ padding: "14px", fontSize: "1.1rem" }}>{gym.gymName}</td>
                    <td style={{ padding: "14px", fontSize: "1.1rem" }}>{gym.email}</td>
                    <td style={{ padding: "14px", fontSize: "1.1rem", color: "#22c55e", fontWeight: 600 }}>{gym.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <>
            <h3 style={{ marginBottom: "1.5rem", color: "#4f46e5" }}>Pending Gyms</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#e0e7ff" }}>
                  <th style={{ padding: "18px", textAlign: "left", fontSize: "1.1rem" }}>Image</th>
                  <th style={{ padding: "18px", textAlign: "left", fontSize: "1.1rem" }}>Gym Name</th>
                  <th style={{ padding: "18px", textAlign: "left", fontSize: "1.1rem" }}>Email</th>
                  <th style={{ padding: "18px", textAlign: "left", fontSize: "1.1rem" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {gyms.filter(gym => gym.status === "pending").map(gym => (
                  <tr key={gym._id} style={{ borderBottom: "1px solid #f1f1f1", height: "90px" }}>
                    <td style={{ padding: "14px" }}>
                      <img
                        src={gym.profilePic && gym.profilePic.startsWith('http') ? gym.profilePic : "https://via.placeholder.com/96?text=No+Image"}
                        alt={gym.gymName}
                        style={{
                          width: "72px",
                          height: "72px",
                          objectFit: "cover",
                          borderRadius: "12px",
                          border: "2px solid #eee",
                          background: "#fafafa"
                        }}
                        onError={e => { e.target.src = "https://via.placeholder.com/96?text=No+Image"; }}
                      />
                    </td>
                    <td style={{ padding: "14px", fontSize: "1.1rem" }}>{gym.gymName}</td>
                    <td style={{ padding: "14px", fontSize: "1.1rem" }}>{gym.email}</td>
                    <td style={{ padding: "14px", display: "flex", gap: "16px" }}>
                      <button
                        onClick={() => handleApprove(gym._id)}
                        style={{
                          background: "linear-gradient(90deg, #22c55e 0%, #60a5fa 100%)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          padding: "10px 28px",
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: "1rem"
                        }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(gym._id)}
                        style={{
                          background: "linear-gradient(90deg, #f87171 0%, #fbbf24 100%)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          padding: "10px 28px",
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: "1rem"
                        }}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default SuperAdmin;