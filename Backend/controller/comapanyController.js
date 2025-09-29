import bcrypt from 'bcrypt'
import { randomInt } from 'crypto'
import { v2 as cloudinary } from 'cloudinary'
import Company from '../models/Company.js'
import generateToken from '../utils/generateToken.js'
import Job from '../models/Job.js'
import Otp from '../models/Otp.js'
import JobApplication from '../models/jobApplicarion.js'
import sendOtp from '../utils/sendOtp.js'

//sending OTP _ pre-register
export const sendingOTP = async (req, res) => {

    try {

        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.json({ success: false, message: "داده ها از دست رفته" })
        }
        let isCompanyExist = await Company.findOne({ email })
        const isOTPExist = await Otp.findOne({ email })
        if (isCompanyExist?.email) {
            return res.json({ success: false, message: "درحال حاضر این شرکت وجود دارد" })
        } else if (isOTPExist) {
            return res.json({ success: false, message: "هنوز کد قبلی منقضی نشده است" })
        }
        const salt = await bcrypt.genSalt(10)
        const code = String(randomInt(1000, 10000))
        const hashCode = await bcrypt.hash(code, salt)
        let result = await sendOtp(code, email, "ایجاد")

        if (!result) return res.json({ success: false })

        const otp = await Otp.create({
            email,
            code: hashCode,
            expiresAt: Date.now() + 120000
        })

        res.json({ success: true, expiresAt: otp.expiresAt })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
//re_sending OTP code _ pre-register
export const reSendOtp = async (req, res) => {
    try {
        const { email } = req.body

        if (!email)
            return res.json({ success: false, message: "!ابتدا ایمیل را وارد کنید" })

        const salt = await bcrypt.genSalt(10)
        const code = String(randomInt(1000, 10000))

        const hashCode = await bcrypt.hash(code, salt)
        let result = await sendOtp(code, email, "ایجاد")

        if (!result) return res.json({ success: false })


        const otp = await Otp.create({
            email,
            code: hashCode,
            expiresAt: Date.now() + 120000
        })

        res.json({ success: true, expiresAt: otp.expiresAt })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
//Register a new Company 
export const registerCompany = async (req, res) => {
    const { name, email, password } = req.body
    try {

        const salt = await bcrypt.genSalt(10)
        const hashPasword = await bcrypt.hash(password, salt)
        let companyData = {
            name,
            email,
            password: hashPasword,
            image: ""
        }

        if (req.file?.path) {
            const imageUpload = await cloudinary.uploader.upload(req.file.path, {
                transformation: [
                    { width: 500, crop: 'fill', gravity: 'face' },
                    { quality: 'auto', fetch_format: "auto" }
                ]
            })
            companyData.image = imageUpload.secure_url

        }

        const company = await Company.create(companyData)

        res.json({
            success: true,
            company,
            token: generateToken(company._id)
        })

    } catch (error) {

        res.json({ success: false, message: error.message })
    }
}
//Company Login
export const loginCompany = async (req, res) => {
    const { email, password } = req.body

    try {
        const company = await Company.findOne({ email })

        if (!company.email) {
            return res.json({ success: false, message: "شرکت نامعتبر است" })
        }
        const isPassMatch = await bcrypt.compare(password, company.password)

        if (isPassMatch) {
            res.json({
                success: true,
                company: {
                    _id: company._id,
                    name: company.name,
                    email: company.email,
                    image: company.image
                },
                token: generateToken(company._id)
            })
        } else {
            res.json({ success: false, message: "ایمیل یا پسور اشتباه است" })
        }
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
//update Company Profiel
export const updateCompany = async (req, res) => {
    let errors = []
    try {

        const { name, password, newPassword } = req.body
        let updatedCompany = {}
        const companyId = req.company._id


        if (!name && (!password || !newPassword) && newPassword === password) {
            return res.json({ success: false })
        }



        name !== req.company.name ? updatedCompany["name"] = name : null

        if (req.file?.path) {
            const uploadImage = await cloudinary.uploader.upload(req.file.path,
                {
                    transformation: [
                        { width: 500, crop: 'fill', gravity: 'face' },
                        { quality: 'auto', fetch_format: "auto" }
                    ]
                })
            updatedCompany['image'] = uploadImage.secure_url
        }


        //update password , if there is a password

        if (password && newPassword) {

            const company = await Company.findOne({ _id: companyId }).select('password')

            const isPass = await bcrypt.compare(password, company.password)
            if (!isPass) {
                errors.push("رمز عبور اشتباه است")
                return res.json({ success: false, message: errors })
            }

            const salt = await bcrypt.genSalt(10)
            updatedCompany['password'] = await bcrypt.hash(newPassword, salt)

        } else if (password || newPassword) errors.push("هم پسورد فعلی هم پسورد جدید باید مقدار دهی شود")


        if (Object.keys(updatedCompany).length)
            await Company.updateOne({ _id: companyId }, { ...updatedCompany })
        else {
            errors.push("مقادیر تکراری هستند")
            return res.json({ success: false, message: errors })
        }
        res.json({ success: true, message: "اطلاعات با موفقیت بروز گردید" })

    } catch (error) {
        errors.push(error.message)
        res.json({ success: false, errors })

    }
}
//Get company data
export const getCompanyData = async (req, res) => {

    try {
        const company = req.company

        res.json({ success: true, company })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
//post a new job
export const postJob = async (req, res) => {
    const { title, description, salary, location, level, category } = req.body

    const companyId = req.company._id

    try {
        const newJob = new Job({
            title,
            description,
            salary,
            location,
            date: Date.now(),
            level,
            category,
            companyId
        })
        await newJob.save()
        res.json({ success: true, message: "کار با موفقیت ایجاد شد" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
//delete a job
export const removeJobs = async (req, res) => {

    try {
        const { ids } = req.body

        await JobApplication.deleteMany({ jobId: { $in: ids } })
        await Job.deleteMany({ _id: { $in: ids } })

        ids.length > 1
            ? res.json({ success: true, message: "کارها با موفقیت حذف گردیدند" })
            : res.json({ success: true, message: "کار با موفقیت حذف گردید" })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
//update job
export const UpdateJob = async (req, res) => {
    const { jobId, title, description, salary, location, level, category } = req.body

    try {
        await Job.findByIdAndUpdate(jobId,
            {
                title,
                description,
                salary,
                location,
                level,
                category,
                updatedAt: Date.now()
            }
        )
        res.json({ success: true, message: "کار مورد نظر با موفقیت بروز شد" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
//get company job applicants
export const getCompanyJobApplicants = async (req, res) => {
    try {
        const companyId = req.company._id
        const applications = await JobApplication.find({ companyId })
            .populate('userId', 'name image resume')
            .populate('jobId', 'title location salary level category')
            .exec()
        res.json({ success: true, applications })
    } catch (error) {
        res.json({ success: false, message: error.message })

    }
}
//get company posted jobs 
export const getCompanyPostedJobs = async (req, res) => {
    try {
        const companyId = req.company._id
        const jobs = await Job.find({ companyId })
        const jobsData = await Promise.all(jobs.map(async (job) => {
            const applicants = await JobApplication.find({ jobId: job._id })
            return { ...job.toObject(), applicants: applicants.length }
        }))
        res.json({ success: true, jobsData })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
//Change Job Applications Status 
export const changeJobApplicationsStatus = async (req, res) => {
    try {
        const { id, status } = req.body
        await JobApplication.findOneAndUpdate({ _id: id }, { status })
        res.json({ success: true, message: "وضعیت تغییر کرد" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

//change Job Visibility
export const changeJobVisibility = async (req, res) => {
    try {

        const { id } = req.body

        const companyId = req.company._id

        const job = await Job.findById(id)

        if (job.companyId.toString() == companyId.toString()) {
            job.visible = !job.visible
        }

        await job.save()
        res.json({ success: true, job })

    } catch (error) {

        res.json({ success: false, message: error.message })
    }
}