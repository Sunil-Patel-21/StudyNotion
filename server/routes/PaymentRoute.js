import express from "express";

import { auth, isStudent } from "../middlewares/authMiddleware.js";
import { capturePayment, verifySignature } from "../controllers/PaymentController.js";

const router = express.Router();

router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifyPayment",auth, isStudent, verifySignature)
// router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail);

export default router;
