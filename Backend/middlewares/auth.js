import jwt from 'jsonwebtoken'
import Company from '../models/Company.js'
import dns from "dns";


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
export const isAnEmail = async(req,res,next)=>{

}


function checkDomain(email) {
  const domain = email.split("@")[1];
  dns.resolveMx(domain, (err, addresses) => {
    if (err || addresses.length === 0) {
      console.log("Domain does not accept emails.");
    } else {
      console.log("Domain is valid and accepts emails.");
    }
  });
}