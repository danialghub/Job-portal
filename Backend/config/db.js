import mongoose from "mongoose";

//function to connect to the mongodb
const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log('Database Connected'));
    await mongoose.connect(`${process.env.MONGODB}/job-portal`)

}
export default connectDB