import User from "../models/UserModel.js";
import { mailSender } from "../utils/mailSender.js";
import bcrypt from "bcrypt";

// resetPasswordToken
export const resetPasswordToken = async (req, res) => {
    try {

        // 1 fetch email from body
        const { email } = req.body

        // 2 check user for this email
        const user = await User.findOne({ email })

        // 3 validation
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            })
        }

        // 4 generate token
        const token = crypto.randomUUID();

        // 5 update user by adding token and token expire time
        const updatedDetails = await User.findOneAndUpdate({ email },
            { token: token, resetPasswordExpire: Date.now() + 5 * 60 * 1000 }, { new: true });

        // 6 create url
        const url = `http://localhost:3000/update-password/${token}`

        // 7 send mail
        await mailSender(email, "Reset Password", `<h1>Click on link to reset password : </h1> <p>${url}</p>`)
        // 8 return response
        res.status(200).json({
            success: true,
            message: "Email sent successfully, please check your email to reset password"
        })
    } catch (error) {
        console.error("Error in resetPasswordToken function:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

// resetPassword
export const resetPassword = async (req, res) => {
    try {

        // 1 fetch data
        const { token, password, confirmPassword } = req.body;

        // 2 validation
        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password and confirm password does not match"
            })
        }
        // 3 get user details from db using token
        const userDetails = await User.findOne({ token });

        // 4 if no entry => invalid token
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: "Invalid token"
            })
        }

        // 5 if token expired => invalid token
        if(userDetails.resetPasswordExpire > Date.now()){
            return res.status(400).json({
                success: false,
                message: "Token expired"
            })
        }

        // 6  hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 7 update password
        await User.findOneAndUpdate({ token }, { password: hashedPassword }, { new: true });

        // 8 return response
        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        })
    } catch (error) {
        console.log("Error in reset password function : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}