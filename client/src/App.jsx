import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './screens/Login'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from './screens/Dashboard'
import ReceiptsManagement from './screens/ReceiptsManagement'
import VerifyEmail from "./screens/VerifyEmail";
import ForgotPassword from './screens/ForgotPass'
import ResetOtp from "./screens/ResetOTP";
import ResetPassword from "./screens/ResetPassword";
import ProductsManagement from './screens/ProductManagement'
import DeliveryOrders from './screens/Delivery'
import InternalTransfers from './screens/InternalTransfer'
import Setting from './screens/Setting'
import StockAdjustment from './screens/StockAdjustment'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset-otp" element={<ResetOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Internal" element={<InternalTransfers />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/stock" element={<StockAdjustment />} />
        <Route path="/product" element={<ProductsManagement />} />
        <Route path="/delivery" element={<DeliveryOrders />} />
        <Route path="/receipt" element={<ReceiptsManagement />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
