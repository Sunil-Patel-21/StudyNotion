import "dotenv/config";
import express from "express";

import userRoute from "./routes/UserRoute.js";
import courseRoute from "./routes/CourseRoute.js";
import contactRoute from "./routes/ContactRoute.js";
import paymentRoute from "./routes/PaymentRoute.js";
import profileRoute from "./routes/ProfileRoute.js";

import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import fileUpload from "express-fileupload";
import cors from "cors";
import { cloudinaryConnect } from "./config/cloudinary.js";

const port = process.env.PORT || 5000;
const app = express();

// db connection
connectDB();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(fileUpload({ useTempFiles: true }));

// cloudinary connection
cloudinaryConnect();

// routes
app.use("/api/v1/auth/user", userRoute);
app.use("/api/v1/auth/course", courseRoute);
app.use("/api/v1/auth/contact", contactRoute);
app.use("/api/v1/auth/payment", paymentRoute);
app.use("/api/v1/auth/profile", profileRoute);

app.get("/", (req, res) => {
    res.send("Home Page")
});

app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
})