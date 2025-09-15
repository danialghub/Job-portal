import OtpMailer from '../config/nodeMail.js'
import fs from 'fs'
import path from 'path';


const sendOtp = async (otp, to, status) => {

    const htmlPath = path.join(process.cwd(), "view/EmailView.html");
    let htmlContent = fs.readFileSync(htmlPath, "utf-8");
    htmlContent = htmlContent.replace("{{OTP_CODE}}", otp);

    const mailOptions = {
        from: "DLAZ@gmail.com",
        to,
        subject: `کد تایید برای ${status} حساب`,
        html: htmlContent
    };

    try {
        const mailer = await OtpMailer()
        const result = await mailer.sendMail(mailOptions);
        console.log("ایمیل ارسال شد:", result.response);
        return true
    } catch (error) {
        console.log(error.message)
        return false
    }
}

export default sendOtp