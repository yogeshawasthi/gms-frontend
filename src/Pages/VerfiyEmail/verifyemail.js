// Example: src/pages/VerifyEmail.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const VerifyEmail = () => {
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const email = params.get("email");

    if (token && email) {
      axios
        .get(`http://localhost:4000/auth/verify-email?token=${token}&email=${email}`)
        .then((res) => setMessage(res.data.message))
        .catch((err) =>
          setMessage(err.response?.data?.error || "Verification failed")
        );
    } else {
      setMessage("Invalid verification link.");
    }
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Email Verification</h2>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmail;