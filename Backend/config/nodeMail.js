import nodemailer from 'nodemailer'

const OtpMailer = async () => {
    try {
        return nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EPASS
            }
        })
    } catch (error) {
        console.log(error.message);
        return false

    }
}
export default OtpMailer