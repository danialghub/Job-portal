
import fs from 'fs'
import path from 'path';
import { fileURLToPath } from "url";

import OtpMailer from '../config/nodeMail.js'

const sendOtp = async (code, to, status, html = "EmailView.html") => {

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const htmlPath = path.join(__dirname, "../view", html);
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