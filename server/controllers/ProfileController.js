import Profile from "../models/ProfileModel.js";
import User from "../models/UserModel.js";

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
            message: "Account deleted successfully."
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

exports.getAllUserDetails = async (req, res) => {
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
        console.log("Error in get all user details function : ",error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}