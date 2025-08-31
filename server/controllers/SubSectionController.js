import SubSection from "../models/SubSectionModel.js";
import Section from "../models/SectionModel.js";
import { uploadImageToCloudinary } from "../utils/imageUploader.js";

// create sub section 
export const createSubSection = async (req, res) => {
    try {

        // 1 fetch data
        const { title, timeDuration, description,sectionId } = req.body;

        // 2 fetch video url
        const video = req.files.videoFile;

        // 3 validation
        if (!title || !timeDuration || !description || !video || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // 4 upload video to cloudinary
        const uploadDetails = uploadImageToCloudinary(video,process.env.FOLDER_NAME);

        // 5 create entry in db
        const subSectionDetails = await SubSection.create({
            title,
            timeDuration,
            description,
            video:uploadDetails.secure_url,
        })
        // 6 update section schema
        const updatedSection = await Section.findByIdAndUpdate(sectionId,{
            $push:{
                subSection:subSectionDetails._id
            }
        },{new:true})
        // log updated section here, after adding populate query

        // 7 return response
        return res.status(200).json({
            success: true,
            message: "Sub Section created successfully",
            updatedSection
        });
    } catch (error) {
        console.log("Error in create sub section function : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        })
    }
}

// updateSubSection 
export const updateSubSection = async(req,res)=>{
    try {

    }  catch (error) {
        console.log("Error in update sub section function : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        })
    }
}

// deleteSubSection
export const deleteSubSection = async(req,res)=>{
    try {
        
    }  catch (error) {
        console.log("Error in delete sub section function : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        })
    }
}