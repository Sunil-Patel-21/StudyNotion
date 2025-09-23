import mongoose from "mongoose";
import { instance } from "../config/razorpay.js";
import Course from "../models/CourseModel.js";
import User from "../models/UserModel.js";
import { mailSender } from "../utils/mailSender.js";

// capture the payment and initiate the Razorpay order
export const capturePayment = async (req, res) => {
    try {
        // 1. get courseId and userId
        const { course_id } = req.body;
        const userId = req.user.id;

        // 2. validation
        if (!course_id) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid course id",
            });
        }

        // 3. valid courseDetail
        let course;
        try {
            course = await Course.findById(course_id);
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: "Could not find the course",
                });
            }

            // 4. check if user already enrolled
            const uid = new mongoose.Types.ObjectId(userId);
            if (course.studentEnrolled.includes(uid)) {
                return res.status(400).json({
                    success: false,
                    message: "Student is already enrolled",
                });
            }
        } catch (error) {
            console.error("Error fetching course: ", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            });
        }

        // 5. create Razorpay order
        const amount = course.price;
        const currency = "INR";
        const options = {
            amount: amount * 100, // amount in paise
            currency,
            receipt: Math.random(Date.now()).toString(),
            notes: {
                courseId: course_id,
                userId,
            },
        };

        let paymentResponse;
        try {
            paymentResponse = await instance.orders.create(options);
            console.log("paymentResponse:", paymentResponse);
        } catch (error) {
            console.error("Error creating Razorpay order:", error);
            return res.status(500).json({
                success: false,
                message: "Could not initiate Razorpay order",
                error: error.message,
            });
        }

        // 6. send response to frontend
        res.status(200).json({
            success: true,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            courseThumbnail: course.thumbnail,
        });
    } catch (error) {
        console.error("Error in capturePayment:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// verify the payment
export const verifySignature = async (req, res) => {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const signature = req.headers["x-razorpay-signature"];

        // Verify signature
        const shasum = crypto.createHmac("sha256", webhookSecret);
        shasum.update(req.body); // raw body required
        const digest = shasum.digest("hex");

        if (signature !== digest) {
            return res.status(400).json({
                success: false,
                message: "Invalid signature"
            });
        }

        console.log("Payment verified successfully");

        // Extract courseId and userId from Razorpay notes
        const { courseId, userId } = req.body.payload.payment.entity.notes;

        try {
            // Enroll student in course
            const enrolledCourse = await Course.findByIdAndUpdate(
                courseId,
                { $push: { studentEnrolled: userId } },
                { new: true }
            );
            if (!enrolledCourse)
                return res.status(404).json({
                    success: false,
                    message: "Course not found"
                });

            const enrolledUser = await User.findByIdAndUpdate(
                userId,
                { $push: { enrolledCourses: courseId } },
                { new: true }
            );
            if (!enrolledUser)
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });

            // Send enrollment email
            await mailSender(
                enrolledUser.email,
                "Course Enrollment Successful",
                `Hi ${enrolledUser.name}, you have successfully enrolled in ${enrolledCourse.courseName}!`
            );

            // Send success response to Razorpay
            return res.status(200).json({
                success: true,
                message: "Payment verified and student enrolled"
            });

        } catch (error) {
            console.error("Error enrolling student:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message
            });
        }
    } catch (error) {
        console.error("Error in verifySignature:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
