import UserModel from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import transporter from "../config/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "../config/emailTemplates.js";

export const register = async(req,res) => {

        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing details" });
    }
    try {
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
          return res.json({ success: false, message: "User Already Exists." });
        }
        const hashpasword = await bcrypt.hash(password, 10);
          const user = new UserModel({
            name,
            email,
            password: hashpasword,
          });
        await user.save();
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV ==='production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge:7*24*60*60*1000
        })
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Welcome Coder",
        text: `Welcome ${name} to Software World,Hopefully Your Journey is Fantastic with us you entered with email ${email}`,
      };
       transporter.sendMail(mailOptions, (err,emailres) => {
        if (err) {
          console.log(err.message);
        } else {
          console.log("res ");
          console.log(emailres);
        }
      });
        return  res
            .status(200)
            .json({ message: "user registered successfully", user });
        } catch (error) {
          console.log(error.message);
         return  res.status(500).json({ success: false, message: error.message });
        }
}

export const login = async(req,res) => {
  const { email, password } = req.body;
   if (!email || !password) {
     return res.json({ success: false, message: "Email and password are required" });
   }
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid email" });
    }
    const ispassword = await bcrypt.compare(password, user.password);
    if (!ispassword) {
      return res.json({ success: false, message: "Invalid Password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
   
    
    return res.json({ success: true, message: "successfully login" });
  } catch (error) { 
    console.log(error);
        return   res.json({ success: false, message: error.message });

  }
  
}

export const logout = (req,res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Logged out" });
  } catch (error) {
     console.log(error);
     return res.json({ success: false, message: error.message });
  }
}

export const sendVerifyOtp = async(req,res) => {
  try {
    const { userId } = req.body;
    const user = await UserModel.findById(userId);
    if (user.isAccountVerified) {
     return res.json({ success: false, message: "Account is Already Verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpiredAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verify OTP",
      // text:`Your Account verify Otp is ${otp}`
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace(
        "{{email}}",
        user.email
      ),
    };
    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: "Verification OTP sent on email" });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
}

export const verifyEmail = async(req,res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
   return res.json({ success: false, message: "Missing Credentials" });
  }
  try {
    const user = await UserModel.findById(userId);

    if (!user) {
        return  res.json({ success: false, message: "User not Found" });

    }
    if (user.verifyOtp != otp || user.verifyOtp==='') {
      return res.json({ success: false, message: "Invalid Otp" });
    }

    if (user.verifyOtpExpiredAt < Date.now()) {
          return  res.json({ success: false, message: "Otp is expired." });

    }
    user.isAccountVerified = true;
    user.verifyOtp = '';
      user.verifyOtpExpiredAt = 0;
    await user.save();
      res.json({ success: true, message: "Email Verified Successfully" });
    
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
}

export const isAuthenticated = (req,res) => {
  try {
    res.json({ success: true, message: "User Authenticatted successfully" });
  } catch (error) {
     console.log(error.message);
     res.json({ success: false, message: error.message });
  }
}

export const sendResetOtp = async (req, res) => {
  const {email} = req.body;
  if (!email) {
    return res.json({ success: false, message: "Email is Required" });
  }
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
          return res.json({ success: false, message: "User Not found" });

    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpiredAt = Date.now() +24 * 60 * 60 * 1000;
    user.save();
     const mailOptions = {
       from: process.env.SENDER_EMAIL,
       to: user.email,
       subject: "Password Reset OTP",
       //  text: `Your Password Reset Otp is ${otp}`,
       html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace(
         "{{email}}",
         email
       ),
     };
     await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Reset password otp send to your email" });
  } catch (error) {
     console.log(error.message);
     res.json({ success: false, message: error.message });
  }
}

export const resetPassword = async (req,res) => {
  const { email, otp ,newpassword} = req.body;
  if (!email || !otp || !newpassword) {
    return res.json({ success: false, message: "Missing Details" });
  }
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
              return res.json({ success: false, message: "User not found" });
    }
    if (user.resetOtp !== otp || user.resetOtp === '') {
              return res.json({ success: false, message: "Invalid OTP" });

    }
    if (user.resetOtpExpiredAt < Date.now()) {
              return res.json({ success: false, message: "Reset Password Expired" });

    }
    const hashedPass =await bcrypt.hash(newpassword,10);
    user.password = hashedPass;
    user.resetOtp = '';
    user.resetOtpExpiredAt = 0;
    await user.save();



        res.json({
          success: true,
          message: "Reset password Successfully"
        });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
}
