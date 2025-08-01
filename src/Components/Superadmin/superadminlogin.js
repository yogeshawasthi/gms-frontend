import React from "react";

const SuperAdminLogin = ({ email, setEmail, password, setPassword, handleLogin }) => (
  <div style={{
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(90deg, #e0e7ff 0%, #fff 100%)"
  }}>
    <div className="superadmin-login" style={{
      background: "#fff",
      padding: "2rem",
      borderRadius: "1rem",
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      minWidth: "320px"
    }}>
      <h2 style={{ color: "#4f46e5", fontWeight: 700, marginBottom: "1.5rem" }}>SuperAdmin Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: "1rem", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #ddd" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: "1.5rem", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #ddd" }}
      />
      <button
        onClick={handleLogin}
        style={{
          width: "100%",
          padding: "0.75rem",
          borderRadius: "0.5rem",
          background: "linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)",
          color: "#fff",
          fontWeight: 600,
          border: "none",
          cursor: "pointer"
        }}
      >
        Login
      </button>
    </div>
  </div>
);

export default SuperAdminLogin;