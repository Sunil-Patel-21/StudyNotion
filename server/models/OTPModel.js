import mongoose from "mongoose";
import { mailSender } from "../utils/mailSender.js";

const OTPSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },
        otp: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            expires: 5 * 60,
            default: Date.now()
        }
    }
);

async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(email, "Verification email from StudyNotion", otp)
        console.log("Email sent successfully : ", mailResponse);
        return mailResponse;
    } catch (error) {
        console.log("Error in sendVerificationEmail function : ", error);
        throw error;
    }
}

OTPSchema.pre("save", async function (next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
})

const OTP = mongoose.model("OTP", OTPSchema);
export default OTP;