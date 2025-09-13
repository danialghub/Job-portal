import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import User from '../models/User.js'
import Company from '../models/Company.js'
import generateToken from '../utils/generateToken.js'
import Job from '../models/Job.js'
import JobApplication from '../models/jobApplicarion.js'

//Register a new Company 
export const registerCompany = async (req, res) => {
    const { name, email, password } = req.body

    const imageFile = req.file
    let imageUpload;

    if (!name || !email || !password) {
        return res.json({ success: false, message: "داده ها از دست رفته" })
    }

    try {
        const isCompanyExist = await User.findOne({ email })
        if (isCompanyExist) {
            return res.json({ success: false, message: "درحال حاضر این شرکت وجود دارد" })
        }
        const salt = await bcrypt.genSalt(10)
        const hashPasword = await bcrypt.hash(password, salt)

        if (imageFile?.path) {
            imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                transformation: [
                    { width: 500, crop: 'fill', gravity: 'face' },
                    { quality: 'auto', fetch_format: "auto" }
                ]
            })
        }

        const company = await Company.create({
            name,
            email,
            password: hashPasword,
            image: imageUpload?.secure_url || ""
        })
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
    try {

        const { name, password, newPassword } = req.body

        if (!name || !password || !newPassword) {
            return res.json({ success: false, message: "داده ها از دست رفته" })
        }


        const imageFile = req.file
        const companyId = req.company._id
        let imageUpload = '';

        if (imageFile?.path) {
            imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                transformation: [
                    { width: 500, crop: 'fill', gravity: 'face' },
                    { quality: 'auto', fetch_format: "auto" }
                ]
            })
            
        }

        const company = await Company.findOne({ _id: companyId })

        if (!password === company.password)
            return res.json({ success: false, message: "رمز عبور اشتباه است" })


        const salt = await bcrypt.genSalt(10)
        const hashPasword = await bcrypt.hash(newPassword, salt)

        await Company.updateOne({ _id: companyId }, { name, password: hashPasword, image: imageUpload.secure_url })

        res.json({ success: true, message: "اطلاعات با موفقیت بروز گردید" })

    } catch (error) {
        res.json({ success: false, message: error.message })

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