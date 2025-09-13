import express from 'express'
import { changeJobApplicationsStatus, changeJobVisibility, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany, removeJobs, updateCompany, UpdateJob } from '../controller/comapanyController.js'
import upload from '../config/multer.js'
import { protectCompany } from '../middlewares/auth.js'

const router = express.Router()

//Register a company
router.post('/register', upload.single('image'), registerCompany)

//company login 
router.post('/login', loginCompany)

//company Update Profile 
router.post('/update-profile', upload.single('image'), protectCompany, updateCompany)

//Get Company Data
router.get('/company', protectCompany, getCompanyData)

//Post A Job
router.post('/post-job', protectCompany, postJob)


//Delete A Job
router.post('/delete-jobs', protectCompany, removeJobs)

//Update A Job
router.put('/update-job', protectCompany, UpdateJob)

//Get Applicants Data Of Company
router.get('/applicants', protectCompany, getCompanyJobApplicants)

//Get Applicants Data Of Company
router.get('/list-jobs', protectCompany, getCompanyPostedJobs)

//Get Applicants Data Of Company
router.post('/change-status', protectCompany, changeJobApplicationsStatus)

//Get Applicants Data Of Company
router.post('/change-visiblity', protectCompany, changeJobVisibility)

export default router