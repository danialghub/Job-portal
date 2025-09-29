import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, default: Date.now() }


})
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const Otp = mongoose.model('Otp', OtpSchema, 'Otp')

export default Otp