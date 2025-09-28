import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First Name is required"],
            trim: true
        },
        lastName: {
            type: String,
            required: [true, "First Name is required"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "First Name is required"],
            trim: true
        },
        password: {
            type: String,
            required: [true, "First Name is required"],
        },
        accountType: {
            type: String,
            enum: ["Admin", "Student", "Instructor"],
            required: [true, "Account type is required"]
        },
        additionalDetails: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Profile",
        },
        courses: [
            {
                type: String,
                ref: "Course"
            }
        ],
        image: {
            type: String,
        },
        courseProgress: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "CourseProgress",
            }
        ],
        token:{
            type:String
        },
        resetPasswordExpire:{
            type:Date
        }
    },
    {
        timestamps: true
    }
);
const User = mongoose.model("User", userSchema);
export default User;