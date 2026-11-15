import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
const transpoter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL,
        pass:process.env.EMAIL_PASSWORD
    }
})

export default transpoter