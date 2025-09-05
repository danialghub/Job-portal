import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, requred: true },
    level: { type: String, requred: true },
    salary: { type: Number, requred: true },
    date: { type: Number, requred: true },
    visible: { type: Boolean, default: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', requred: true },
})
const Job = mongoose.model('Job', jobSchema, 'Job')

export default Job