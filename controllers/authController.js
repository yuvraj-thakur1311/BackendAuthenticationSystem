const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client = require("../Blacklist") || {
    get: async () => null,
    set: async () => {},
};
const {sendOTP} = require("../utils/otp");
const validator = require("validator");

let otpStore = {};
function generateOTP(){
    return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.register = async (req, res) => {
    try {
        const {email , role} = req.body;
        if (!validator.isEmail(email)) 
            return res.status(400).json({
                success: false, 
                message: 'Invalid email'
          });

        if (role === "admin" && !email.endsWith("@gmail.com")) {
          return res.status(400).json({
            success: false,
            message: "Only Gmail accounts can register as admin"
         });
        }

        const otp = generateOTP();
        otpStore[email] = otp;

        await sendOTP(email, otp);
        res.status(200).json({ 
            success: true,
            message: "OTP sent to email" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false, 
            message: 'Some error Occured..' ,
        }); 
    }
}

exports.verifyOTP = async (req, res) => {
    try {
        const {email, otp , password , role} = req.body;
        if (!validator.isEmail(email)) 
            return res.status(400).json({
                success: false, 
                message: 'Invalid email...Dusri email deni padegi'
          });

        if (otpStore[email] !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP..Please try again"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            password: hashedPassword,
            role ,
            isVerified: true,
        });
        await newUser.save();

        delete otpStore[email]; 

        res.status(200).json({ 
            success: true,
            message: "OTP verified successfully" 
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false, 
            message: 'Some error Occured..' ,
        }); 
    }
}

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({ email });
        if (!user || !user.isVerified) 
            return res.status(404).json({
                success: false,
                message: "User not found or not verified"
            });

        const matchPass = await bcrypt.compare(password, user.password);
        if (!matchPass) 
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
             });


        const token = jwt.sign({ id: user._id  , role : user.role }, 
                      process.env.JWT_SECRET, 
                      { expiresIn: "1h" });

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false, 
            message: 'Login unsuccessfulll..Please try again with a valid email and password' ,
        }); 
    }
}

exports.getUserData = async(req , res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) 
            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        res.status(200).json({
            success: true,
            message: "User data fetched successfully",
            user : {
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false, 
            message: 'Some error Occured..' ,
        }); 
    }
}

exports.getAdminData = async(req , res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) 
            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        if (user.role !== "admin") 
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });

        res.status(200).json({
            success: true,
            message: "Admin data fetched successfully",
            user : {
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false, 
            message: 'Some error Occured..' ,
        }); 
    }
}

exports.logout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) 
            return res.status(401).json({
                success: false,
                message: "Token missing.."
            });

        await client.set(token, "blacklisted", 'EX', 60*60); 

        res.status(200).json({
            success: true,
            message: "Logout successfulllyy..."
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false, 
            message: 'Some error Occured..' ,
        }); 
    }
}

