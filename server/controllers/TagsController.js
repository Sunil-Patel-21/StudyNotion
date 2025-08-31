import Tag from "../models/TagsModel.js";

// create tag 
export const createTag = async (req, res) => {
    try {

        // 1 fetch data from req.body
        const { name, description } = req.body;

        // 2 validation
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // 3 create tag
        const tagDetails = await Tag.create({
            name,
            description
        });

        // 4 send response
        res.status(200).json({
            success: true,
            message: "Tag created successfully",
            tagDetails
        });

    } catch (error) {
        console.log("Error in createTag function : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

// get all tags
export const showAllTags = async (req, res) => {
    try {

        // 1 fetch data from db
        const allTags = await Tag.find({}, { name: 1, description: 1 });

        // 2 send response
        res.status(200).json({
            success: true,
            message: "All tags fetched successfully",
            allTags
        });
    } catch (error) {
        console.log("Error in showAllTags function : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}
