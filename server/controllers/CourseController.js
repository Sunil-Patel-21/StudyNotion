import Course from "../models/CourseModel.js";
import Tag from "../models/TagsModel.js";
import User from "../models/UserModel.js";
import { uploadImageToCloudinary } from "../utils/imageUploader.js";


// create course

export const createCourse = async (req, res) => {
    try {

        // 1 fetch data from body
        const { courseName, courseDescription, whatYouWillLearn, price, tag } = req.body;

        // 2 get thumbnail
        const thumbnail = req.files.thumbnailImage;

        // 3 validation
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // 4 check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("instructorDetails : ", instructorDetails);

        if (!instructorDetails) {
            return res.status(400).json({
                success: false,
                message: "Instructor not found."
            })
        };

        // 5 check given tag is valid or not
        const tagDetails = await Tag.findById(tag);

        if (!tagDetails) {
            return res.status(400).json({
                success: false,
                message: "Tag details not found."
            })
        };

        // 6 upload image to cloudinary 
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        // 7 create entry fro new course
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
            { _id: instructorDetails._id },
            {
                $push: {
                    courses: newCourse._id
                }
            },
            { new: true }
        )

        // 9  update the tag schema
        //     await User.findByIdAndUpdate(
        //     { _id: tagDetails._id },
        //     {
        //         $push: {
        //             tags: tag
        //         }
        //     },
        //     { new: true }
        // )

        return res.status(200).json({
            success: true,
            message: "Course created successfully",
            data: newCourse
        })
    } catch (error) {
        console.log("Error in create course function : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        })
    }
}

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


