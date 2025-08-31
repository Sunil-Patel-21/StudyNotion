import Category from "../models/CategoryModel.js";

// create tag 
export const createCategory = async (req, res) => {
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
        const categoryDetails = await Category.create({
            name,
            description
        });

        // 4 send response
        res.status(200).json({
            success: true,
            message: "Category created successfully",
            categoryDetails
        });

    } catch (error) {
        console.log("Error in create Category function : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

// get all tags
export const showAllCategory = async (req, res) => {
    try {

        // 1 fetch data from db
        const allCategory = await Category.find({}, { name: 1, description: 1 });

        // 2 send response
        res.status(200).json({
            success: true,
            message: "All Category fetched successfully",
            allCategory
        });
    } catch (error) {
        console.log("Error in showAllCategory function : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}
