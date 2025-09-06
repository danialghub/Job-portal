import express from 'express'
import { getJobs, getJobById } from '../controller/jobController.js'
const router = express.Router()

//Route to get All jobs
router.get('/', getJobs)

//Route to get a single job by ID
router.get('/:id', getJobById)



export default router  