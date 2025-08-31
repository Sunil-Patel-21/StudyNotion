import OTP from "../models/OTPModel.js";
import User from "../models/UserModel.js";
import otpGenerator from "otp-generator";
import Profile from "../models/ProfileModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// sendOTP

// export const sendOTP = async (req, res) => {
//   try {
//     // 1. Fetch email from req.body
//     const { email } = req.body;

//     // 2. Check if user already exists
//     const checkUserPresent = await User.findOne({ email });
//     if (checkUserPresent) {
//       return res.status(400).json({
//         success: false,
//         message: "User already registered",
//       });
//     }

//     // 3. Generate OTP (numeric only)
//     let otp = otpGenerator.generate(6, {
//       upperCaseAlphabets: false,
//       lowerCaseAlphabets: false,
//       specialChars: false,
//     });

//     console.log("Generated OTP:", otp);

//     // 4. OPTIONAL: Ensure OTP not already used for the same email
//     let existing = await OTP.findOne({ email, otp });
//     while (existing) {
//       otp = otpGenerator.generate(6, {
//         upperCaseAlphabets: false,
//         lowerCaseAlphabets: false,
//         specialChars: false,
//       });
//       existing = await OTP.findOne({ email, otp });
//     }

//     // 5. Save OTP with email in DB
//     const otpPayload = { email, otp };
//     const otpEntry = await OTP.create(otpPayload);

//     console.log("OTP stored in DB:", otpEntry);

//     // ⚠️ Instead of sending OTP back in response, send it via Email/SMS
//     res.status(200).json({
//       success: true,
//       message: "OTP sent successfully",
//       // otp, // ❌ don’t send OTP in response in production
//     });

//   } catch (error) {
//     console.error("Error in sendOTP function:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

export const sendOTP = async (req, res) => {
    try {

        // 1 Fetch email from req.body 
        const { email } = req.body;

        // 2 Check if user already exist 
        const checkUserPresent = await User.findOne({ email });

        // 3 if user already exist, then return a response
        if (checkUserPresent) {
            return res.status(400).json({
                success: false,
                message: "User already registered"
            })
        };

        // 4 generate otp
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });

        console.log("Generated otp : ", otp);

        // 5 check unique otp or not , if no then generate otp again until its unique
        let result = await OTP.findOne({ otp: otp });
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            });
            result = await OTP.findOne({ otp: otp });
        }

        // 6 push data into otp model
        const otpPayload = { email, otp };

        // 7 create an entry for otp
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp
        })


    } catch (error) {
        console.error("Error in sendOTP function : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error :",
            error: error.message
        })
    }
}
// signup

export const signup = async (req, res) => {
    try {

        // 1 Fetch data from req.body 
        const { email, firstName, lastName, password, confirmPassword, accountType, otp, contactNumber } = req.body;

        // 2 apply  validation to  data
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }

        // 3 compare password 
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and confirm password does not match"
            })
        }

        //4 check user already exist
        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({
                success: false,
                message: "User already exist."
            })
        }

        //5 find recent otp stored from user model
        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

        // 6 validate otp
        if (recentOtp.length == 0) {
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            })
        } else if (otp != recentOtp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            })
        }

        // 7 hash pass
        const hashedPassword = bcrypt.hash(password, 10)

        // 8 create entry for profile model
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null
        });

        // 9 create entry in db 
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            contactNumber,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user
        })

    } catch (error) {
        console.error("Error in signup function : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error :",
            error: error.message
        })
    }
}

// login
export const login = async (req, res) => {
    try {

        // 1 Fetch data from req.body 
        const { email, password } = req.body;

        // 2 apply  validation to  data
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }

        // 3 check user exist
        const user = await User.findOne({ email }).populate("additionalDetails");
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            })
        }

        // 4 compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            })
        }

        // 5 generate jwt token
        const payload = {
            email: user.email,
            id: user._id,
            accountType: user.accountType
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "2h",
        })

        user.token = token;
        user.password = undefined;
        // 6 create cookie  and send response
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            sameSite: "strict"
        }

        res.cookie("token", token, options).status(200).json({
            success: true,
            message: "User logged in successfully",
            user
        })

    } catch (error) {
        console.error("Error in login function : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error :",
            error: error.message
        })
    }
}

// change password

export const changePassword = async (req, res) => {
    try {

        // 1 get data from body

        // 2 get oldPassword , newPassword, confirmNewPassword
        // 3 validation

        //4 update password in db
        // 5 send mail - Password updated
        // 6 send response



    } catch (error) {
        
    }
}


