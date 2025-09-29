import jwt from 'jsonwebtoken'
import Company from '../models/Company.js'
import Otp from '../models/Otp.js'
import bcrypt from 'bcrypt'
import rateLimit from 'express-rate-limit'

export const protectCompany =  (req, res, next) => {
  const token = req.headers.token
  if (!token) {
    return res.json({ success: false, message: "احراز هویت انجام نشد ، مجدد تلاش کنید" })
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET, async(err, decoded) => {
      if (err) 
        return res.sendStatus(401)

        req.company = await Company.findById(decoded.id).select("-password")
        next()
    });

  } catch (error) {
    return res.json({ success: false, message: error.message })
  }
}
export const authCompany = async (req, res, next) => {
  try {
    const { email, code } = req.body

    const otp = await Otp.findOne({ email })
    if (!(await bcrypt.compare(code, otp.code))) return res.json({ success: false, message: "!کد معتبر نمی باشد" })
    await Otp.findByIdAndDelete(otp._id)
    next()
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}
export const preventMultipleRequests = rateLimit({
  windowMs: 1000 * 60 * 2, // 2 دقیقه
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    // resetTime = تاریخ پایان پنجره
    const resetTime = req.rateLimit.resetTime;
    const retryAfter = Math.ceil((resetTime - Date.now()) / 60000); // دقیقه
    res.status(429).json({
      success: false,
      retryAfter: resetTime,
      message: `خیلی درخواست دادید، لطفا بعد از ${retryAfter} دقیقه مجددا تلاش کنید`
    });
  }

});

