import { mailSender } from "../utils/mailSender.js";

export const contactUsController = async (req, res) => {

    const { email, firstname, lastname, message, phoneNo, countrycode } = req.body
    console.log(req.body)
    try {
        const emailRes = await mailSender(
            email,
            "Your Data send successfully",
            contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
        )
        console.log("Email Res ", emailRes)
        return res.json({
            success: true,
            message: "Email send successfully",
        })
    } catch (error) {
        console.log("Error in contact us controller : ", error);
        return res.json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}