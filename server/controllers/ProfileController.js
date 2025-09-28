import Profile from "../models/ProfileModel.js";
import User from "../models/UserModel.js";
import {uploadImageToCloudinary} from "../utils/imageUploader.js";

// update profile
export const updateProfile = async (req, res) => {
    try {

        // 1 get data
        const {
            dateOfBirth = "",
            about = "",
            contactNumber = "",
            gender = "",
        } = req.body;
        const id = req.user.id;

        // 2 validation
        if (!contactNumber || !gender || !id) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // 3 find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        // 4 update profile
        profileDetails.dateOfBirth = dateOfBirth
        profileDetails.about = about
        profileDetails.contactNumber = contactNumber
        profileDetails.gender = gender
        await profileDetails.save();
        // or 
        // const updatedProfile = await Profile.findByIdAndUpdate(profileId, {
        //     dateOfBirth,
        //     about,
        //     contactNumber,
        //     gender
        // }, { new: true });

        // 5 return response
        res.status(201).json({
            success: true,
            message: "Profile updated successfully.",
            profileDetails
        })
    } catch (error) {
        console.log("Error in updateProfile function : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        })
    }
}

export const deleteAccount = async (req, res) => {
    try {
        // 1 get data
        const id = req.user.id;
        // 2 validation
        const userDetails = await User.findById(id);
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: "User not found."
            })
        }
        // 3 delete profile
        await Profile.findByIdAndDelete(userDetails.additionalDetails);
        // 4 delete user
        await User.findByIdAndDelete(id);
        // 5 return response
        res.status(200).json({
            success: true,
            message: "Account  deleted successfully."
        })
    } catch (error) {
        console.log("Error in deleteProfile function : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        })
    }
}

export const getAllUserDetails = async (req, res) => {
    try {
        const id = req.user.id
        const userDetails = await User.findById(id)
            .populate("additionalDetails");
        console.log(userDetails)
        res.status(200).json({
            success: true,
            message: "User Data fetched successfully",
            data: userDetails,
        })
    } catch (error) {
        console.log("Error in get all user details function : ", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export const updateDisplayPicture = async (req, res) => {
    try {
        const displayPicture = req.files.displayPicture
        const userId = req.user.id
        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        )
        console.log(image)

        const updatedProfile = await User.findByIdAndUpdate(
            { _id: userId },
            { image: image.secure_url },
            { new: true }
        )

        res.send({
            success: true,
            message: `Image Updated successfully`,
            data: updatedProfile,
        })
    } catch (error) {
        console.log("Error in update display picture function : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message,

        })
    }
}

export const getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id
        let userDetails = await User.findOne({
            _id: userId,
        })
            .populate({
                path: "courses",
                populate: {
                    path: "courseContent",
                    populate: {
                        path: "subSection",
                    },
                },
            })
            .exec()
        userDetails = userDetails.toObject()
        var SubsectionLength = 0
        for (var i = 0; i < userDetails.courses.length; i++) {
            let totalDurationInSeconds = 0
            SubsectionLength = 0
            for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
                totalDurationInSeconds += userDetails.courses[i].courseContent[
                    j
                ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
                userDetails.courses[i].totalDuration = convertSecondsToDuration(
                    totalDurationInSeconds
                )
                SubsectionLength +=
                    userDetails.courses[i].courseContent[j].subSection.length
            }
            let courseProgressCount = await CourseProgress.findOne({
                courseID: userDetails.courses[i]._id,
                userId: userId,
            })
            courseProgressCount = courseProgressCount?.completedVideos.length
            if (SubsectionLength === 0) {
                userDetails.courses[i].progressPercentage = 100
            } else {
                // To make it up to 2 decimal point
                const multiplier = Math.pow(10, 2)
                userDetails.courses[i].progressPercentage =
                    Math.round(
                        (courseProgressCount / SubsectionLength) * 100 * multiplier
                    ) / multiplier
            }
        }

        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find user with id: ${userDetails}`,
            })
        }
        return res.status(200).json({
            success: true,
            data: userDetails.courses,
        })
    } catch (error) {
        console.log("Error in get enrolled courses function : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message,
        })
    }
}

export  const instructorDashboard = async (req, res) => {
    try {
        const courseDetails = await Course.find({ instructor: req.user.id })

        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course.studentsEnroled.length
            const totalAmountGenerated = totalStudentsEnrolled * course.price

            // Create a new object with the additional fields
            const courseDataWithStats = {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                // Include other course properties as needed
                totalStudentsEnrolled,
                totalAmountGenerated,
            }

            return courseDataWithStats
        })

        res.status(200).json({ courses: courseData })
    } catch (error) {
        console.log("Error in get enrolled courses function : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message,
        })
    }
}