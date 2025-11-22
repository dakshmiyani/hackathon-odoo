import React, { useState } from "react";
import axios from "axios";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email,
      });

      alert("OTP sent to your email!");

      navigate("/reset-otp", { state: { email } }); // Go to OTP page
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4">
      <div className="bg-white/80 p-8 rounded-2xl shadow-xl backdrop-blur-lg max-w-md w-full">

        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Forgot Password
        </h2>

        <p className="text-gray-600 text-center mb-6">
          Enter your registered email to receive a reset OTP.
        </p>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleSendOTP}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>

      </div>
    </div>
  );
}
