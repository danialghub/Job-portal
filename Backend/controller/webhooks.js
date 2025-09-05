import { Webhook } from "svix";
import User from "../models/User.js";

//API Controller Function to Manage Clerk User with DB
export const clerkWebHooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        //verify webhooks
        await whook.verify(JSON.stringify(req.body), {
            'svix-id': req.headers["svix-id"],
            'svix-timestamp': req.headers['svix-timestamp'],
            'svix-signature': req.headers['svix-signature']
        })
        //Getting Data from request body
        const { data, type } = req.body
        switch (type) {
            case 'user.created': {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    image: data.image_url,
                    resume: ''
                }
                await User.create(userData)
                res.json({ _id })
                break;
            }
            case 'user.updated': {
                const updatedUserData = {
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    image: data.image_url,
                }
                await User.findByIdAndUpdate(data.id, updatedUserData)
                res.json({ status: "updated" })
                break;
            }
            case 'user.deleted': {
                await User.findByIdAndDelete(data.id)
                res.json({ status: "deleted" })
                break;
            }
            default: break;
        }
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Webhook Error!" })

    }
}