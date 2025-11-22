const express = require("express");
const authController = require("../controller/user.controller");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/verify-email", authController.verifyEmail);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-forgot-otp", authController.verifyForgotOtp);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
