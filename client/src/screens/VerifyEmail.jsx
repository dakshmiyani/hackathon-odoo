import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {}; // email passed from signup

  const [otp, setOtp] = useState("");

  const handleVerify = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-email",
        { email, otp }
      );

      alert("Email Verified Successfully!");
      navigate("/dashboard"); // go to login page
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Verify Your Email
        </h2>

        <p className="text-gray-600 text-center mb-4">
          Enter the 6-digit code sent to <b>{email}</b>
        </p>

        <input
          type="text"
          value={otp}
          maxLength={6}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-4 py-3 border rounded-xl text-center text-lg tracking-widest mb-4"
          placeholder="______"
        />

        <button
          onClick={handleVerify}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          Verify Email
        </button>
      </div>
    </div>
  );
}
