import User from '../models/User.js'
import Job from '../models/Job.js'
import JobApplication from '../models/jobApplicarion.js'
import { v2 as cloudinary } from 'cloudinary'
//get user data

export const getUserData = async (req, res) => {
    const userId = req.auth().userId

    try {
        const user = await User.findById(userId)

        if (!user) {
            return res.json({ succuss: false, message: "کاربری پیدا نشد" })
        }
        res.json({ succuss: true, user })
    } catch (error) {
        res.json({ succuss: false, message: error.message })
    }
}

//Apply for a job

export const applyForJob = async (req, res) => {
    const { jobId } = req.body

    const userId = req.auth().userId

    try {
        const isAlreadyApplied = await JobApplication.find({ jobId, userId })

        if (isAlreadyApplied.length) {
            return res.json({ success: true, message: "درخواست داده شد" })
        }
        const jobData = await Job.findById(jobId)

        if (!jobData) {
            return res.json({ success: false, message: "کار پیدا نشد" })
        }
        await JobApplication.create({
            companyId: jobData.companyId,
            userId,
            jobId,
            date: Date.now()
        })
        return res.json({ success: true, message: "با موفقیت درخواست داده شد" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

//get user applied applications

export const getUserJobApplications = async (req, res) => {
    try {

        const userId = req.auth().userId

        const application = await JobApplication.find({ userId })
            .populate('companyId', 'name email image')
            .populate('jobId', 'title description location category level salary')
            .exec()
        if (!application.length) {
            return res.json({ succuss: false, message: "هیچ درخواست کاری برای این کاربر پیدا نشد" })
        }
        return res.json({ succuss: true, application })
    } catch (error) {
        res.json({ succuss: false, message: error.message })
    }
}

//update user profile

export const updateUserResume = async (req, res) => {
    try {
        const userId = req.auth().userId
        const resumeFile = req.file

        const userData = await User.findById(userId)
        if (resumeFile) {
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
            userData.resume = resumeUpload.secure_url
            await userData.save()
            return res.json({ succuss: true, message: "رزومه بروزشد" })
        } else {
            res.json({ succuss: false, message: "رزومه آپدیت نشد" })
        }

    } catch (error) {
        res.json({ succuss: false, message: error.message })
    }
}