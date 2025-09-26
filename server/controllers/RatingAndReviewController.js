import RatingAndReview from "../models/RatingAndReviewModel";
import Course from "../models/CourseModel.js";

// createRatingAndReview 
export const createRatingAndReview = async (req, res) => {
    try {

        // 1. get userId
        const userId = req.user.id;

        // 2. fetch data from req.body
        const { rating, review, courseId } = req.body;

        // 3. check if the user have been already enrolled in this course or not
        const courseDetails = await Course.findOne(
            {
                _id: courseId,
                studentsEnrolled: { $elemMatch: { $eq: userId } },
            });

        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: "You have not enrolled in this course.",
            });
        }

        // 4. check if user already reviewed this course or not
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId
        })

        if (alreadyReviewed) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this course."
            })
        }

        // 5. create review and rating
        const reviewRating = await RatingAndReview.create({
            user: userId,
            rating,
            review,
            course: courseId
        })

        // 6. update course with this rating and review
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    ratingsAndReviews: reviewRating._id
                }
            },
            { new: true }
        )

        // 7. return response
        return res.status(201).json({
            success: true,
            message: "Rating and review created successfully.",
            reviewRating,
            updatedCourse
        })

    } catch (error) {
        console.log("Error in create rating and review function : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        })
    }
}

// getAverageRatingAndReview
export const getAverageRatingAndReview = async (req, res) => {
    try {

        // 1. get course id
        const { courseId } = req.body;

        // 2 calculate average rating
        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId)  // this will convert normal courseId to objectId
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                }
            }
        ]);

        // 3. return response
        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating
            })
        } else {
            return res.status(200).json({
                success: true,
                message: "Average rating 0, no review yet.",
                averageRating: 0
            })
        }

    } catch (error) {
        console.log("Error in get average rating and review function : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        })
    }
}

// getAllRatingAndReviews
export const getAllRating = async (req, res) => {
    try {
        const allReviews = await RatingAndReview.find({})
            .sort({ rating: "desc" })
            .populate({
                path: "user",
                select: "firstName lastName email image",
            })
            .populate({
                path: "course",
                select: "courseName",
            });

        return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            data: allReviews,
        });

    } catch (error) {
        console.log("Error in get all rating and review function : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        })
    }
}


