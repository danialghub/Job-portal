import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, default: "" },
    isVerified: { type: Boolean, default: false }
})

const Company = mongoose.model('Company', CompanySchema, 'Company')

export default Company