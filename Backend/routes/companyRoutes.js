import express from 'express'
import { changeJobApplicationsStatus, changeJobVisibility, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany } from '../controller/comapanyController.js'
import upload from '../config/multer.js'
import { protectCompany } from '../middlewares/auth.js'
const router = express.Router()

//Register a company
router.post('/register', upload.single('image'), registerCompany)

//company login 
router.post('/login', loginCompany)

//Get Company Data
router.get('/company', protectCompany, getCompanyData)

//Post A Job
router.post('/post-job', protectCompany, postJob)

//Get Applicants Data Of Company
router.get('/applicants',protectCompany, getCompanyJobApplicants)

//Get Applicants Data Of Company
router.get('/list-jobs',protectCompany, getCompanyPostedJobs)

//Get Applicants Data Of Company
router.post('/change-status',protectCompany, changeJobApplicationsStatus)

//Get Applicants Data Of Company
router.post('/change-visiblity',protectCompany, changeJobVisibility)

export default router