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

// categoryPageDetails
export const categoryPageDetails = async (req, res) => {
    try {

        // Get courses for the specified category
        const { categoryId } = req.body
        console.log("PRINTING CATEGORY ID: ", categoryId);
        const selectedCourses = await Category.findById(categoryId)
            .populate({
                path: "course",
                match: { status: "Published" },
                populate: "ratingAndReviews",
            })

        //console.log("SELECTED COURSE", selectedCourses)
        // Handle the case when the category is not found
        if (!selectedCourses) {
            console.log("Category not found.")
            return res
                .status(404)
                .json({ success: false, message: "Category not found" })
        }
        // Handle the case when there are no courses
        if (selectedCourses.course.length === 0) {
            console.log("No courses found for the selected category.")
            return res.status(404).json({
                success: false,
                message: "No courses found for the selected category.",
            })
        }

        // Get courses for other categories
        const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId },
            course: { $not: { $size: 0 } }
        })
        console.log("categoriesExceptSelected", categoriesExceptSelected)
        let differentCourses = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
                ._id
        )
            .populate({
                path: "course",
                match: { status: "Published" },
                populate: "ratingAndReviews",
            })

        //console.log("Different COURSE", differentCourses)
        // Get top-selling courses across all categories
        const allCategories = await Category.find()
            .populate({
                path: "course",
                match: { status: "Published" },
                populate: "ratingAndReviews",
            })

        const allCourses = allCategories.flatMap((category) => category.courses)
        const mostSellingCourses = await Course.find({ status: 'Published' })
            .sort({ "studentsEnrolled.length": -1 }).populate("ratingAndReviews") // Sort by studentsEnrolled array length in descending order

        res.status(200).json({
            selectedCourses: selectedCourses,
            differentCourses: differentCourses,
            mostSellingCourses,
            name: selectedCourses.name,
            description: selectedCourses.description,
            success: true
        })
    } catch (error) {
        console.log("Error in category page details function : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}
