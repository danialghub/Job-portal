
import fs from 'fs'
import path from 'path';


import OtpMailer from '../config/nodeMail.js'

const sendOtp = async (code, to, status) => {

    const htmlPath = path.join(process.cwd(), "public", "EmailView.html");
    let htmlContent = fs.readFileSync(htmlPath, "utf-8");


    htmlContent = htmlContent.replace("{{OTP_CODE}}", code);

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