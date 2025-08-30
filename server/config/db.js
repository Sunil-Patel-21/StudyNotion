import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("mongodb connected...");
    } catch (error) {
        console.log("Error in mongodb connection...");
        console.error(error);
        process.exit(1);
    }
}