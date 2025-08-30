import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema(
    {
        courseId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course"
        },
        completeVideos:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"SubSection"
        },
    }
);
const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema);
export default CourseProgress;