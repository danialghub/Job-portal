import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    resume: { type: String },
    image: { type: String, required: true },
})
userSchema.pre('findOneAndDelete', async function (next) {
    const user = await this.model.findOne(this.getFilter())
    if (user)
        await mongoose.model('JobApplication').deleteMany({ userId: user._id })
    next()
})

const User = mongoose.model('User', userSchema, 'User')

export default User