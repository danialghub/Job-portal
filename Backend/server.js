import './config/instrument.js'
import express from 'express'
import * as Sentry from '@sentry/node'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import { clerkWebHooks } from './controller/webhooks.js'
import companyRoutes from './routes/companyRoutes.js'
import connectCloudinary from './config/cloudinary.js'
import jobRoutes from './routes/jobRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { clerkMiddleware } from '@clerk/express'


//Initialize express
const app = express()
//connect to db
await connectDB()
await connectCloudinary()

//Middlewares 
app.set('trust proxy', 1);
app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

//Routes
app.get('/', (req, res) => {
    res.send('API working')
})
app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
});
app.post('/webhooks', clerkWebHooks)
app.use('/api/company', companyRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/users', userRoutes)




Sentry.setupExpressErrorHandler(app)
//Port
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`server is running on ${port}`);

})