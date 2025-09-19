import express from 'express'
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from '../controllers/authController.js';
import UserAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.post("/logout", logout);
authRouter.post("/send-verify-otp",UserAuth, sendVerifyOtp);
authRouter.post("/verify-account",UserAuth, verifyEmail);
authRouter.get("/is-auth",UserAuth, isAuthenticated);
authRouter.post("/send-reset-otp", sendResetOtp);
authRouter.post("/reset-password", resetPassword);

export default authRouter;