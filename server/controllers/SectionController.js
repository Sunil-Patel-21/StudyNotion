import Section from "../models/SectionModel.js";
import Course from "../models/CourseModel.js";

// create section
export const createSection = async (req, res) => {
    try {

        // 1 data fetch
        const { sectionName, courseId } = req.body;

        // 2 validation
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            })
        }

        // 3 create section
        const newSection = await Section.create({
            sectionName
        })

        // 4 update course schema => push section id into course schema
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId, {
            $push: {
                courseContent: newSection._id
            }
        }, { new: true });
        // use populate to replace sections and sub sections both in the updatedCourseDetails

        // 5 return response
        res.status(201).json({
            success: true,
            message: "Section created successfully.",
            updatedCourseDetails
        })
    } catch (error) {
        console.log("Error in create section function : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        })
    }
}

export const updateSection = async (req, res) => {
    try {

        // 1 fetch data 
        const { sectionName, sectionId } = req.body;

        // 2 validation
        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            })
        }

        // 3 update data
        const section = await Section.findByIdAndUpdate(sectionId, { sectionName }, { new: true });

        // 4 return response
        res.status(201).json({
            success: true,
            message: "Section updated successfully.",
            section
        })
    } catch (error) {
        console.log("Error in update section function : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        })
    }
}

export const deleteSection = async (req, res) => {
    try {
        // 1 fetch data
        const { sectionId } = req.params;

        // 2 validation
        if (!sectionId) {
            return res.status(400).json({
                success: false,
                message: "SectionId are required.",
            })
        };

        // 3 delete section
        await Section.findByIdAndDelete(sectionId);

        // Do we need to delete entry from the course schema

        // 4 return response
        res.status(200).json({
            success: true,
            message: "Section deleted successfully.",
        })

    } catch (error) {
        console.log("Error in delete section function : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        })
    }
}
