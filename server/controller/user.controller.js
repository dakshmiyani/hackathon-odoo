const User = require("../models/user.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {sendVerificationEmail} = require("../services/email.service");
const dotenv = require("dotenv");
dotenv.config();

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, loginId: user.loginId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, loginId: user.loginId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};
 
//
const signup = async (req, res) => {
  try {
    const { loginId, email, password } = req.body;

    if (!loginId || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (loginId.length < 6 || loginId.length > 12) {
      return res.status(400).json({ message: "Login ID must be 6–12 characters" });
    }

    const checkLogin = await User.findOne({ loginId });
    if (checkLogin) {
      return res.status(400).json({ message: "Login ID already exists" });
    }

    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
    if (!passRegex.test(password)) {
      return res.status(400).json({
        message: "Password must include lowercase, uppercase, special char & be >8 characters"
      });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    // OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      loginId,
      email,
      password: hashedPass,
      emailOtp: otp,
      emailOtpExpiry: Date.now() + 10 * 60 * 1000,
      isVerified: false
    });

    // Send email OTP
    await sendVerificationEmail(email, otp);

    // Create token
    const token = jwt.sign(
      { id: user._id, loginId: user.loginId, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Signup successful. Verification email sent.",
      token,
      user: {
        id: user._id,
        loginId: user.loginId,
        email: user.email,
        isVerified: user.isVerified
      }
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check already verified
    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // Check OTP
    if (user.emailOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check expiry
    if (user.emailOtpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Update verification
    user.isVerified = true;
    user.emailOtp = undefined;
    user.emailOtpExpiry = undefined;
    await user.save();

    // Create token
    const token = jwt.sign(
      { id: user._id, loginId: user.loginId, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Email verified successfully",
     
      user: {
        id: user._id,
        loginId: user.loginId,
        email: user.email,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


const login = async (req, res) => {
  try {
    const { loginId, password } = req.body;

    if (!loginId || !password) {
      return res.status(400).json({ message: "Login ID and password required" });
    }

    const user = await User.findOne({ loginId });
    if (!user) {
      return res.status(400).json({ message: "Invalid login credentials" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid login credentials" });
    }

    // Use your existing functions (unchanged)
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({ message: "Login successful",
      accessToken,
      refreshToken,
        user: { id: user._id, loginId: user.loginId, email: user.email, role: user.role },
     
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User with this email does not exist" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in DB
    user.emailOtp = otp;
    user.emailOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send OTP to email
    await sendVerificationEmail(email, otp);

    return res.status(200).json({
      message: "OTP sent successfully"
    });

  } catch (error) {
    console.log("Forgot password error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const verifyForgotOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check OTP
    if (user.emailOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check expiry
    if (user.emailOtpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // OTP verified → clear OTP fields (optional, you can keep until reset)
    // user.emailOtp = undefined;
    // user.emailOtpExpiry = undefined;
    // await user.save();

    return res.status(200).json({
      message: "OTP verified successfully"
    });

  } catch (error) {
    console.log("Verify forgot password OTP error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check both passwords are same
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // User must have OTP from forgot password flow
    if (!user.emailOtp || !user.emailOtpExpiry) {
      return res.status(400).json({
        message: "OTP verification required before resetting password"
      });
    }

    // Validate password (same rule used in signup)
    const passRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

    if (!passRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must include uppercase, lowercase, special char, and be >8 characters"
      });
    }

    // Hash new password
    const hashedPass = await bcrypt.hash(newPassword, 10);

    user.password = hashedPass;

    // Clear OTP fields so it cannot be reused
    user.emailOtp = undefined;
    user.emailOtpExpiry = undefined;

    await user.save();

    return res.status(200).json({
      message: "Password reset successfully"
    });

  } catch (error) {
    console.log("Reset password error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};




module.exports = {
  signup,
verifyEmail,
    login,
    forgotPassword,
    verifyForgotOtp,
    resetPassword,
  
};