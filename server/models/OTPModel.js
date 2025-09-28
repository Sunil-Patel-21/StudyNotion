import mongoose from "mongoose";
import { mailSender } from "../utils/mailSender.js";

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5 * 60, // OTP expires in 5 minutes
    },
});

// Function to send verification email
async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(
            email,
            "Verification email from StudyNotion",
            `<h1>Your OTP is: ${otp}</h1>`
        );
        console.log("Email sent successfully:", mailResponse);
        return mailResponse;
    } catch (error) {
        console.error("Error in sendVerificationEmail:", error);
        throw error;
    }
}

// Pre-save hook → send email before saving OTP
OTPSchema.pre("save", async function (next) {
    if (this.isNew) {
        await sendVerificationEmail(this.email, this.otp);
    }
    next();
});

const OTP = mongoose.model("OTP", OTPSchema);
export default OTP;
