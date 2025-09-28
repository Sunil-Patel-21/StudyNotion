import jwt from "jsonwebtoken";
// authentication 
export const auth = async (req, res, next) => {
    try {

        // extract token
        const token = req.cookies.token|| req.header("Authorization").replace("Bearer ", "");

        // if token missing, then return  response
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing. Please login first."
            })
        };

        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("decoded : ", decoded);

        // if token is valid, then find user
        req.user = decoded;
        next();

    } catch (error) {
        console.error("Error in auth middleware : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        })
    }
}

// authorization

// isStudent
export const isStudent = async (req,res,next)=>{
    try {
        if(req.user.accountType !== "Student"){
            return res.status(403).json({
                success: false,
                message: "This is a protected route for students only."
            })
        }
        next();
    } catch (error) {
        console.error("Error in isStudent middleware : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        })
    }
}

// isInstructor
export const isInstructor = async (req,res,next)=>{
    try {
        if(req.user.accountType !== "Instructor"){
            return res.status(403).json({
                success: false,
                message: "This is a protected route for instructors only."
            })
        }
        next();
    } catch (error) {
        console.error("Error in isInstructor middleware : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        })
    }
}

// isAdmin
export const isAdmin = async (req,res,next)=>{
    try {
        if(req.user.accountType !== "Admin"){
            return res.status(403).json({
                success: false,
                message: "This is a protected route for admins only."
            })
        }
        next();
    } catch (error) {
        console.error("Error in isAdmin middleware : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        })
    }
}

