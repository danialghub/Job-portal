import jwt from 'jsonwebtoken'
import Company from '../models/Company.js'
import Otp from '../models/Otp.js'
import bcrypt from 'bcrypt'


export const protectCompany = async (req, res, next) => {
  const token = req.headers.token
  if (!token) {
    return res.json({ success: false, message: "احراز هویت انجام نشد ، مجدد تلاش کنید" })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.company = await Company.findById(decoded.id).select("-password")
    next()

  } catch (error) {
    return res.json({ success: false, message: error.message })
  }
}
export const authCompany = async (req, res, next) => {
  try {
    const { email } = req.body
    const { code } = req.headers
    const otp = await Otp.findOne({ email })
    if (!(await bcrypt.compare(code, otp.code))) return res.json({ success: false, message: "!کد معتبر نمی باشد" })
    req.company = await Company.findOne({ email })
    await Otp.findByIdAndDelete(otp._id)
    next()
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}


