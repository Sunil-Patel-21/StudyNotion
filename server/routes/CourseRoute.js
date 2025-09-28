import express from "express";

import { auth } from "../middlewares/authMiddleware.js";
import { isInstructor } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/authMiddleware.js";
import { isStudent } from "../middlewares/authMiddleware.js";
import { createCourse, getAllCourse, getCourseDetails } from "../controllers/CourseController.js";
import { createSection, deleteSection, updateSection } from "../controllers/SectionController.js";
import { createSubSection, deleteSubSection, updateSubSection } from "../controllers/SubSectionController.js";
import { categoryPageDetails, createCategory, showAllCategory } from "../controllers/CategoryController.js";
import { createRatingAndReview, getAllRating, getAverageRatingAndReview } from "../controllers/RatingAndReviewController.js";

const router = express.Router();

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse)
//Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection)
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection)
// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection)
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection)
// Get all Registered Courses
router.get("/getAllCourses", getAllCourse)
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails)
// Get Details for a Specific Courses
// router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// Edit Course routes
// router.post("/editCourse", auth, isInstructor, editCourse)
// Get all Courses Under a Specific Instructor
// router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
// Delete a Course
router.delete("/deleteSection", deleteSection)

// router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************

// Category can Only be Created by Admin
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategory)
router.post("/getCategoryPageDetails", categoryPageDetails)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRatingAndReview)
router.get("/getAverageRating", getAverageRatingAndReview)
router.get("/getReviews", getAllRating)

export default router;
