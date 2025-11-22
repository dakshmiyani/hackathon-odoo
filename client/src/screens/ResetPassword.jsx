import React, { useState } from "react";
import axios from "axios";
import { Lock } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const handleReset = async () => {
    if (password !== rePassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", {
        email,
        password,
      });

      alert("Password updated successfully!");
      navigate("/"); // back to login

    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4">
      <div className="bg-white/80 p-8 rounded-2xl shadow-xl max-w-md w-full">

        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Reset Password
        </h2>

        <p className="text-gray-600 text-center mb-4">
          Enter your new password for <b>{email}</b>
        </p>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border rounded-xl outline-none"
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border rounded-xl outline-none"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          onClick={handleReset}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          Reset Password
        </button>

      </div>
    </div>
  );
}
