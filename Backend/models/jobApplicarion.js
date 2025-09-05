import mongoose from "mongoose";

const JobApplicationSchema = new mongoose.Schema({
    userId: { type: String, ref: 'User', required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', requred: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', requred: true },
    status: { type: String, default: 'در حال انتظار' },
    date: { type: Number, required: true }

})
const JobApplication = mongoose.model('JobApplication', JobApplicationSchema, 'JobApplication')

export default JobApplication