import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function ResetOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const [otp, setOtp] = useState("");

  const handleVerifyOTP = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-forgot-otp", {
        email,
        otp,
      });

      alert("OTP Verified Successfully!");
      navigate("/reset-password", { state: { email } });

    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4">
      <div className="bg-white/80 p-8 rounded-2xl shadow-xl max-w-md w-full">

        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Verify OTP
        </h2>

        <p className="text-gray-600 text-center mb-4">
          Enter the 6-digit OTP sent to <b>{email}</b>
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
          onClick={handleVerifyOTP}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          Verify OTP
        </button>

      </div>
    </div>
  );
}
