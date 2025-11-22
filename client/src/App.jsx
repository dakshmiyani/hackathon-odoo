import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './screens/Login'
// import Signup from './screens/Signup'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from './screens/Dashboard'
import ReceiptsManagement from './screens/ReceiptsManagement'
import VerifyEmail from "./screens/VerifyEmail";
import ForgotPassword from './screens/ForgotPass'
import ResetOtp from "./screens/ResetOTP";
import ResetPassword from "./screens/ResetPassword";
import ProductsManagement from './screens/ProductManagement'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
      {/* <nav style={{ display: "flex", gap: "15px" }}>
        <Link to="/">Login</Link>
        <Link to="/signup">Signup</Link>
      </nav> */}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset-otp" element={<ResetOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/product" element={<ProductsManagement />} />
        <Route path="/receipt" element={<ReceiptsManagement />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
