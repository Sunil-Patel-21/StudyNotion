import mongoose from "mongoose";
import Category from "../models/CategoryModel.js";
import Course from "../models/CourseModel.js";
import User from "../models/UserModel.js";
import { uploadImageToCloudinary } from "../utils/imageUploader.js";



// create course

export const createCourse = async (req, res) => {
    try {
        // 1 fetch data from body || Tag means category
        const { courseName, courseDescription, whatYouWillLearn, price, tag } = req.body;

        // 2 get thumbnail
        const thumbnail = req.files?.thumbnailImage;

        // 3 validation
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // 4 check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("instructorDetails : ", instructorDetails);

        if (!instructorDetails) {
            return res.status(400).json({
                success: false,
                message: "Instructor not found."
            });
        }

        // 5 check given tag is valid or not (support both ObjectId and name)
        let tagDetails;
        if (mongoose.Types.ObjectId.isValid(tag)) {
            tagDetails = await Category.findById(tag);
        } else {
            tagDetails = await Category.findOne({ name: tag });
        }

        // validate category
        if (!tagDetails) {
            return res.status(400).json({
                success: false,
                message: "Tag details not found. Please provide a valid category id or name."
            });
        }

        // 6 upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        // 7 create entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price,
            tag: tagDetails._id,
            thumbnail: thumbnailImage.secure_url
        });

        // 8 add new course to user schema of instructor
        await User.findByIdAndUpdate(
            instructorDetails._id,
            { $push: { courses: newCourse._id } },
            { new: true }
        );

        // 9 update the category schema (optional, if you want category to store its courses)
        await Category.findByIdAndUpdate(
            tagDetails._id,
            { $push: { courses: newCourse._id } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Course created successfully",
            data: newCourse
        });
    } catch (error) {
        console.log("Error in create course function : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        });
    }
};

// getAllCourse
export const getAllCourse = async (req, res) => {
    try {

        const allCourses = await Course.find({},
            { courseName: true, price: true, thumbnail: true, ratingAndReviews: true, studentEnrolled: true }).populate("instructor");

        return res.status(200).json({
            success: true,
            message: "Data for all courses fetched successfully",
            data: allCourses
        })
    } catch (error) {
        console.log("Error in get all course function : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        })
    }
}

export const getCourseDetails = async (req, res) => {
    try {

        // 1 get course id which is sent by frontend in body
        const { courseId } = req.body;

        // 2 find course details
        const courseDetails = await Course.findById(courseId)
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                }
            })
            .populate("tag")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                }
            })

        // 3 validation
        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: "Course details not found."
            })
        }

        // 4 return response
        return res.status(200).json({
            success: true,
            message: "Course details fetched successfully",
            data: courseDetails
        })

    } catch (error) {
        console.log("Error in get course details function : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        })
    }
}
