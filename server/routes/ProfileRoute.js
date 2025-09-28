import express from "express";

import { auth, isInstructor } from "../middlewares/authMiddleware.js";

import {
    deleteAccount,
    updateProfile,
    getAllUserDetails,
    getEnrolledCourses,
    updateDisplayPicture,
    instructorDashboard
} from "../controllers/ProfileController.js";


const router = express.Router();

// Delete User Account
router.delete("/deleteProfile", auth, deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)

// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)

export default router;
